import { Box, Button, CircularProgress } from "@mui/material";
import React, { useEffect, useState } from "react";
import Avatar from "../../../assets/images/userOne.jpg";
import "./Discover.css";
import { Add } from "@mui/icons-material";
import { database } from "../../../utilities/firebase";
import { get, ref, update } from "firebase/database";
import { fetchCurrentTime } from "../../../utilities/utility";
import RemoveIcon from "@mui/icons-material/Remove";

export default function Discover({ users, currentUser, ...props }) {
  const [requestLoad, setRequestLoad] = useState();

  const connectHandler = async (user) => {
    setRequestLoad(user['uid']);
    const userRef = ref(database, `users/${user["userID"]}`);
    const snapshot = await get(userRef);
    const existingData = snapshot.val();
    let requests = existingData?.["requests"] ?? [];
    const ts = fetchCurrentTime();
    const alreadySent = requests.some(
      (request) => request["from"]["uid"] === currentUser["uid"]
    );
    if (!alreadySent) {
      requests.push({
        from: currentUser,
        timeStamp: ts,
      });
    } else {
      requests = requests.filter(
        (request) => request["from"]["uid"] !== currentUser["uid"]
      );
    }
    const updatedData = {
      ...existingData,
      requests,
    };
    await update(userRef, updatedData);
    await props.fetchAllUsers();
    setRequestLoad(undefined);
  };

  const checkRequestStatus = (requestArr) => {
    let sent = false;
    if (requestArr?.length > 0) {
      sent = requestArr.some(
        (request) => request["from"]["uid"] === currentUser["uid"]
      );
    }
    return sent;
  };

  return (
    <>
      <Box
        sx={{
          textAlign: "start",
        }}
      >
        <h2>Discover People</h2>
        <p>
          Find and connect with new friends and interesting individuals within
          our community. Explore profiles, add friends, and start conversations
          to expand your social circle and engage in meaningful interactions.
        </p>
      </Box>
      <hr />
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
        }}
      >
        {users ? (
          users.map((user) => {
            return (
              <div className="user-card" key={user?.["email"]}>
                <img src={Avatar} alt="user-pic" />
                <p>
                  {user?.["firstName"]} {user?.["lastName"]}
                </p>
                <hr />
                <div className="card-row">
                  <p>
                    <b>Email :</b>
                  </p>
                  <p>{user?.["email"]}</p>
                </div>
                <div className="card-row">
                  <p>
                    <b>Phone :</b>
                  </p>
                  <p>{user?.["mobile"]}</p>
                </div>
                <Button
                  sx={{
                    textTransform: "none",
                    margin: "10px 0",
                  }}
                  fullWidth
                  startIcon={
                    checkRequestStatus(user?.["requests"]) === true ? (
                      <RemoveIcon />
                    ) : (
                      <Add />
                    )
                  }
                  disabled={requestLoad === user['uid']}
                  color="secondary"
                  variant="contained"
                  onClick={() => connectHandler(user)}
                >
                  {requestLoad === user['uid'] ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : checkRequestStatus(user?.["requests"]) === true ? (
                    "Unsend"
                  ) : (
                    "Connect"
                  )}
                </Button>
              </div>
            );
          })
        ) : (
          <></>
        )}
      </Box>
    </>
  );
}
