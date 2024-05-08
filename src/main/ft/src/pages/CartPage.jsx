import React, { useState, useEffect } from 'react';
import { selectUserData } from '../api/firebase';
import axios from 'axios';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  Container,
  Grid,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Checkbox,
  Input,
} from '@mui/material';

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [currentUserEmail, setCurrentUserEmail] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  // const [stockCount, setStockCount] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const auth = getAuth();
  const navigate = useNavigate();

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
            setIsAdmin(info && info.isAdmin === 1);
          } catch (error) {
            console.error('사용자 정보를 불러오는 중 에러:', error);
          }
        };
        fetchUserInfo();
        fetchCartItems();
      }
    }, [currentUserEmail]);
  
  const fetchCartItems = async () => {
    try {
      const response = await axios.get(`/ft/api/v2/carts/list/${currentUserEmail}`);
      setCartItems(response.data);
      console.log(response.data);
    } catch (error) {
      console.error('장바구니 목록을 불러오는데 실패했습니다:', error);
    }
  };

  useEffect(() => {
    const calculateTotalPrice = () => {
      const totalPrice = cartItems.reduce((acc, item) => acc + item.totalPrice, 0);
      setTotalCount(totalPrice);
    };

    calculateTotalPrice();
  }, [cartItems]);

  const handleToggleItem = (itemId, itemOption) => {
    const selectedItem = cartItems.find((item) => item.iid === itemId && item.option === itemOption);
    const isSelected = selectedItems.some((item) => item.cid === selectedItem.cid);

    if (isSelected) {
      setSelectedItems((prevItems) => prevItems.filter((item) => item.cid !== selectedItem.cid));
    } else {
      setSelectedItems((prevItems) => [...prevItems, selectedItem]);
    }
  };

  // 카트 아이템 삭제
  const handleDeleteItem = (cid) => {
    axios
      .delete(`/ft/api/v2/carts/delete/${currentUserEmail}`, {
        data: [cid] // 삭제할 아이템의 ID를 배열로 전달
      })
      .then((response) => {
        if (response.data === true) {
          // 성공적으로 삭제된 경우
          const updatedItems = cartItems.filter((item) => item.cid !== cid);
          setCartItems(updatedItems);
          console.log('상품이 성공적으로 삭제되었습니다.');
        } else {
          console.error('상품 삭제 실패: 서버 응답 오류');
        }
      })
      .catch((error) => {
        console.error('상품 삭제 실패:', error);
      });
  };
  // 전체 아이템 삭제 요청
  const handleDeleteAllItems = () => {
    axios
      .post(`/ft/api/v2/carts/delete/${currentUserEmail}`)
      .then((response) => {
        if (response.data === true) {
          // 성공적으로 삭제된 경우
          setCartItems([]); // 장바구니를 비웁니다.
          console.log('모든 상품이 성공적으로 삭제되었습니다.');
        } else {
          console.error('상품 삭제 실패: 서버 응답 오류');
        }
      })
      .catch((error) => {
        console.error('상품 삭제 실패:', error);
      });
  };

  // 카트 아이템 수량 변경
  const handleQuantityChange = async (cartId, itemId, itemOption, newQuantity) => {
    try {
      const count = parseInt(newQuantity, 10);
      
      await axios.post('/ft/api/v2/carts/update', {
        cid: cartId,
        email: currentUserEmail,
        iid: itemId,
        ioid: itemOption,
        count: count,
        // opcount: stockCount
      }).then(response => {
        // setStockCount(response.data)
        console.log(response);
        if(response.data) {
          console.log('변경되었습니다.');
        } else {
          console.log('재고가 부족합니다.');
        }  
      })
      .catch(error => {
        console.error('장바구니 추가 실패:', error);
      });

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
      console.error('상품 수량 업데이트 실패:', error);
    }
  };
  
  // 카트 아이템 렌더링
  const renderCartItemRows = () => {
    return cartItems.map((item) => (
      <TableRow key={`${item.iid}-${item.option}`}>
        <TableCell>
          <Checkbox
            checked={selectedItems.some((selectedItem) => selectedItem.cid === item.cid)}
            onChange={() => handleToggleItem(item.iid, item.option)}
          />
        </TableCell>
        <TableCell>{item.img1}</TableCell>
        <TableCell>{item.name}</TableCell>
        <TableCell>{item.price}원</TableCell>
        <TableCell>{item.option}</TableCell>
        <TableCell>
          <Input
            type="number"
            value={item.count}
            onChange={(e) => handleQuantityChange(item.cid, item.iid, item.ioid, e.target.value)}
            inputProps={{ min: 1, max: item.stockCount }}
          />
        </TableCell>
        <TableCell>{item.totalPrice}원</TableCell>
        <TableCell>
          <Button onClick={() => handleDeleteItem(item.cid)} variant="contained" color="error">
            삭제
          </Button>
        </TableCell>
      </TableRow>
    ));
  };

  return (
    <Container fixed>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={8}>
          <Typography variant="h4" sx={{ marginBottom: 2 }}>
            장바구니
          </Typography>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell></TableCell>
                <TableCell>이미지</TableCell>
                <TableCell>상품명</TableCell>
                <TableCell>가격</TableCell>
                <TableCell>옵션</TableCell>
                <TableCell>수량</TableCell>
                <TableCell>합계</TableCell>
                <TableCell>삭제</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>{renderCartItemRows()}</TableBody>
          </Table>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Typography variant="h4" sx={{ marginBottom: 2 }}>
            결제 정보
          </Typography>
          <Box sx={{ position: 'sticky', top: 20 }}>
            <Card sx={{ padding: 2 }}>
              <Typography variant="subtitle1" sx={{ marginBottom: 1 }}>
                총 상품 가격: {totalCount.toFixed(0)}원
              </Typography>
              <Typography variant="subtitle1" sx={{ marginBottom: 1 }}>
                배송비: 500,550원
              </Typography>
              <Typography variant="h6" sx={{ marginBottom: 2 }}>
                총 결제 금액: {totalCount.toFixed(0)}원
              </Typography>
              <Button variant="contained" fullWidth>
                결제하기
              </Button>
              <Button variant="contained" fullWidth onClick={() => navigate('/item')}>
                쇼핑 계속하기
              </Button>
            </Card>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

export default CartPage;