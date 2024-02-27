import React, { useEffect, useMemo, useRef, useState } from "react";

// FIREBASE IMPORT
import { database } from "../../utilities/firebase";
import { ref, get, push } from "firebase/database";
import { useParams } from "react-router";
import Topbar from "../Common/Topbar";
import { Box } from "@mui/material";
import Messages from "./components/Messages";
import Discover from "./components/Discover";
import Settings from "./components/Settings";
import { CircleLoader } from "../../utilities/components";
import {
  fetchChatData,
  fetchChatKey,
  fetchNodeIDbyUserId,
  fetchUserDataByNode,
} from "../../utilities/utility";
import io from "socket.io-client";

export default function Home() {
  const [users, setUsers] = useState();
  const [currentUser, setCurrentUser] = useState();
  const [friends, setFriends] = useState([]);
  const [tab, setTab] = useState();
  const [chatData, setChatData] = useState();
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

  const sendMessage = async (receiverId, message) => {
    if (message) {
      socket.emit("privateMessage", { receiverId, message });
      console.log("message sent to", receiverId, message);
      console.log("socket", socket);
      // const myNodeID = fetchNodeIDbyUserId(currentUser["uid"]);
      const chatKey = await fetchChatKey(currentUser, receiverId);
      const newMessage = {
        sender: currentUser["uid"],
        message: message,
      };
      const finalRef = ref(database, chatKey);
      await push(finalRef, newMessage);
    }
  };

  useEffect(() => {
    fetchAllUsers();
    fetchCurrentUser();
  }, []);

  useEffect(() => {
    if (currentUser && listenerAdded.current === false) {
      socket.on("privateMessage", (message) => {
        console.log("privateMessage listener", message);
        console.log(
          "fetching data with these params",
          currentUser,
          message["senderId"]
        );
        fetchChatData(currentUser, message["userId"]).then((res) => {
          console.log("fetched chat data", res);
          setChatData([...res]);
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
