import { Box, Button, CircularProgress, Skeleton } from "@mui/material";
import React, { useEffect, useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import { fetchUserDataByNode } from "../../../utilities/utility";
import Avatar from "../../../assets/images/userOne.jpg";
import "./TextList.css";

export default function TextList({
  users,
  currentUser,
  fetchAllUsers,
  fetchCurrentUser,
  chatOpened,
  setChatOpened,
}) {
  const [friendsData, setFriendsData] = useState();
  const [friendsLoad, setFriendsLoad] = useState(false);
  const [hovered, setHovered] = useState();

  const fetchAllFriends = async (friendArr) => {
    setFriendsLoad(true);
    const promises = friendArr.map(async (friend) => {
      const data = await fetchUserDataByNode(friend);
      return data;
    });
    const friendsDataArr = await Promise.all(promises);
    setFriendsData([...friendsDataArr]);
    setChatOpened(friendsDataArr[0]);
    setFriendsLoad(false);
  };

  useEffect(() => {
    if (currentUser?.["friends"]?.length > 0) {
      fetchAllFriends(currentUser["friends"]);
    }
  }, [currentUser?.["friends"]]);

  return (
    <>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          boxSizing: "border-box",
          padding: "5px 10px",
          borderBottom: "1px solid rgba(0, 0, 0, 0.05)",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
          }}
        >
          Messages{" "}
          {friendsLoad === true && (
            <CircularProgress
              size={18}
              sx={{
                margin: "0 20px",
              }}
              color="inherit"
            />
          )}
        </Box>
        <Box>
          <Button>
            <AddIcon />
          </Button>
        </Box>
      </Box>
      <Box>
        {friendsData ? (
          friendsData?.map((friend) => {
            return (
              <div
                className="contact-container"
                style={{
                  backgroundColor:
                    friend["uid"] === chatOpened["uid"]
                      ? hovered === friend["uid"]
                        ? "#e0ccff" 
                        : "#f4e6ff" 
                      : hovered === friend["uid"]
                      ? "#f0f0f0" 
                      : "white", 
                  transition: "background-color 0.3s ease",
                }}
                key={`${friend["uid"]}-box`}
                onClick={() => {
                  setChatOpened(friend);
                }}
                onMouseEnter={() => {
                  setHovered(friend['uid']);
                }}
                onMouseLeave={() => {
                  setHovered(undefined);
                }}
              >
                <img className="contact-avatar" src={Avatar} alt="Contact" />
                <Box
                  sx={{
                    padding: "5px 10px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    textAlign: "start",
                    width: "-webkit-fill-available",
                  }}
                >
                  <p className="contact-header">
                    {friend?.["firstName"]} {friend?.["lastName"]}
                  </p>
                  <p className="contact-message">Say Hi!</p>
                </Box>
              </div>
            );
          })
        ) : (
          <Box>
            {Array(3)
              .fill(1)
              .map((item) => {
                return (
                  <Skeleton
                    sx={{
                      width: "80%",
                      margin: "10px auto",
                      height: "40px",
                    }}
                    key={`${item}-skeleton`}
                  />
                );
              })}
          </Box>
        )}
      </Box>
    </>
  );
}
