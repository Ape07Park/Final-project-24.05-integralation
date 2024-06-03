import React, { useEffect } from "react";
import { useQuery, QueryClientProvider, QueryClient } from "react-query"; // 추가
import { useNavigate, useParams } from "react-router-dom";
import { menuItems } from "../../components/Item/Items";
import MainCategoryBox from "../../components/main/MainCategoryBox";
import LoadingIndicator from "../../components/publics/LoadingIndicator";
import ItemGrid from "../../components/Item/ItemGrid";
import { Box, Container } from "@mui/material";

const queryClient = new QueryClient();

export default function ItemMenuList() {
  return (
    <QueryClientProvider client={queryClient}>
      <ItemMenuListContent />
    </QueryClientProvider>
  );
}

function ItemMenuListContent() {
  const navigate = useNavigate();
  const { menu } = useParams();
  const { isLoading, data: list } = useQuery(['menu', menu], () => menuItems(menu), {
    refetchInterval: 5000,
  });

  useEffect(() => {
    window.scrollTo(0, 0); 
  }, []); 

  return (
    <>
      <Box width="85%" margin="auto" mt={5} mb={5}>
        <MainCategoryBox />
      </Box>
      {isLoading ? <LoadingIndicator /> : <ItemGrid items={list} navigate={navigate} />}
    </>
  );
}
