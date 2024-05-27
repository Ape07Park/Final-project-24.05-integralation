import React from "react";
import { Button } from "@mui/material";
import { styled } from "@mui/system";

const CustomButton = styled(Button)({
  backgroundColor: "white",
  color: "black",
  boxShadow: "none",
  transition: "background-color 0.3s, box-shadow 0.3s",
  "&:hover": {
    backgroundColor: "lightblue",
    boxShadow: "none",
  },
});

export default CustomButton;
