import React, { useEffect } from "react";
import { useQuery, QueryClientProvider, QueryClient } from "react-query"; // 추가
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { CardMedia, CardContent, Stack, Box } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import CountDown from "../components/CountDown";
import Rating from "../components/Rating";
import { fetchSearchItems } from "../components/Item/Items";
import MainCategoryBox from "../components/main/MainCategoryBox";

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

  // QueryClient 생성
  const queryClient = new QueryClient();

  const { isLoading, data: list } = useQuery(['search', searchQuery], () => fetchSearchItems(searchQuery), {
    refetchInterval: 5000,
  });

  useEffect(() => {
    window.scrollTo(0, 0); 
  }, []); 

  return (
      <>
        <Box width="70%" margin="auto" mt={5} mb={5}>
          <MainCategoryBox />
        </Box>
        <Grid container spacing={2} className="itemList">
          {isLoading ? (
            <div style={{ position: 'relative', height: '100vh' }}>
              <img src="img/loading.gif" alt="loading" style={{ width: '200px', height: '200px', position: 'absolute', top: '30%', left: '200%', transform: 'translate(170%, 10%) translateX(100%)' }} />
            </div>
          ) : (
            list.map((item) => (
              <Grid item xs={6} sm={6} md={4} lg={3} key={item.iid} marginBottom={5}>
                <div className="paper-item" onClick={() => { navigate(`/item/detail/${item.iid}`) }} sx={{ maxWidth: 300, paddingBottom: 0 }}>
                  <div style={{ position: 'relative' }}>
                    <CardMedia
                      component="img"
                      height="220"
                      image={item.img1}
                      alt={item.name}
                    />
                    {new Date(item.saleDate) > new Date() && (
                      <Typography
                        sx={{
                          position: 'absolute',
                          top: '2px', 
                          right: '2px', 
                          backgroundColor: 'rgba(0, 0, 0, 0.8)', 
                          color: 'white',
                          padding: '3px 7px', 
                          width: '28px',
                          height: '28px',
                          borderRadius: '5px',
                          zIndex: 1, 
                          textAlign: 'center',
                          fontSize: '0.8rem', 
                          lineHeight: '28px',
                        }}
                      >
                        {((item.price - item.salePrice) / item.price * 100).toFixed(0)}%
                      </Typography>
                    )}
                  </div>
                  <CardContent sx={{ flexGrow: 0.7 }}>
                    <Typography variant="body2" className="item-name" noWrap style={{ height: '1.8em' }}>
                      {item.name}
                    </Typography>
                    <Rating key={item.iid} item={item} strSize={16} className="item-rating" />
                    {new Date(item.saleDate) > new Date() && (
                      <CountDown saleDate={item.saleDate} />
                    )}
                    <Stack direction={'row'} justifyContent="space-between">
                      {item.salePrice !== 0 && item.salePrice && new Date(item.saleDate) > new Date() ? (
                        <>
                          <Typography variant="body2">{((item.price - item.salePrice) / item.price * 100).toFixed(0)}%</Typography>
                          <Typography variant="body2"  style={{ textDecoration: 'line-through', fontSize: '0.9rem', marginTop: '0.4px' }}>{item.price.toLocaleString()}원</Typography>
                          <Typography variant="body2" className="price">{item.salePrice.toLocaleString()}원</Typography>
                        </>
                      ) : (
                        <Typography variant="body2" className="price">{item.price.toLocaleString()}원</Typography>
                      )}
                    </Stack>
                  </CardContent>
                </div>
              </Grid>
            ))
          )}
        </Grid>
      </>
  );
}
