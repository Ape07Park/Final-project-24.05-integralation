import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box,
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Divider,
  TableContainer,
} from "@mui/material";

import { onAuthStateChanged, getAuth } from 'firebase/auth';
import { selectUserData } from '../api/firebase';
import { useNavigate } from 'react-router-dom';

const OrderHistoryList = () => {

  // user
  const [currentUserEmail, setCurrentUserEmail] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const navigate = useNavigate();

  const auth = getAuth();
  const [orders, setOrders] = useState([]);

  // ======== 로그인한 유저정보 불러오기 ==========
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
          console.error('사용자 정보를 불러오는 중 에러:', error);
        }
      };
      fetchUserInfo();
      // fetchCartItems();
    }
  }, [currentUserEmail]);

  // 서버에 데이터 요청하기
  useEffect(() => {
    if (currentUserEmail) {
      const fetchOrderHistory = async () => {
        try {
          const response = await axios.get(`/ft/order/historyList/${currentUserEmail}`);
          setOrders(response.data);
          console.log(response);
        } catch (error) {
          if (error.response) {
            // Server responded with a status code outside of 2xx range
            console.error('주문 내역을 불러오는데 실패했습니다:', error.response.status, error.response.data);
          } else if (error.request) {
            // Request was made but no response was received
            console.error('주문 내역을 불러오는데 실패했습니다: 서버로부터 응답이 없습니다.');
          } else {
            // Something happened in setting up the request that triggered an Error
            console.error('주문 내역을 불러오는데 실패했습니다:', error.message);
          }
          setOrders([]); // 에러 발생 시 빈 배열로 설정
        }
      };
      fetchOrderHistory();
    }
  }, [currentUserEmail]);
  
  

// ======== 주문내역 불러오기 끝 ==========

  return (
    <Container fixed sx={{ mt: 5, mb: 5 }}>
      <Typography variant="h4" sx={{ marginBottom: 3 }}>
        주문 내역
      </Typography>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>주문 번호</TableCell>
              <TableCell>주문 날짜</TableCell>
              <TableCell>상품 이미지</TableCell>
              <TableCell>상품명</TableCell>
              <TableCell>개수</TableCell>
              <TableCell>총 가격</TableCell>            
              <TableCell>배송조회</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.oid}>
                <TableCell>{order.oid}</TableCell>
                <TableCell>{order.orderDate}</TableCell>
                <TableCell>
                  <img src={order.img} alt={order.name} style={{ width: 50, height: 50 }} />
                </TableCell>
                <TableCell>
                 {order.name}  {/* 갑자기 item.~~ 로 바뀌어서 안되었던 것 */}
                </TableCell>
                <TableCell>
                  {order.count}
                </TableCell>
                <TableCell>{order.totalPrice.toLocaleString()}원</TableCell>
                <TableCell>{order.status}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default OrderHistoryList;
