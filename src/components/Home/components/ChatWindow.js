import React, { useEffect, useState } from "react";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { Box, Button, Typography } from "@mui/material";
import { CircleLoader } from "../../../utilities/components";
import Texture from "../../../assets/images/bgTexture.png";
import SendIcon from "@mui/icons-material/Send";
import "./ChatWindow.css";
import { fetchChatData, fetchChatKey } from "../../../utilities/utility";
import { get, ref } from "firebase/database";
import { database } from "../../../utilities/firebase";
import Avatar from "../../../assets/images/userOne.jpg";

export default function ChatWindow({
  currentUser,
  chatOpened,
  sendMessage,
  chatInput,
  setChatInput,
  chatData,
  setChatData,
}) {
  const [chatLoad, setChatLoad] = useState(true);

  const handleSendMessage = async () => {
    setChatInput("");
    await sendMessage(chatOpened["uid"], chatInput);
    const chat = await fetchChatData(currentUser, chatOpened["uid"]);
    setChatData([...chat]);
  };

  useEffect(() => {
    if (chatOpened) {
      setChatData([]);
      setChatLoad(true);
      fetchChatData(currentUser, chatOpened["uid"]).then((res) => {
        setChatData([...res]);
        setChatLoad(false);
      });
    }
  }, [chatOpened]);

  return (
    <>
      {chatLoad === false ? (
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
              {chatOpened["firstName"]} {chatOpened["lastName"]}
            </Box>
            <Box>
              <Button>
                <MoreHorizIcon />
              </Button>
            </Box>
          </Box>
          <Box
            sx={{
              backgroundImage: `url(${Texture})`,
              backgroundSize: "cover", // Adjust the background size as needed
              backgroundPosition: "center",
              height: "70vh",
              overflowY: "scroll",
            }}
          >
            {chatData.map((chat) => {
              return (
                <Box
                  sx={{
                    width: "100%",
                    display: "flex",
                    justifyContent:
                      chat["sender"] === currentUser["uid"] ? "end" : "start",
                    margin: "5px 0",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection:
                        chat["sender"] === currentUser["uid"]
                          ? "row-reverse"
                          : "row",
                    }}
                  >
                    <img
                      src={Avatar}
                      alt="chat-avatar"
                      style={{
                        width: "40px",
                        borderRadius: "50%",
                        margin: "0 10px",
                      }}
                    />
                    <Box
                      sx={{
                        textWrap: "wrap",
                        boxShadow: "rgba(0, 0, 0, 0.05) 0px 0px 0px 1px",
                        backgroundColor:
                          chat["sender"] === currentUser["uid"]
                            ? "white"
                            : "#9c27b0",
                        color:
                          chat["sender"] === currentUser["uid"]
                            ? "black"
                            : "white",
                        padding: "5px 15px",
                        borderRadius: "20px",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <p className="chat-text">{chat["message"]}</p>
                    </Box>
                  </Box>
                </Box>
              );
            })}
          </Box>
          <Box
            sx={{
              width: "100%",
              backgroundImage: `url(${Texture})`,
              backgroundSize: "cover", // Adjust the background size as needed
              backgroundPosition: "center",
            }}
          >
            <div className="chat-input-container">
              <input
                className="chat-input"
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Type something"
                onKeyUp={(e) => {
                  if (e.keyCode === 13) {
                    handleSendMessage();
                  }
                }}
              />
              <button onClick={() => handleSendMessage()}>
                <SendIcon />
              </button>
            </div>
          </Box>
        </>
      ) : (
        CircleLoader
      )}
    </>
  );
}
