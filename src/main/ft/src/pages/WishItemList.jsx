import React, { useEffect, useState } from "react";
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { CardContent, CardMedia, Stack } from "@mui/material";
import { useNavigate } from "react-router-dom";
import CountDown from "../components/CountDown";
import Rating from "../components/Rating";
import '../css/itemList.css'; // 분리된 CSS 파일 import
import { selectUserData } from '../api/firebase';
import { onAuthStateChanged, getAuth } from 'firebase/auth';
import { fetchWishList } from "../api/wishApi ";


export default function ItemList() {
  const [isLoading, setIsLoading] = useState(true);
  const [list, setList] = useState([]);
  const navigate = useNavigate();
  const [currentUserEmail, setCurrentUserEmail] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const auth = getAuth();

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUserEmail(user.email);
      } else {
        setCurrentUserEmail(null);
      }
    });
  }, [auth]);
  
  useEffect(() => {
    if (currentUserEmail) {
      const fetchUserInfo = async () => {
        try {
          const info = await selectUserData(currentUserEmail);
          setUserInfo(info);
          setIsAdmin(info && info.isAdmin === 1);
        } catch (error) {
          console.error('사용자 정보를 불러오는 중 에러:', error);
        }
      };
      fetchUserInfo();
    }
  }, [currentUserEmail]);

  useEffect(() => {
    async function fetchData() {
      try {
        if (userInfo) {
          const wishList = await fetchWishList(userInfo);
          setList(wishList);
        }
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching product list:', error);
        setIsLoading(false);
      }
    }
    fetchData();
  }, [userInfo]);

  return (
    <>
      <Grid container spacing={2} className="itemList">
        {list.map((item, index) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={index} marginBottom={10}>
            <Paper className="paper-item" onClick={() => { navigate(`/item/detail/${item.iid}`) }} sx={{ maxWidth: 300, paddingBottom: 0 }}>
              <CardMedia
                component="img"
                height="200"
                image={item.img1}
                alt={item.name}
                sx={{ mb: 1 }} // 이미지 아래 여백 추가
              />
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="body2" className="item-name" noWrap style={{ height: '2em' }}>
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
                      <Typography variant="body2" className="strike-through">{item.price.toLocaleString()}원</Typography>
                      <Typography variant="body2" className="price">{item.salePrice.toLocaleString()}원</Typography>
                    </>
                  ) : (
                    <Typography variant="body2" className="price">{item.price.toLocaleString()}원</Typography>
                  )}
                </Stack>
              </CardContent>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </>
  )
}
