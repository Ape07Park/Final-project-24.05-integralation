import React, { useEffect } from "react";
import { useQuery, QueryClientProvider, QueryClient } from "react-query"; // 추가
import { useNavigate, useParams } from "react-router-dom";
import { fetchSearchItems } from "../../components/Item/Items";
import MainCategoryBox from "../../components/main/MainCategoryBox";
import LoadingIndicator from "../../components/publics/LoadingIndicator";
import ItemGrid from "../../components/Item/ItemGrid";
import { Box } from "@mui/material";

const queryClient = new QueryClient();

export default function ItemListSearch() {
  return (
    <QueryClientProvider client={queryClient}>
      <ItemListSearchContent />
    </QueryClientProvider>
  );
}

function ItemListSearchContent() {
  const navigate = useNavigate();
  const { searchQuery } = useParams();
  const { isLoading, data: list } = useQuery(['search', searchQuery], () => fetchSearchItems(searchQuery), {
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
