import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Button, Container, Grid, Typography, Table, TableBody, TableCell, TableHead, TableRow,
  Input, CardMedia, useMediaQuery, useTheme,
} from '@mui/material';
import '../../css/cartPage.css';
import useCart from './useCart';

const CartPage = () => {
  const {
    cartItems,
    totalCount,
    currentUserEmail,
    userInfo,
    handleDeleteItem,
    handleQuantityChange,
  } = useCart();

  const navigate = useNavigate();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'));

  const renderCartItemRows = () => {
    if (cartItems.length === 0) {
      return (
        <TableRow>
          <TableCell colSpan={8} align="center">
            장바구니가 비어 있습니다.
          </TableCell>
        </TableRow>
      );
    }

    const handleClick = (item) => {
      navigate(`/item/detail/${item.iid}`);
    };

    return cartItems.map((item) => (
      <TableRow key={`${item.iid}-${item.option}`}>
        <TableCell>
          <CardMedia
            component="img"
            image={item.img1}
            alt={item.img1}
            style={{ height: 200, cursor: 'pointer' }}
            onClick={() => handleClick(item)}
          />
        </TableCell>
        <TableCell>{item.name}</TableCell>
        {!isSmallScreen && <TableCell>{item.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}원</TableCell>}
        {!isSmallScreen && <TableCell>{item.option}</TableCell>}
        <TableCell>
          <Input
            type="number"
            value={item.count}
            onChange={(e) => handleQuantityChange(item.cid, item.iid, item.ioid, e.target.value)}
            inputProps={{ min: 1, max: item.stockCount }}
          />
        </TableCell>
        <TableCell>{item.totalPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}원</TableCell>
        <TableCell>
          <Button onClick={() => handleDeleteItem(item.cid)} variant="contained" color="error">
            X
          </Button>
        </TableCell>
      </TableRow>
    ));
  };

  const handleOrder = () => {
    if (!userInfo || !userInfo.email) {
      window.location.href = '/signIn';
      return;
    }

    const orderItems = cartItems.map((item) => ({
      iid: item.iid,
      img: item.img1,
      name: item.name,
      ioid: item.ioid,
      option: item.option,
      count: item.count,
      price: item.salePrice && new Date(item.saleDate) > new Date() ? item.salePrice : item.price,
      totalPrice: item.totalPrice,
    }));

    localStorage.setItem('orderItems', JSON.stringify(orderItems));
    navigate("/order", { state: { orderItems } });
  };

  // =================== order 관련 끝======================

  return (
    <Container
      maxWidth="lg"
      sx={{ mt: 5 }}
    >
      <Grid container spacing={2}>
        <Grid item xs={12} md={15}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>이미지</TableCell>
                <TableCell>상품명</TableCell>
                {!isSmallScreen && <TableCell>가격</TableCell>}
                {!isSmallScreen && <TableCell>옵션</TableCell>}
                <TableCell>수량</TableCell>
                <TableCell>합계</TableCell>
                <TableCell>삭제</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>{renderCartItemRows()}</TableBody>
          </Table>
          <Box className="boxContainer">
            <Typography
              variant="subtitle1"
              sx={{ mt: 1, whiteSpace: 'nowrap' }}
            >
              총 상품 가격: {totalCount.toFixed(0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}원
            </Typography>
          </Box>
          <Box
            xs={12}
            sx={{
              justifyContent: 'center'
            }}
          >
            <Button
              variant="contained"
              onClick={handleOrder}
              sx={{ marginTop: 2, }}
            >
              주문하기
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

export default CartPage;
