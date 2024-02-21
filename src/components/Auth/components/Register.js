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
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";
import { useNavigate } from "react-router";
import { codeToTitle } from "../../../utilities/utility";
import { toast } from "react-toastify";

// FIREBASE IMPORTS
import { auth, database } from "../../../utilities/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { ref, push } from "firebase/database";

export default function Register() {
  const navigate = useNavigate();
  const [load, setLoad] = useState(false);
  const registerSchema = yup.object().shape({
    firstName: yup.string().required("Please enter your email address"),
    lastName: yup.string(),
    mobile: yup
      .string()
      .matches(/^[6-9]\d{9}$/, "*Please enter a valid mobile number")
      .min(10, "*Mobile number must be at least 10 digits")
      .max(10, "*Mobile number must not exceed 10 digits"),
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
    resolver: yupResolver(registerSchema),
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

  const onSubmit = (e) => {
    const { firstName, lastName, mobile, email, password } = e;
    setLoad(true);
    // console.log('ref', ref('users'));
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // const user = userCredential.user;
        // const userRef = ref(database, `users/${user.uid}`);
        // set(userRef, {
        //   displayName: firstName + " " + lastName,
        //   phoneNumber: mobile,
        // });
        console.log("registered", userCredential);
        const userRef = ref(database, "users");
        const newUser = {
          firstName,
          lastName,
          mobile,
          email,
          friends: [],
          uid: userCredential?.user?.uid,
        };
        console.log("newUser", newUser);
        push(userRef, newUser);
        showToast("Registration successful", "success");
        navigate("../login");
      })
      .catch((error) => {
        showToast("Registration unsuccessful", "error");
        console.error("Error signing up:", error.message);
      })
      .finally(() => {
        setLoad(false);
      });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {Object.keys(registerSchema.fields).map((fieldName) => {
        const fieldData = registerSchema.fields[fieldName];
        return (
          <div key={fieldName}>
            <Controller
              name={fieldName}
              control={control}
              render={({ field }) => (
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
                    label={"Enter " + codeToTitle(fieldName)}
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
            "Register"
          )}
        </Button>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            padding: "5px 0",
          }}
        >
          <Typography fontSize={14}>Already a member?</Typography>
          <Button
            variant="text"
            color="info"
            sx={{
              textTransform: "none",
            }}
            onClick={() => navigate("../login")}
          >
            Sign In
          </Button>
        </Box>
      </Box>
    </form>
  );
}
