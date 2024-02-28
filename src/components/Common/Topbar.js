import React, { useState } from "react";
import "./index.css";
import { Box, Button, Skeleton, Tab, Tabs, Typography } from "@mui/material";
import Logo from "../../assets/images/logoTwo.jpg";
import Avatar from "../../assets/images/userOne.jpg";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { codeToTitle, fetchNodeIDbyUserId } from "../../utilities/utility";
import Popover from "@mui/material/Popover";
import LogoutIcon from "@mui/icons-material/Logout";
import SettingsIcon from "@mui/icons-material/Settings";
import { useNavigate } from "react-router";
import { database } from "../../utilities/firebase";
import { ref, remove } from "firebase/database";

export default function Topbar(props) {
  const navigate = useNavigate();
  let tabOptions =
    props.currentUser?.["friends"] === undefined ||
    props.currentUser?.["friends"]?.length === 0
      ? []
      : ["messages"];
  tabOptions = [...tabOptions, "discover", "settings"];
  const [anchorEl, setAnchorEl] = useState(null);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;
  return (
    <header className="header">
      <div className="header-logo">
        <img src={Logo} alt="Tawk-logo" />
      </div>
      <div className="header-nav">
        {props.tab ? (
          <Tabs
            value={props.tab}
            onChange={(e, val) => props.setTab(val)}
            aria-label="disabled tabs example"
            indicatorColor="secondary"
            textColor="secondary"
          >
            {tabOptions.map((option) => {
              return (
                <Tab label={codeToTitle(option)} value={option} key={option} />
              );
            })}
          </Tabs>
        ) : (
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <Skeleton
              variant="rectangular"
              width={100}
              height={20}
              sx={{ margin: "0 5px" }}
            />
            <Skeleton
              variant="rectangular"
              width={100}
              height={20}
              sx={{ margin: "0 5px" }}
            />
            <Skeleton
              variant="rectangular"
              width={100}
              height={20}
              sx={{ margin: "0 5px" }}
            />
          </Box>
        )}
      </div>
      <div className="header-profile">
        {!props.currentUser ? (
          <Skeleton variant="rectangular" width={100} height={20} />
        ) : (
          <>
            <img src={Avatar} alt="avatar" />
            <Button
              endIcon={<ArrowDropDownIcon />}
              sx={{
                fontSize: "14px",
                textTransform: "none",
              }}
              color="secondary"
              aria-describedby={id}
              onClick={handleClick}
            >
              {props?.currentUser?.firstName} {props?.currentUser?.lastName}
            </Button>
            <Popover
              id={id}
              open={open}
              anchorEl={anchorEl}
              onClose={handleClose}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "center",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "center",
              }}
            >
              <Box
                sx={{
                  padding: "5px",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <Button
                  color="secondary"
                  sx={{
                    textTransform: "none",
                  }}
                  startIcon={<LogoutIcon />}
                  onClick={() => {
                    const usersRef = ref(database, "active");
                    fetchNodeIDbyUserId(
                      props.currentUser?.["uid"],
                      usersRef
                    ).then((nodeId) => {
                      const userRef = ref(database, `active/${nodeId}`);
                      remove(userRef);
                    });
                    sessionStorage.removeItem("user");
                    navigate("../../auth/login");
                  }}
                >
                  Logout
                </Button>
                <Button
                  color="secondary"
                  sx={{
                    textTransform: "none",
                  }}
                  startIcon={<SettingsIcon />}
                >
                  Settings
                </Button>
              </Box>
            </Popover>
          </>
        )}
      </div>
    </header>
  );
}
