import { Box, Typography } from "@mui/material";
import React, { Suspense, lazy } from "react";
import { Navigate, Route, Routes } from "react-router";
import cover from "../../assets/images/authCover.jpg";
import "./index.css";
import { circleLoader } from "../../utilities/components";

export default function Auth() {
  const Login = lazy(() => import("./components/Login"));
  const Register = lazy(() => import("./components/Register"));
  return (
    <>
      <Typography fontSize={22} margin={"20px auto"} fontWeight={"bold"}>
        Tawk Authentication
      </Typography>
      <Box
        sx={{
          display: {
            xs: "block",
            sm: "flex",
          },
          width: "90%",
          margin: "auto",
        }}
      >
        <Box
          sx={{
            width: {
              xs: "100%",
              sm: "50%",
            },
          }}
        >
          <img src={cover} className="auth-cover" alt="tawk-cover" />
        </Box>
        <Box
          sx={{
            width: {
              xs: "100%",
              sm: "50%",
            },
            margin: "auto",
          }}
        >
          <Routes>
            <Route
              path="login"
              element={
                <Suspense fallback={circleLoader}>
                  <Login />
                </Suspense>
              }
            />
            <Route
              path="register"
              element={
                <Suspense fallback={circleLoader}>
                  <Register />
                </Suspense>
              }
            />
            <Route path="*" element={<Navigate to={"login"} />} />
          </Routes>
        </Box>
      </Box>
    </>
  );
}
