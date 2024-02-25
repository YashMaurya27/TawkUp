import React, { useEffect, useState } from "react";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { Box, Button } from "@mui/material";
import { CircleLoader } from "../../../utilities/components";
import Texture from "../../../assets/images/bgTexture.png";
import SendIcon from '@mui/icons-material/Send';
import "./ChatWindow.css";

export default function ChatWindow({ chatOpened, sendMessage, chatInput, setChatInput }) {
  const [chatLoad, setChatLoad] = useState(true);

  useEffect(() => {
    if (chatOpened) {
      setChatLoad(false);
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
            }}
          ></Box>
          <Box
            sx={{
              position: "absolute",
              bottom: "0",
              width: "100%",
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
                  if(e.keyCode === 13) {
                    console.log('enter press', chatInput);
                    sendMessage(chatOpened['uid'], chatInput);
                  }
                }}
              />
              <button onClick={() => sendMessage(chatOpened['uid'], chatInput)}><SendIcon /></button>
            </div>
          </Box>
        </>
      ) : (
        CircleLoader
      )}
    </>
  );
}
