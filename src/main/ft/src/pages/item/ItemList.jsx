import React from "react";
import { QueryClient, QueryClientProvider, useQuery } from "react-query";
import { useNavigate } from "react-router-dom";
import { NewItems } from "../../components/Item/Items";
import '../../css/itemList.css'; 
import LoadingIndicator from "../../components/publics/LoadingIndicator";
import ItemGrid from "../../components/Item/ItemGrid";

const queryClient = new QueryClient();

export default function ItemList() {
  return (
    <QueryClientProvider client={queryClient}>
      <ItemListContent />
    </QueryClientProvider>
  );
}

function ItemListContent() {
  const navigate = useNavigate();
  const { isLoading, data: list } = useQuery('items', NewItems, {
    refetchInterval: false,
  });  

  return (
    <>
      {isLoading ? <LoadingIndicator /> : <ItemGrid items={list} navigate={navigate} />}
    </>
  );
}
