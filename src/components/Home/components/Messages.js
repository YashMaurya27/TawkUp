import { Box } from "@mui/material";
import React, { useEffect, useState } from "react";
import TextList from "./TextList";
import ChatWindow from "./ChatWindow";
import ProfilePreview from "./ProfilePreview";

export default function Messages({
  users,
  currentUser,
  fetchAllUsers,
  fetchCurrentUser,
  sendMessage,
  chatData,
  setChatData
}) {

  const [chatOpened, setChatOpened] = useState();
  const [chatInput, setChatInput] = useState();

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
      }}
    >
      <Box
        sx={{
          width: {
            xs: "100%",
            sm: "25%",
          },
          display: {
            xs: "block",
            sm: "block",
          },
          borderRight: "1px solid rgba(0, 0, 0, 0.05)",
        }}
      >
        <TextList
          users={users}
          currentUser={currentUser}
          fetchAllUsers={fetchAllUsers}
          fetchCurrentUser={fetchCurrentUser}
          chatOpened={chatOpened}
          setChatOpened={setChatOpened}
        />
      </Box>
      <Box
        sx={{
          width: {
            sm: "50%",
          },
          display: {
            xs: "none",
            sm: "flex",
          },
          flexDirection: 'column',
          justifyContent: 'space-between',
          borderRight: "1px solid rgba(0, 0, 0, 0.05)",
          // position: "relative",
          height: "80vh",
        }}
      >
        <ChatWindow
          currentUser={currentUser}
          chatOpened={chatOpened}
          sendMessage={sendMessage}
          chatInput={chatInput}
          setChatInput={setChatInput}
          chatData={chatData}
          setChatData={setChatData}
        />
      </Box>
      <Box
        sx={{
          width: {
            sm: "25%",
          },
          display: {
            xs: "none",
            sm: "block",
          },
        }}
      >
        <ProfilePreview />
      </Box>
    </Box>
  );
}
