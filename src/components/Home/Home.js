import React, { useEffect, useMemo, useRef, useState } from "react";

// FIREBASE IMPORT
import { database } from "../../utilities/firebase";
import { ref, get, push } from "firebase/database";
import { useNavigate, useParams } from "react-router";
import Topbar from "../Common/Topbar";
import { Box, Tab, Tabs } from "@mui/material";
import Messages from "./components/Messages";
import Discover from "./components/Discover";
import Settings from "./components/Settings";
import { CircleLoader } from "../../utilities/components";
import {
  codeToTitle,
  fetchChatData,
  fetchChatKey,
  fetchNodeIDbyUserId,
  fetchUserDataByNode,
  logoutHandler,
} from "../../utilities/utility";
import io from "socket.io-client";

export default function Home() {
  const navigate = useNavigate();
  const [users, setUsers] = useState();
  const [currentUser, setCurrentUser] = useState();
  const [friends, setFriends] = useState([]);
  const [tab, setTab] = useState();
  const [chatData, setChatData] = useState();
  const [sending, setSending] = useState();
  const [intervalId, setIntervalId] = useState(null);
  let tabOptions =
    currentUser?.["friends"] === undefined ||
    currentUser?.["friends"]?.length === 0
      ? []
      : ["messages"];
  tabOptions = [...tabOptions, "discover", "settings"];
  const userID = useParams()?.uId;
  const usersRef = ref(database, "users");
  const isFirstRender = useRef(true);
  const listenerAdded = useRef(false);
  const socket = useMemo(
    () =>
      io.connect("https://tawkup-2.onrender.com", {
        transports: ["websocket"],
      }),
      // io.connect("http://localhost:5000", {
      //   transports: ["websocket"],
      // }),
    []
  );
  const fetchCurrentUser = async () => {
    const userNode = await fetchNodeIDbyUserId(userID, usersRef);
    if (userNode && userNode !== null) {
      const existingData = await fetchUserDataByNode(userNode);
      setCurrentUser({ ...existingData });
      setFriends(existingData?.["friends"] ?? []);
      if (isFirstRender.current === true) {
        (existingData?.["friends"] ?? []).length === 0
          ? setTab("discover")
          : setTab("messages");
        socket.emit("setUser", { id: existingData?.["uid"] });
        isFirstRender.current = false;
      }
    }
  };

  const fetchAllUsers = async () => {
    try {
      const snapshot = await get(usersRef);
      const usersData = snapshot.val();
      const userArr = [];
      Object.keys(usersData).forEach((key) => {
        if (usersData[key]["uid"] !== userID) {
          userArr.push({
            userID: key,
            ...usersData[key],
          });
        }
      });
      setUsers([...userArr]);
    } catch (error) {
      console.error("Error fetching user data:", error.message);
    }
  };

  const checkUserStatus = async (receiverId, activeUsersRef) => {
    const node = await fetchNodeIDbyUserId(receiverId, activeUsersRef);
    const user = ref(database, `active/${node}`);
    const snapshot = await get(user);
    const chatExists = snapshot.exists();
    return chatExists;
  };

  const sendMessage = async (receiverId, message) => {
    if (message && message !== "") {
      const activeUsersRef = ref(database, `active`);
      const active = await checkUserStatus(receiverId, activeUsersRef);
      if (active === false) {
        fetchChatKey(currentUser, receiverId).then((chatKey) => {
          const newMessage = {
            sender: currentUser["uid"],
            message: message,
          };
          const finalRef = ref(database, chatKey);
          push(finalRef, newMessage).then(() => {
            fetchChatData(currentUser, receiverId).then((res) => {
              setSending(undefined);
              setChatData([...res]);
            });
          });
        });
      } else {
        console.log("in else", receiverId, message);
        socket.emit("privateMessage", { receiverId, message });
        checkMessageInDB(receiverId);
      }
    }
  };

  const checkMessageInDB = (receiverId) => {
    const interval = setInterval(() => {
      fetchChatData(currentUser, receiverId).then((res) => {
        if (res.length !== chatData?.length) {
          setSending(undefined);
          setChatData([...res]);
          clearInterval(interval);
        }
      });
    }, 2000);
  };

  useEffect(() => {
    fetchAllUsers();
    fetchCurrentUser();

    function handleBeforeUnload() {
      logoutHandler(currentUser?.["uid"]);
      navigate("../../auth/login");
    }

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  useEffect(() => {
    if (currentUser && listenerAdded.current === false) {
      socket.on("privateMessage", (message) => {
        const senderID = message["userId"];
        fetchChatKey(currentUser, senderID).then((chatKey) => {
          const newMessage = {
            sender: senderID,
            message: message["message"],
          };
          const finalRef = ref(database, chatKey);
          push(finalRef, newMessage).then(() => {
            fetchChatData(currentUser, senderID).then((res) => {
              setChatData([...res]);
            });
          });
        });
      });
      listenerAdded.current = true;
    }
  }, [currentUser]);

  const renderTabs = () => {
    switch (tab) {
      case "messages":
        return (
          <Messages
            users={users}
            currentUser={currentUser}
            fetchAllUsers={fetchAllUsers}
            fetchCurrentUser={fetchCurrentUser}
            sendMessage={sendMessage}
            chatData={chatData}
            setChatData={setChatData}
            sending={sending}
            setSending={setSending}
          />
        );
      case "discover":
        return (
          <Discover
            users={users}
            currentUser={currentUser}
            fetchAllUsers={fetchAllUsers}
            fetchCurrentUser={fetchCurrentUser}
          />
        );
      case "settings":
        return <Settings />;
      default:
        return <Messages />;
    }
  };

  return (
    <>
      <Topbar currentUser={currentUser} tab={tab} setTab={setTab} />
      <Box
        sx={{
          display: {
            xs: "flex",
            sm: "none",
          },
          padding: "10px 0",
          justifyContent: 'center'
        }}
      >
        <Tabs
          value={tab}
          onChange={(e, val) => setTab(val)}
          aria-label="disabled tabs example"
          indicatorColor="secondary"
          textColor="secondary"
          sx={{
            display: {
              xs: "block",
              sm: "none",
            },
          }}
        >
          {tabOptions.map((option) => {
            return (
              <Tab label={codeToTitle(option)} value={option} key={option} />
            );
          })}
        </Tabs>
      </Box>
      <div
        style={{
          backgroundColor: "#f8f6f8",
          padding: "20px 0",
        }}
      >
        <Box
          sx={{
            width: {
              xs: "98%",
              sm: "95%",
              md: "90%",
            },
            margin: "auto",
            boxShadow: "rgba(0, 0, 0, 0.05) 0px 0px 0px 1px",
            borderRadius: "4px",
            backgroundColor: "white",
          }}
        >
          {tab ? renderTabs() : CircleLoader}
        </Box>
      </div>
    </>
  );
}
