import React, { useEffect, useState } from "react";
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { Button, Card, CardContent, CardMedia, Container, Stack } from "@mui/material";
import { useNavigate } from "react-router-dom";
import CountDown from "../../components/Item/CountDown";
import Rating from "../../components/review/Rating";
import '../../css/itemList.css'; 
import { selectUserData } from '../../api/firebase';
import { onAuthStateChanged, getAuth } from 'firebase/auth';
import { fetchWishList } from "../../api/wishApi ";
import ImageDownload from "../../components/AI/ImageDownload";

export default function WishItemList() {
  const [list, setList] = useState([]);
  const navigate = useNavigate();
  const [currentUserEmail, setCurrentUserEmail] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [image, setImage] = useState('');
  const auth = getAuth();
  const isNewItem = new Date(list.regDate) > new Date(new Date().setDate(new Date().getDate() - 14));

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
        } catch (error) {
          console.log('사용자 정보를 불러오는 중 에러:', error);
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

      } catch (error) {
        console.log('Error fetching product list:', error);

      }
    }
    fetchData();
  }, [userInfo]);

  const handleAiImg = (img) => {
    setImage(img)
    resetImageAfterDelay()
  };

  const resetImageAfterDelay = () => {
    setTimeout(() => {
      setImage(null);
    }, 3000); 
  };

  return (
    <Container>
      <Grid container spacing={2} className="itemList" marginTop={5}>
        <Grid item xs={12} sm={12} md={5} lg={5} sx={{ position:'fixed',  right:{ md: '4%', lg:'2%',} , top:{md:'145px', lg:'145px', xs: '100px', sm:'100px', }, height:{ md: '55%', lg: '59%', xs:'40%', sm:'40%',}, width:'auto', marginBottom: 3, zIndex: 999 }}>
          <Card sx={{ padding: 3, backgroundColor: 'rgb(240, 240, 240)',  }}>
            <Typography variant="h5">
              AI 이미지 생성
            </Typography>
            <Typography variant="body2">
              검정색 상품은 제대로 작동되지 않습니다... 죄송합니다
            </Typography>
            <Grid sx={{width:{ xs: 300, sm:300, md: '100%', lg:'100%',}}}>
              <ImageDownload img={image} />
            </Grid>
          </Card>
        </Grid>
        <Grid item xs={12} sm={12} md={7} lg={7}>
          <Grid container spacing={2} className="itemList">
            {list.map((item, index) => (
              <Grid item xs={6} sm={6} md={6} lg={6} key={index} marginBottom={2}>
                <Paper className="paper-item" onClick={() => { navigate(`/item/detail/${item.iid}`) }} sx={{ maxWidth: 300, paddingBottom: 0, height:340 }}>
                  <div style={{ position: 'relative' }}>
                    <CardMedia
                      component="img"
                      height="220"
                      image={item.img1}
                      alt={item.name}
                    />
                    <Typography
                      sx={{
                        position: 'absolute',
                        top: '3px',
                        left: '3px',
                        borderRadius: '5px',
                        zIndex: 1,
                        textAlign: 'center',
                        fontSize: '0.8rem',
                      }}
                    >
                    {isNewItem && (
                      <span 
                        style={{ 
                          cursor: 'pointer',
                          display: "inline-block",
                          borderRadius: "999px",
                          padding: "2px 8px",
                          marginRight: "5px",
                          fontSize: "0.7rem",
                          fontWeight: "bold",
                          color: "white",
                          backgroundColor: 'rgb(22, 106, 220)', 
                        }}>
                        new
                      </span>
                      )}
                      {new Date(item.saleDate) > new Date() && (
                        <span 
                          style={{ 
                            cursor: 'pointer',
                            display: "inline-block",
                            borderRadius: "999px",
                            padding: "2px 8px",
                            marginRight: "5px",
                            fontSize: "0.7rem",
                            fontWeight: "bold",
                            color: "white",
                            backgroundColor: 'rgb(220, 22, 26)', 
                          }}>
                        sale
                        </span>
                      )}
                    </Typography>
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
                          <Typography variant="body2" style={{ backgroundColor: 'rgba(220, 22, 26, 0.8)', color:'white', padding: '3px 7px', fontWeight: "bold", borderRadius: '5px',}}>{((item.price - item.salePrice) / item.price * 100).toFixed(0)}%</Typography>
                          <Typography variant="body2" style={{ textDecoration: 'line-through', fontSize: '0.9rem', marginTop: '0.4px' }}>{item.price.toLocaleString()}원</Typography>
                          <Typography variant="body2" className="price">{item.salePrice.toLocaleString()}원</Typography>
                        </>
                      ) : (
                        <Typography variant="body2" className="price">{item.price.toLocaleString()}원</Typography>
                      )}
                    </Stack>
                  </CardContent>
                </Paper>
                <Button style={{backgroundColor:'gray', color: 'white'}} onClick={() => { handleAiImg(item.img1) }}>ai 생성 이미지</Button>
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>
    </Container>
  )
}
