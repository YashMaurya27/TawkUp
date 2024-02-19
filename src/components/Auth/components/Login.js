import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  Box,
  Button,
  CircularProgress,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import { toast } from "react-toastify";
import { useNavigate } from "react-router";
import { convertToJWT } from "../../../utilities/utility";

// FIREBASE IMPORTS
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../../utilities/firebase";

export default function Login() {
  const navigate = useNavigate();
  const [load, setLoad] = useState(false);
  const loginSchema = yup.object().shape({
    email: yup
      .string()
      .email("Please enter a valid email address")
      .required("Please enter your email address"),
    password: yup
      .string()
      .min(8, "Password must be at least 8 characters long")
      .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
      .matches(/\d/, "Password must contain at least one digit")
      .matches(
        /[!@_,&-]/,
        "Password must contain at least one special character (@, _, -, or &)"
      )
      .matches(/^\S*$/, "Password must not contain any spaces")
      .required("Password is required"),
  });

  const { control, handleSubmit, formState, setValue } = useForm({
    resolver: yupResolver(loginSchema),
  });
  const { errors } = formState;
  const showToast = (message, type) => {
    toast[type](message, {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  };

  const onSubmit = async (e) => {
    setLoad(true);
    const { email, password } = e;
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        sessionStorage.setItem("user", convertToJWT(user));
        navigate("../../home");
      })
      .catch((error) => {
        showToast("Invalid Credentials", "error");
        console.error("Authentication error:", error.message);
      })
      .finally(() => {
        setLoad(false);
      });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {Object.keys(loginSchema.fields).map((fieldName) => {
        const fieldData = loginSchema.fields[fieldName];
        return (
          <div key={fieldName}>
            <Controller
              name={fieldName}
              control={control}
              render={({ field }) => (
                <>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      width: "100%",
                      margin: "20px auto",
                    }}
                  >
                    <TextField
                      id={fieldName}
                      label={"Enter " + fieldName}
                      variant="standard"
                      sx={{
                        width: "100%",
                      }}
                      type={
                        fieldData?.["type"] === "number"
                          ? "number"
                          : fieldName === "password"
                          ? "password"
                          : "text"
                      }
                      InputProps={{
                        endAdornment: (
                          <InputAdornment
                            position="end"
                            sx={{
                              margin: "20px 0",
                            }}
                          >
                            {field["value"] && field["value"] !== "" && (
                              <IconButton
                                onClick={() => setValue(fieldName, "")}
                                edge="end"
                              >
                                <HighlightOffIcon />
                              </IconButton>
                            )}
                          </InputAdornment>
                        ),
                      }}
                      {...field}
                      error={errors?.[fieldName] !== undefined}
                      helperText={
                        errors?.[fieldName]?.message &&
                        `${errors?.[fieldName]?.message}`
                      }
                    />
                  </Box>
                </>
              )}
            />
          </div>
        );
      })}
      <Box
        sx={{
          margin: "auto",
          padding: "10px 0",
          textAlign: "start",
        }}
      >
        <Button
          type="submit"
          color="secondary"
          variant="contained"
          endIcon={<KeyboardDoubleArrowRightIcon />}
          disabled={load === true}
          sx={{
            width: "100%",
          }}
        >
          {load === true ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            "Login"
          )}
        </Button>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            padding: "5px 0",
          }}
        >
          <Typography fontSize={14}>New Here?</Typography>
          <Button
            variant="text"
            color="info"
            sx={{
              textTransform: "none",
            }}
            onClick={() => navigate("../register")}
          >
            Sign Up
          </Button>
        </Box>
      </Box>
    </form>
  );
}
