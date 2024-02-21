import React, { useEffect, useState } from "react";

// FIREBASE IMPORT
import { database } from "../../utilities/firebase";
import { ref, get, query, orderByChild, equalTo } from "firebase/database";
import { useParams } from "react-router";
import Topbar from "../Common/Topbar";
import { Box } from "@mui/material";
import Messages from "./components/Messages";
import Discover from "./components/Discover";
import Settings from "./components/Settings";
import { CircleLoader } from "../../utilities/components";

export default function Home() {
  const [users, setUsers] = useState();
  const [currentUser, setCurrentUser] = useState();
  const [friends, setFriends] = useState([]);
  const [tab, setTab] = useState();
  const userID = useParams()?.uId;
  const usersRef = ref(database, "users");

  const fetchCurrentUser = async () => {
    const userQuery = query(usersRef, orderByChild("uid"), equalTo(userID));
    const querySnapshot = await get(userQuery);
    if (querySnapshot.exists()) {
      const userNode = Object.keys(querySnapshot.val())[0];
      const userRef = ref(database, `users/${userNode}`);
      const snapshot = await get(userRef);
      const existingData = snapshot.val();
      setCurrentUser({ ...existingData });
      setFriends(existingData?.["friends"] ?? []);
      (existingData?.["friends"] ?? []).length === 0
        ? setTab("discover")
        : setTab("messages");
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
            "userID": key,
            ...usersData[key],
          });
        }
      });
      setUsers([...userArr]);
    } catch (error) {
      console.error("Error fetching user data:", error.message);
    }
  };
  useEffect(() => {
    fetchAllUsers();
    fetchCurrentUser();
  }, []);

  const renderTabs = () => {
    switch (tab) {
      case "messages":
        return <Messages />;
      case "discover":
        return <Discover users={users} currentUser={currentUser} fetchAllUsers={fetchAllUsers} />;
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
          width: {
            xs: "98%",
            sm: "95%",
            md: "90%",
          },
          margin: "auto",
          boxShadow: "rgba(0, 0, 0, 0.05) 0px 0px 0px 1px",
          padding: "20px 20px",
          borderRadius: "4px",
        }}
      >
        {tab ? renderTabs() : CircleLoader}
      </Box>
    </>
  );
}
