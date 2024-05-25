import React, { useEffect, useRef, useState } from "react";
import { Box, Button, Stack } from "@mui/material";
import MainCarousel from '../components/main/MainCarousel';
import MainCategoryBox from "../components/main/MainCategoryBox";
import ItemList from "./ItemList";

export default function MainPage() {
  const carouselRef = useRef(null); // MainCarousel 컴포넌트에 대한 ref 생성
  
  useEffect(() => {
    window.scrollTo(0, 0); 
  }, []); 

  return (
    <>
      <Box width="85%" margin="auto" mt={5} mb={5}>
        <MainCategoryBox />
      </Box>
      <Box width="60%" margin="auto" mt={5} mb={5}>
        <MainCarousel ref={carouselRef} /> {/* MainCarousel 컴포넌트에 ref 전달 */}
      </Box>
      <ItemList />
    </>
  )
}
