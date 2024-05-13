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
  Button,
} from "@mui/material";

import { onAuthStateChanged, getAuth } from 'firebase/auth';
import { selectUserData } from '../api/firebase';
import { useNavigate } from 'react-router-dom';
import TrackerComponent from '../components/TrackerComponent';

const t_key = process.env.REACT_APP_SWEETTRACKER_KEY;

const OrderHistoryList = () => {

  // 사용자 정보 관련 상태
  const [currentUserEmail, setCurrentUserEmail] = useState(null); // 현재 사용자 이메일
  const [userInfo, setUserInfo] = useState(null); // 사용자 정보
  const navigate = useNavigate(); // 페이지 이동을 위한 Hook
  // Firebase Auth 객체 생성
  const auth = getAuth();
  // 주문 목록 관련 상태
  const [orders, setOrders] = useState([]); // 주문 목록

  // Firebase Auth 상태가 변경될 때 실행되는 useEffect
  useEffect(() => {
    // Firebase Auth 상태 변화 관찰
    onAuthStateChanged(auth, (user) => {
      if (user) {
        // 사용자가 로그인한 경우 현재 사용자의 이메일을 상태에 설정
        setCurrentUserEmail(user.email);
      } else {
        // 사용자가 로그아웃한 경우 현재 사용자의 이메일 상태를 null로 설정
        setCurrentUserEmail(null);
      }
    });
  }, [auth]);

  // 현재 사용자 이메일이 변경될 때 실행되는 useEffect
  useEffect(() => {
    if (currentUserEmail) {
      // 현재 사용자 이메일이 존재하는 경우, 해당 이메일로 사용자 정보를 불러오는 함수 호출
      const fetchUserInfo = async () => {
        try {
          // Firebase Firestore에서 현재 사용자의 정보를 불러옴
          const info = await selectUserData(currentUserEmail);
          // 불러온 정보를 상태에 설정
          setUserInfo(info);
        } catch (error) {
          console.error('사용자 정보를 불러오는 중 에러:', error);
        }
      };
      // 함수 호출
      fetchUserInfo();
    }
  }, [currentUserEmail]);

  // 서버에 주문 내역을 요청하는 useEffect
  useEffect(() => {
    if (currentUserEmail) {
      const fetchOrderHistory = async () => {
        try {
          // 현재 사용자 이메일을 서버로 전송하여 해당 사용자의 주문 내역을 요청
          const response = await axios.post('/ft/order/historyList', { email: currentUserEmail });
          // 받은 주문 내역을 상태에 설정
          setOrders(response.data);
          console.log(response);
        } catch (error) {
          // 요청 중 에러 발생 시 에러 메시지 출력
          if (error.response) {
            console.error('주문 내역을 불러오는데 실패했습니다:', error.response.status, error.response.data);
          } else if (error.request) {
            console.error('주문 내역을 불러오는데 실패했습니다: 서버로부터 응답이 없습니다.');
          } else {
            console.error('주문 내역을 불러오는데 실패했습니다:', error.message);
          }
          // 에러 발생 시 주문 목록을 빈 배열로 설정
          setOrders([]);
        }
      };
      // 함수 호출
      fetchOrderHistory();
    }
  }, [currentUserEmail]);

  // 날짜별로 그룹화한 주문 목록 생성
  const groupedOrders = orders.reduce((acc, order) => {
    const date = order.regDate.substring(0, 10); // 날짜 부분만 추출
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(order);
    return acc;
  }, {});

  const DeliveryTracker = (t_invoice) => {      
      const carrier_id = 'kr.cjlogistics';
      
      // 창 크기와 위치를 설정합니다.
      const width = 400;
      const height = 600;
      const left = (window.innerWidth - width) / 2;
      const top = (window.innerHeight - height) / 2;
      const specs = `width=${width}, height=${height}, left=${left}, top=${top}`;

      // 새 창을 엽니다.
      window.open(`https://tracker.delivery/#/${carrier_id}/${t_invoice}`, "_blank", specs);
  };

  return (
    <Container fixed sx={{ mt: 5, mb: 5 }}>
      {/* 페이지 제목 */}
      <Typography variant="h4" sx={{ marginBottom: 3 }} style={{textAlign:"center"}}>
        주문 내역
      </Typography>

      {/* 날짜별 주문 목록 표시 */}
      {Object.entries(groupedOrders).map(([date, orders]) => (
        <div key={date}>
          {/* 날짜 표시 */}
          <Typography variant="h6" sx={{ marginBottom: 1 }}>
            {date}
          </Typography>

          {/* 주문 목록 테이블 */}
          <TableContainer>
            <Table>
              {/* 테이블 헤더 */}
              <TableHead>
                <TableRow>
                  <TableCell>상품 이미지</TableCell>
                  <TableCell>상품명</TableCell>
                  <TableCell>개수</TableCell>
                  <TableCell>가격</TableCell>
                  <TableCell>주문 날짜</TableCell>
                  <TableCell>배송조회</TableCell>
                  <TableCell>주문취소/반품</TableCell>
                </TableRow>
              </TableHead>

              {/* 테이블 바디 */}
              <TableBody>
                {orders.map((order, index) => (
                  <TableRow key={index}>
                    {/* 상품 이미지 */}
                    <TableCell>
                      <img
                        src={order.img1}
                        alt={order.name}
                        style={{ width: 50, height: 50, cursor: 'pointer' }}
                        onClick={() => { navigate(`/item/detail/${order.iid}`) }}
                      />
                    </TableCell>

                    {/* 상품명 */}
                    <TableCell
                      style={{ cursor: 'pointer' }}
                      onClick={() => { navigate(`/item/detail/${order.iid}`) }}
                    >
                      {order.name.length > 10 ? order.name.substring(0, 10) + '...' : order.name}
                      <br />
                      ({order.option})
                    </TableCell>

                    {/* 개수 */}
                    <TableCell>{order.count}</TableCell>
                    
                    {/* 총 가격 */}
                    <TableCell>{order.price.toLocaleString()}원</TableCell>

                    {/* 주문 날짜 */}
                    <TableCell>{order.regDate.substring(0, 10)}</TableCell>

                    {/* 배송조회 */}
                    <TableCell>
                      {order.way ? (
                        <div onClick={() => DeliveryTracker(order.way)} style={{cursor: 'pointer'}}>
                          <TrackerComponent order={order}/>
                        </div>
                      ) : order.status}
                    </TableCell>

                    {/* 주문취소/반품 버튼 */}
                    <TableCell>
                      <Button variant="contained" color="error" onClick={() => console.log('주문취소/반품 버튼 클릭')}>
                        주문취소/반품
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {/* 날짜 간 간격 */}
          <Divider sx={{ my: 3 }} />
        </div>
      ))}
    </Container>
  );
};

export default OrderHistoryList;
