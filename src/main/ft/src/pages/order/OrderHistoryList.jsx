import React, { useState, useEffect } from 'react';
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
} from "@mui/material";
import { onAuthStateChanged, getAuth } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import TrackerComponent from '../../components/deliveryTracker/TrackerComponent';
import ReviewFormModal from '../../components/review/ReviewForm';
import OrderDetailModal from '../../components/order/OrderDetailModal';
import { deleteOrderHistory, fetchOrderHistory } from '../../api/orderApi';
import { selectUserData } from '../../api/firebase';

const OrderHistoryList = () => {
  const [currentUserEmail, setCurrentUserEmail] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [orders, setOrders] = useState([]); // Initialize with an empty array
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [iid, setIid] = useState();
  const [oiid, setOiid] = useState();
  const [openOrderModal, setOpenOrderModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const navigate = useNavigate();
  const auth = getAuth();
  const [data, setData] = useState(0);

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
    const fetchOrders = async () => {
      if (currentUserEmail) {
        try {
          let orderData = await fetchOrderHistory(currentUserEmail);
          if (orderData.length === 0) {
            orderData = [];
          }
          setOrders(orderData);
        } catch (error) {
          setOrders([]);
          console.log('Failed to load order history:', error);
        }
      }
    };
    fetchOrders();
  }, [currentUserEmail, data]);

  const groupedOrdersByDate = orders.reduce((acc, order) => {
    const date = order.regDate.substring(0, 10);
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(order);
    return acc;
  }, {});

  const getGroupedOrdersByOrderId = () => {
    return orders.reduce((acc, order) => {
      if (!acc[order.oid]) {
        acc[order.oid] = [];
      }
      acc[order.oid].push(order);
      return acc;
    }, {});
  };

  const sortedOrdersByOrderId = () => {
    return Object.entries(getGroupedOrdersByOrderId())
      .sort(([orderIdA], [orderIdB]) => orderIdB - orderIdA)
      .map(([orderId, orderList]) => ({
        orderId,
        orderList,
        totalPrice: orderList.reduce((total, item) => total + item.price, 0),
      }));
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
    await deleteOrderHistory(orderId, currentUserEmail, setOrders);
  };

  const openModal = (iid, oiid) => {
    if (!userInfo || !userInfo.email) {
      window.location.href = '/signIn';
      return;
    }
    setIid(iid);
    setOiid(oiid);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setIid('');
    setOiid('');
    setData(data === 0 ? 1 : 0)
  };

  const handleDetail = (order) => {
    setSelectedOrder(order);
    setOpenOrderModal(true);
  };

  const closeOrderDetailModal = () => {
    setOpenOrderModal(false);
    setSelectedOrder(null);

  };

  return (
    <Container fixed sx={{ mt: 5, mb: 5 }}>
      {orders.length === 0 ? (
        <Typography variant="h5" sx={{ marginBottom: 1, height: 500, textAlign:'center',  }}> 
          주문 내역이 없습니다
        </Typography>
      ) : (
        Object.entries(groupedOrdersByDate).map(([date, orders]) => (
          <div key={date}>
            <Typography variant="h5" sx={{ marginBottom: 1 }}>
              {date}
            </Typography>
            {sortedOrdersByOrderId().map(({ orderId, orderList, totalPrice }) => {
              const ordersForThisDate = orderList.filter(order => order.regDate.substring(0, 10) === date);
              if (ordersForThisDate.length === 0) return null;
              return (
                <div key={orderId}>
                  <Typography variant="subtitle1" sx={{ marginBottom: 1 }}>
                    주문 번호: {orderId}
                    <Button size="small" sx={{marginLeft: 1}} onClick={() => handleDetail(orderList[0])}>
                      상세조회
                    </Button>
                  </Typography>
                  <Typography variant="h6" sx={{ marginBottom: 1 }}>
                    총 가격: {totalPrice.toLocaleString()}원
                  </Typography>
                  
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell style={{ textAlign: 'center' }}>상품 이미지</TableCell>
                          <TableCell style={{ textAlign: 'center' }}>상품명</TableCell>
                          <TableCell style={{ textAlign: 'center' }}>개수</TableCell>
                          <TableCell style={{ textAlign: 'center' }}>가격</TableCell>
                          <TableCell style={{ textAlign: 'center' }}>배송조회</TableCell>
                          <TableCell style={{ textAlign: 'center' }}>주문취소/반품</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {ordersForThisDate.map((order, index) => (
                          <TableRow key={index}>
                            <TableCell style={{ borderRight: '1px solid rgba(224, 224, 224, 1)', textAlign: 'center' }}>
                              <img
                                src={order.img1}
                                alt={order.name}
                                style={{ width: 50, height: 50, cursor: 'pointer', textAlign: 'center' }}
                                onClick={() => { navigate(`/item/detail/${order.iid}`) }}
                              />
                            </TableCell>
                            <TableCell
                              style={{ borderRight: '1px solid rgba(224, 224, 224, 1)', cursor: 'pointer', textAlign: 'center' }}
                              onClick={() => { navigate(`/item/detail/${order.iid}`) }}
                            >
                              {order.name.length > 10 ? order.name.substring(0, 10) + '...' : order.name}
                              <br />
                              ({order.option})
                            </TableCell>
                            <TableCell style={{ borderRight: '1px solid rgba(224, 224, 224, 1)', textAlign: 'center' }}>{order.count}</TableCell>
                            <TableCell style={{ borderRight: '1px solid rgba(224, 224, 224, 1)', textAlign: 'center' }}>{order.price.toLocaleString()}원</TableCell>
                            <TableCell style={{ borderRight: '1px solid rgba(224, 224, 224, 1)', textAlign: 'center' }}>
                              {order.way ? (
                                <div onClick={() => DeliveryTracker(order.way)} style={{ cursor: 'pointer', textAlign: 'center' }}>
                                  <TrackerComponent order={order} />
                                </div>
                              ) : order.status}
                            </TableCell>
                            <TableCell style={{ textAlign: 'center' }}>
                              <Button variant="contained" color="error" size="small" style={{ border: '1px solid #f44336', backgroundColor: 'white', color: '#f44336', fontWeight: 'bold', }} onClick={() => handleDelete(order.oid)}>
                                주문취소
                              </Button>
                              {order.review === 0 && order.status === '배송완료' && (
                                <>
                                  <br />
                                  <Button variant="contained" color="primary" size="small" style={{ marginRight: 5, border: '1px solid #1976d2', backgroundColor: 'white', color: '#1976d2', fontWeight: 'bold', }} onClick={() => openModal(order.iid, order.oiid)}>리뷰작성</Button>
                                  <ReviewFormModal isOpen={isModalOpen} handleClose={closeModal} iid={iid} oiid={oiid} />
                                </>
                              )}
                              {order.review === 1 && (
                                <>
                                  <br />
                                  <div>리뷰 작성 완료</div>
                                </>
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                  <Divider sx={{ my: 3 }} />
                </div>
              );
            })}
          </div>
        ))
      )}
      <OrderDetailModal isOpen={openOrderModal} handleClose={closeOrderDetailModal} order={selectedOrder} />
    </Container>
  );
};

export default OrderHistoryList;
