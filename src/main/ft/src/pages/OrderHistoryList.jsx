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

  const [currentUserEmail, setCurrentUserEmail] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const navigate = useNavigate();
  const auth = getAuth();
  const [orders, setOrders] = useState([]);

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
    }
  }, [currentUserEmail]);

  useEffect(() => {
    if (currentUserEmail) {
      const fetchOrderHistory = async () => {
        try {
          const response = await axios.post('/ft/order/historyList', { email: currentUserEmail });
          setOrders(response.data);
          console.log(response);
        } catch (error) {
          if (error.response) {
            console.error('주문 내역을 불러오는데 실패했습니다:', error.response.status, error.response.data);
          } else if (error.request) {
            console.error('주문 내역을 불러오는데 실패했습니다: 서버로부터 응답이 없습니다.');
          } else {
            console.error('주문 내역을 불러오는데 실패했습니다:', error.message);
          }
          setOrders([]);
        }
      };
      fetchOrderHistory();
    }
  }, [currentUserEmail]);

  // 날짜 별로 그룹화된 주문 목록 생성
  const groupedOrdersByDate = orders.reduce((acc, order) => {
    const date = order.regDate.substring(0, 10); // extract only the date part
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(order);
    return acc;
  }, {});

  // 주문번호로 그룹화된 주문 목록 생성
  const getGroupedOrdersByOrderId = () => {
    return orders.reduce((acc, order) => {
      if (!acc[order.oid]) {
        acc[order.oid] = [];
      }
      acc[order.oid].push(order);
      return acc;
    }, {});
  };

  // 주문번호를 높은 순으로 정렬하여 반환
  const sortedOrdersByOrderId = () => {
    return Object.entries(getGroupedOrdersByOrderId())
      .sort(([orderIdA], [orderIdB]) => orderIdB - orderIdA) // sort by order id in descending order
      .map(([orderId, orderList]) => ({
        orderId,
        orderList,
        totalPrice: orderList.reduce((total, item) => total + item.price, 0), // calculate total price for each order
      }));
  };

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

const handleDelete = async (orderId) => {
  const confirmDelete = window.confirm("정말로 주문을 취소하시겠습니까?");
  if (!confirmDelete) return; // 사용자가 취소를 선택한 경우 함수 종료

  try {
    await axios.post('/ft/order/orderDelete', { oid: orderId });
    console.log('주문 삭제 완료');
    // 여기서 필요하다면 상태를 업데이트하거나 다른 작업을 수행할 수 있습니다.
  } catch (error) {
    console.error('주문 삭제 실패:', error);
  }
};

  return (
    <Container fixed sx={{ mt: 5, mb: 5 }}>
      {/* 날짜별로 주문 목록 표시 */}
      {Object.entries(groupedOrdersByDate).map(([date, orders]) => (
        <div key={date}>
          {/* 날짜 표시 */}
          <Typography variant="h5" sx={{ marginBottom: 1 }}>
            {date}
          </Typography>

          {/* 주문번호 별로 주문 목록 표시 */}
          {sortedOrdersByOrderId().map(({ orderId, orderList, totalPrice }) => {
            const ordersForThisDate = orderList.filter(order => order.regDate.substring(0, 10) === date);
            if (ordersForThisDate.length === 0) return null;
            return (
              <div key={orderId}>
                {/* 주문 번호 표시 */}
                <Typography variant="subtitle1" sx={{ marginBottom: 1 }}>
                  주문 번호: {orderId}
                </Typography>

                {/* 총 가격 표시 */}
                <Typography variant="h6" sx={{ marginBottom: 1 }}>
                  총 가격: {totalPrice.toLocaleString()}원
                </Typography>

                {/* 주문 목록 테이블 */}
                <TableContainer>
                  <Table>
                    {/* 테이블 헤더 */}
                    <TableHead>
                      <TableRow>
                        <TableCell style={{textAlign:'center'}}>상품 이미지</TableCell>
                        <TableCell style={{textAlign:'center'}}>상품명</TableCell>
                        <TableCell style={{textAlign:'center'}}>개수</TableCell>
                        <TableCell style={{textAlign:'center'}}>가격</TableCell>
                        <TableCell style={{textAlign:'center'}}>배송조회</TableCell>
                        <TableCell style={{textAlign:'center'}}>주문취소/반품</TableCell>
                      </TableRow>
                    </TableHead>

                    {/* 테이블 바디 */}
                    <TableBody>
                      {ordersForThisDate.map((order, index) => (
                        <TableRow key={index}>
                          {/* 상품 이미지 */}
                          <TableCell style={{ borderRight: '1px solid rgba(224, 224, 224, 1)', textAlign:'center'}}>
                            <img
                              src={order.img1}
                              alt={order.name}
                              style={{ width: 50, height: 50, cursor: 'pointer', textAlign:'center' }}
                              onClick={() => { navigate(`/item/detail/${order.iid}`) }}
                            />
                          </TableCell>

                          {/* 상품명 */}
                          <TableCell
                            style={{ borderRight: '1px solid rgba(224, 224, 224, 1)', cursor: 'pointer', textAlign:'center' }}
                            onClick={() => { navigate(`/item/detail/${order.iid}`) }}
                          >
                            {order.name.length > 10 ? order.name.substring(0, 10) + '...' : order.name}
                            <br />
                            ({order.option})
                          </TableCell>

                          {/* 개수 */}
                          <TableCell style={{ borderRight: '1px solid rgba(224, 224, 224, 1)', textAlign:'center' }}>{order.count}</TableCell>
                          
                          {/* 가격 */}
                          <TableCell style={{ borderRight: '1px solid rgba(224, 224, 224, 1)', textAlign:'center' }}>{order.price.toLocaleString()}원</TableCell>

                          {/* 배송조회 */}
                          <TableCell style={{ borderRight: '1px solid rgba(224, 224, 224, 1)', textAlign:'center' }}>
                            {order.way ? (
                              <div onClick={() => DeliveryTracker(order.way)} style={{ cursor: 'pointer', textAlign:'center' }}>
                                <TrackerComponent order={order} />
                              </div>
                            ) : order.status}
                          </TableCell>

                          {/* 주문취소/반품 버튼 */}
                          <TableCell style={{textAlign:'center'}}>
                            <Button variant="contained" color="error" onClick={() => handleDelete(order.oid)}>
                              주문취소/반품
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>

                {/* 주문 간 간격 */}
                <Divider sx={{ my: 3 }} />
              </div>
            );
          })}
        </div>
      ))}
    </Container>
  );
};

export default OrderHistoryList;
