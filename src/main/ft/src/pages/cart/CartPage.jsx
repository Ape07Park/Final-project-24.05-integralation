import React, { useState, useEffect } from 'react';
import { selectUserData } from '../../api/firebase';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import {
  Box, Button, Container, Grid, Typography, Table, TableBody, TableCell, TableHead, TableRow,
  Input, CardMedia, useMediaQuery, useTheme,
} from '@mui/material';
import '../../css/cartPage.css';
import {  deleteCartItem, fetchCartItem, updateCartItemQuantity } from '../../api/cartApi';

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [currentUserEmail, setCurrentUserEmail] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const auth = getAuth();
  const navigate = useNavigate();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'));


  // 유저정보
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
      fetchCartItems();
    }
  }, [currentUserEmail]);

  const fetchCartItems = async () => {
    try {
      const response = await fetchCartItem(currentUserEmail);
      setCartItems(response);
    } catch (error) {
      console.log('장바구니 목록을 불러오는데 실패했습니다:', error);
    }
  };

  useEffect(() => {
    const calculateTotalPrice = () => {
      const totalPrice = cartItems.reduce((acc, item) => acc + item.totalPrice, 0);
      setTotalCount(totalPrice);
    };

    calculateTotalPrice();
  }, [cartItems]);

  // 카트 아이템 삭제
  const handleDeleteItem = (cid) => {
    const isConfirmed = window.confirm('정말 삭제하시겠습니까?');
  
    // 사용자가 확인을 눌렀을 때만 삭제를 진행합니다.
    if (isConfirmed) {
      deleteCartItem(currentUserEmail, cid)
        .then((response) => {
          // HTTP 응답의 상태 코드를 확인하여 성공 여부를 판단합니다.
          if (response.status === 200) {
            // 성공적으로 삭제된 경우
            const updatedItems = cartItems.filter((item) => item.cid !== cid);
            setCartItems(updatedItems);
          }
        })
        .catch((error) => {
          console.log('상품 삭제 실패:', error);
        });
    }
  };

  // 카트 아이템 수량 변경
  const handleQuantityChange = async (cartId, itemId, itemOption, newQuantity) => {
    try {
      const count = parseInt(newQuantity, 10);

      await updateCartItemQuantity(cartId, currentUserEmail, itemId, itemOption, count);

      const updatedItems = cartItems.map((item) => {
        if (item.cid === cartId) {
          const newTotalPrice = count * item.price;
          return { ...item, count: count, totalPrice: newTotalPrice };
        } else {
          return item;
        }
      });

      setCartItems(updatedItems);
    } catch (error) {
      console.log('상품 수량 업데이트 실패:', error);
    }
  };

  // 카트 아이템 렌더링
  const renderCartItemRows = () => {
    if (cartItems.length === 0) {
      return (
        <TableRow>
          <TableCell colSpan={8} align="center" sx={{height: 350}}>
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
            item={item}
          />
        </TableCell>
        <TableCell>{item.name}</TableCell>
        {!isSmallScreen &&
          <TableCell>{item.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}원</TableCell>
        }
        {!isSmallScreen &&
          <TableCell>{item.option}</TableCell>
        }
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

  // =================== order 관련 ======================
  // orderpage로 보내주는 역할
  const handleOrder = async () => {
    if (!userInfo || !userInfo.email) {
      // 사용자가 로그인되어 있지 않은 경우, 로그인 페이지로 리다이렉트
      window.location.href = '/signIn'; // 로그인 페이지 URL을 실제로 사용하는 주소로 변경해주세요
      return;
    }

    // 넘어갈 데이터들
    const orderItems = cartItems.map((item) => ({
      iid: item.iid, // orderItem
      img: item.img1, // 띄우기
      name: item.name, // order
      ioid: item.ioid,
      option: item.option, // 띄우기
      count: item.count, // orderItem
      price: item.salePrice && new Date(item.saleDate) > new Date() ? item.salePrice : item.price, // orderItem
      totalPrice: item.totalPrice, // order
    }));

    // orderItems를 로컬 스토리지에 저장
    localStorage.setItem('orderItems', JSON.stringify(orderItems)); //  객체나 배열을 JSON 문자열로 변환
    // Order 페이지로 이동할 때 orderItems 상태를 함께 전달
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
