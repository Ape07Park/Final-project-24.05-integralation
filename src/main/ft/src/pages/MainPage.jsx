import React, { useEffect, useState } from "react";
import { Box, Button, Stack } from "@mui/material";
import MainCarousel from '../components/main/MainCarousel';
import MainCategoryBox from "../components/main/MainCategoryBox";
import ItemList from "./ItemList";

export default function MainPage() {
  
  return (
    <>
      <Box width="50%" margin="auto" mt={5} mb={5}>
        <MainCategoryBox />
      </Box>
      <Box width="60%" margin="auto" mt={5} mb={5}>
        <MainCarousel />
      </Box>
      <ItemList />
    </>
  )
}
