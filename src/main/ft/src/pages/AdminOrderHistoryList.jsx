import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
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
  Box,
  Stack,
} from "@mui/material";

import { onAuthStateChanged, getAuth } from 'firebase/auth';
import { selectUserData } from '../api/firebase';
import { useNavigate } from 'react-router-dom';
import TrackerComponent from '../components/TrackerComponent';
import WayModal from '../components/WayModal';

const t_key = process.env.REACT_APP_SWEETTRACKER_KEY;

const AdminOrderHistoryList = () => {
  const [currentUserEmail, setCurrentUserEmail] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const navigate = useNavigate();
  const auth = getAuth();
  const [orders, setOrders] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);

  const handleOpenModal = (orderId) => {
    setSelectedOrderId(orderId);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

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
          const response = await axios.post('/ft/order/admin/historyList', { email: currentUserEmail });
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

  const getGroupedOrders = () => {
    return orders.reduce((acc, order) => {
      if (!acc[order.oid]) {
        acc[order.oid] = [];
      }
      acc[order.oid].push(order);
      return acc;
    }, {});
  };

  const sortedOrders = () => {
    return Object.entries(getGroupedOrders())
      .sort(([orderIdA], [orderIdB]) => orderIdB - orderIdA)
      .map(([orderId, orderList]) => ({
        orderId,
        orderList,
        totalPrice: orderList.reduce((total, item) => total + item.price, 0),
      }));
  };

  const sortOrdersByStatus = () => {
    navigate("/admin/order/list2");
  };

  const DeliveryTracker = (t_invoice) => {
    const carrier_id = 'kr.cjlogistics';
    const width = 400;
    const height = 600;
    const left = (window.innerWidth - width) / 2;
    const top = (window.innerHeight - height) / 2;
    const specs = `width=${width}, height=${height}, left=${left}, top=${top}`;
    window.open(`https://tracker.delivery/#/${carrier_id}/${t_invoice}`, "_blank", specs);
  };

  const handleDelete = async (orderId) => {
    const confirmDelete = window.confirm("정말로 주문을 취소하시겠습니까?");
    if (!confirmDelete) return;

    try {
      await axios.post('/ft/order/orderDelete', { oid: orderId });
      console.log('주문 삭제 완료');
    } catch (error) {
      console.error('주문 삭제 실패:', error);
    }
  };

  return (
    <Container fixed sx={{ mt: 5, mb: 5 }}>
      <Typography variant="h4" align="center" sx={{ mb: 3 }}>
        주문 관리
      </Typography>

      <Button onClick={sortOrdersByStatus} variant="contained" sx={{ mb: 2 }}>
        배송 상태별 정렬
      </Button>

      <hr />

      {sortedOrders().map(({ orderId, orderList, totalPrice }) => (
        <Box key={orderId} sx={{ mb: 3 }}>
          <Stack direction="row" spacing={2} alignItems="center">
            <Typography variant="h6">
              주문 번호: {orderId}
            </Typography>

            <Typography variant="body2">
              주문자: {orderList[0].email}
            </Typography>

            <Typography variant="body2">
              주문날짜: {orderList[0].regDate.substring(0, 10)}
            </Typography>

            <Typography variant="body2">
              총 가격: {totalPrice.toLocaleString()}원
            </Typography>

            <Typography variant="body2" onClick={() => DeliveryTracker(orderList[0].way)} style={{ cursor: 'pointer' }}>
              배송상태: {orderList[0].status}
            </Typography>

            <WayModal
              open={openModal && selectedOrderId === orderId}
              onClose={handleCloseModal}
              order={orderList[0]}
            />

            <Typography variant="body2">
              {orderList.some(order => order.way) ? (
                <>송장 번호: {orderList[0].way}</>
              ) : (
                <Button size="small" variant="contained" onClick={() => handleOpenModal(orderId)}>
                  송장 입력
                </Button>
              )}
            </Typography>

            <Typography>
              {orderList[0].status !== '주문완료' ? (
                <Button size="small" variant="contained" color="error" onClick={() => handleDelete(orderId)}>
                  주문취소
                </Button>
              ) : (
                <>
                  <Divider orientation="vertical" flexItem />
                  <Button size="small" variant="contained" color="error" onClick={() => handleDelete(orderId)}>
                    주문취소
                  </Button>
                </>
              )}
            </Typography>
          </Stack>

          {/* Order details */}
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>상품 이미지</TableCell>
                  <TableCell>상품명</TableCell>
                  <TableCell align="center">개수</TableCell>
                  <TableCell align="center">가격</TableCell>
                  <TableCell align="center">주문 취소 여부</TableCell> {/* Aligning text to center */}
                </TableRow>
              </TableHead>

              <TableBody>
                {orderList.map((order, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <img
                        src={order.img1}
                        alt={order.name}
                        style={{ width: 50, height: 50, cursor: 'pointer' }}
                        onClick={() => { navigate(`/item/detail/${order.iid}`) }}
                      />
                    </TableCell>

                    <TableCell style={{ cursor: 'pointer' }} onClick={() => { navigate(`/item/detail/${order.iid}`) }}>
                      {order.name.length > 10 ? order.name.substring(0, 10) + '...' : order.name}
                      <br />
                      ({order.option})
                    </TableCell>

                    <TableCell align="center">{order.count}</TableCell> {/* Aligning text to center */}
                    <TableCell align="center">{order.price.toLocaleString()}원</TableCell> {/* Aligning text to center */}

                    <TableCell align="center" style={{ color: 'red' }}> {/* Aligning text to center */}
                      <Typography variant='h4'>{order.isDeleted}</Typography>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Divider />
        </Box>
      ))}

      {sortedOrders().length === 0 && (
        <Typography variant="h6" align="center">
          주문 내역이 없습니다.
        </Typography>
      )}
    </Container>
  );
};

export default AdminOrderHistoryList;
