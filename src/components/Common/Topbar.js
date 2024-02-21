import React from "react";
import "./index.css";
import { Box, Button, Skeleton, Tab, Tabs } from "@mui/material";
import Logo from "../../assets/images/logoTwo.jpg";
import Avatar from "../../assets/images/userOne.jpg";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { codeToTitle } from "../../utilities/utility";

export default function Topbar(props) {
  const tabOptions = ["messages", "discover", "settings"];
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
            <Skeleton variant="rectangular" width={100} height={20} sx={{ margin: '0 5px' }} />
            <Skeleton variant="rectangular" width={100} height={20} sx={{ margin: '0 5px' }} />
            <Skeleton variant="rectangular" width={100} height={20} sx={{ margin: '0 5px' }} />
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
            >
              {props?.currentUser?.firstName} {props?.currentUser?.lastName}
            </Button>
          </>
        )}
      </div>
    </header>
  );
}
