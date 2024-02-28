import { Box, Button, Typography } from "@mui/material";
import React from "react";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import Avatar from "../../../assets/images/userOne.jpg";

export default function ProfilePreview({ currentUser, chatOpened }) {
  return (
    <Box>
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
          Profile
        </Box>
        <Box>
          <Button>
            <MoreHorizIcon />
          </Button>
        </Box>
      </Box>
      <img
        src={Avatar}
        alt="avatar-preview"
        style={{
          width: "80%",
          borderRadius: "50%",
        }}
      />
      <Typography
        sx={{
          fontSize: "16px",
          // fontWeight: "bold",
        }}
      >
        {chatOpened?.["firstName"]} {chatOpened?.["lastName"]}
      </Typography>
      <Box sx={{
        width: '80%',
        margin: '10px auto',
        boxShadow: "rgba(0, 0, 0, 0.05) 0px 0px 0px 1px",
        boxSizing: 'border-box',
        padding: '10px 10px',
        borderRadius: '4px'
      }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            margin: '10px 0'
          }}
        >
          <Typography
            sx={{
              fontSize: "14px",
              // fontWeight: "bold",
            }}
          >
            Email
          </Typography>
          <Typography
            sx={{
              opacity: "80%",
              fontSize: "14px",
            }}
          >
            {chatOpened?.["email"]}
          </Typography>
        </Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            margin: '10px 0'
          }}
        >
          <Typography
            sx={{
              fontSize: "14px",
              // fontWeight: "bold",
            }}
          >
            Mobile
          </Typography>
          <Typography
            sx={{
              opacity: "80%",
              fontSize: "14px",
            }}
          >
            {chatOpened?.["mobile"]}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
