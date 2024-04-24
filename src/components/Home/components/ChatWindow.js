import React, { useEffect, useState } from "react";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { Box, Button, CircularProgress, Typography } from "@mui/material";
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
  sending,
  setSending,
}) {
  const [chatLoad, setChatLoad] = useState(true);

  const handleSendMessage = async () => {
    setSending({
      sender: currentUser["uid"],
      message: chatInput,
    });
    setChatInput("");
    await sendMessage(chatOpened["uid"], chatInput);
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

  useEffect(() => {
    if (chatLoad === false) {
      var contentContainer = document.querySelector("#chat-div");
      contentContainer.scrollTop = contentContainer.scrollHeight;
    }
  }, [chatLoad]);

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
          {/* <Box
            sx={}
          > */}
          <div
            id="chat-div"
            style={{
              backgroundImage: `url(${Texture})`,
              backgroundSize: "cover", // Adjust the background size as needed
              backgroundPosition: "center",
              height: "70vh",
              overflowY: "scroll",
            }}
          >
            {(sending ? [...chatData, sending] : chatData).map(
              (chat, index) => {
                return (
                  <Box
                    sx={{
                      width: "100%",
                      display: "flex",
                      justifyContent:
                        chat["sender"] === currentUser["uid"] ? "end" : "start",
                      margin: "5px 0",
                    }}
                    key={`${chat["message"]}-${index}`}
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
                          opacity:
                            sending && index === chatData.length
                              ? "35%"
                              : "100%",
                        }}
                      >
                        <p className="chat-text">
                          {chat["message"]}{" "}
                          {sending && index === chatData.length && (
                            <CircularProgress
                              size={14}
                              sx={{
                                marginLeft: "5px",
                              }}
                            />
                          )}
                        </p>
                      </Box>
                    </Box>
                  </Box>
                );
              }
            )}
          </div>
          {/* </Box> */}
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
