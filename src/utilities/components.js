import { Box, CircularProgress, Typography } from "@mui/material";

export const CircleLoader = (
  <Box
    sx={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      width: "100%",
      height: "100vh",
    }}
  >
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: 'center'
      }}
    >
      <CircularProgress />
      <Typography margin='10px 0' color="GrayText">Please wait</Typography>
    </Box>
    
  </Box>
);
