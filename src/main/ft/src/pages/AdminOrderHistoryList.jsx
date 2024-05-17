import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Typography, Table, TableBody, TableCell, TableHead, TableRow, Divider, TableContainer,
          Button, Box, Stack, Select, MenuItem, CircularProgress, } from "@mui/material";
import { onAuthStateChanged, getAuth } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import WayModal from '../components/WayModal';
import AdminCategoryBar from '../components/AdminCategoryBar';
import { QueryClient, QueryClientProvider, useQuery } from 'react-query';
import TrackerComponent from '../components/TrackerComponent';

const queryClient = new QueryClient();

export default function AdminOrderHistoryList() {
  return (
    <QueryClientProvider client={queryClient}>
      <AdminOrderHistoryListContent />
    </QueryClientProvider>
  );
}

const fetchOrderHistory = async (email) => {
  try {
    const response = await axios.post('/ft/order/admin/historyList', { email });
    return response.data;
  } catch (error) {
    console.error('주문 내역을 불러오는데 실패했습니다:', error);
    return [];
  }
};

const AdminOrderHistoryListContent = () => {
  const [currentUserEmail, setCurrentUserEmail] = useState(null);
  const [sortBy, setSortBy] = useState('orderId');
  const [openModal, setOpenModal] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const navigate = useNavigate();
  const auth = getAuth();

  const { isLoading, data: orders } = useQuery(['orderHistory', currentUserEmail], () => fetchOrderHistory(currentUserEmail), {
    enabled: !!currentUserEmail,
    refetchInterval: 1000,
  });


  const handleOpenModal = (orderId) => {
    setSelectedOrderId(orderId);
    setOpenModal(true);
    //
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

  const getGroupedOrders = () => {
    if (!orders || !Array.isArray(orders)) {
      return {}; 
    }
  
    return orders.reduce((acc, order) => {
      if (!acc[order.oid]) {
        acc[order.oid] = [];
      }
      acc[order.oid].push(order);
      return acc;
    }, {});
  };

  const sortedOrders = () => {
    if (sortBy === 'orderId') {
      return Object.entries(getGroupedOrders())
        .sort(([orderIdA, orderListA], [orderIdB, orderListB]) => orderIdB - orderIdA)
        .map(([orderId, orderList]) => ({
          orderId,
          orderList,
          totalPrice: orderList.reduce((total, item) => total + item.price, 0),
        }));
    } else if (sortBy === 'status') {
      return Object.entries(getGroupedOrders())
        .sort(([orderIdA, orderListA], [orderIdB, orderListB]) => {
          const statusA = (orderListA[0]?.status || '').toLowerCase(); 
          const statusB = (orderListB[0]?.status || '').toLowerCase();
          if (statusA > statusB) {
            return -1;
          }
          if (statusA < statusB) {
            return 1;
          }
          return 0;
        })
        .map(([orderId, orderList]) => ({
          orderId,
          orderList,
          totalPrice: orderList.reduce((total, item) => total + item.price, 0),
        }));
    }
  };
  
  const handleSortChange = (event) => {
    setSortBy(event.target.value);
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
    <Container fixed sx={{ mb: 5 }}>
      <AdminCategoryBar/>
      <Box sx={{ display: 'flex', justifyContent: 'flex-start', mb: 2 }}>
        <Select value={sortBy} onChange={handleSortChange}>
          <MenuItem value="orderId">주문 번호별 정렬</MenuItem>
          <MenuItem value="status">배송 상태별 정렬</MenuItem>
        </Select>
      </Box>

      <Divider sx={{ mb: 2 }} />

      {isLoading ? ( // Check if loading
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
          <CircularProgress /> 
        </Box>
      ) : (
        sortedOrders().map(({ orderId, orderList, totalPrice }) => (
          <Box key={orderId} sx={{ mb: 3 }}>
            <Stack direction="row" spacing={2} alignItems="center">
              <Typography variant="h6">주문 번호: {orderId}</Typography>
              <Typography variant="body2">주문자: {orderList[0].email}</Typography>
              <Typography variant="body2">주문날짜: {orderList[0].regDate.substring(0, 10)}</Typography>
              <Typography variant="body2">총 가격: {totalPrice.toLocaleString()}원</Typography>
              <Typography variant="body2" onClick={() => DeliveryTracker(orderList[0].way)} style={{ cursor: 'pointer' }}>
                {orderList[0].way ? (  
                  <div onClick={() => DeliveryTracker(orderList[0].way)} style={{ cursor: 'pointer', textAlign:'center' }}>
                    <TrackerComponent order={orderList[0]} />
                  </div>
                ) : orderList[0].status}
              </Typography>
              <WayModal
                open={openModal && selectedOrderId === orderId}
                onClose={handleCloseModal}
                order={orderList[0]}
              />
              <Typography variant="body2" onClick={() => handleOpenModal(orderId)} style={{cursor: 'pointer'}}>
                {orderList.some(order => order.way) ? (
                  <>송장 번호: {orderList[0].way}</>
                ) : (
                  <Button size="small" variant="contained" onClick={() => handleOpenModal(orderId)}>
                    송장 입력
                  </Button>
                )}
              </Typography>
              <Button size="small" variant="contained" color="error" onClick={() => handleDelete(orderId)}>
                주문취소
              </Button>
            </Stack>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell align="center">상품 이미지</TableCell>
                    <TableCell align="center">상품명</TableCell>
                    <TableCell align="center">개수</TableCell>
                    <TableCell align="center">가격</TableCell>
                    <TableCell align="center">주문 취소 여부</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {orderList.map((order, index) => (
                    <TableRow key={index}>
                      <TableCell align="center" style={{ borderRight: '1px solid rgba(224, 224, 224, 1)' }}>
                        <img
                          src={order.img1}
                          alt={order.name}
                          style={{ width: 50, height: 50, cursor: 'pointer' }}
                          onClick={() => { navigate(`/item/detail/${order.iid}`) }}
                        />
                      </TableCell>
                      <TableCell align="center" style={{ cursor: 'pointer', borderRight: '1px solid rgba(224, 224, 224, 1)' }} onClick={() => { navigate(`/item/detail/${order.iid}`) }}>
                        {order.name.length > 10 ? `${order.name.substring(0, 10)}...` : order.name}
                        <br />({order.option})
                      </TableCell>
                      <TableCell align="center" style={{ borderRight: '1px solid rgba(224, 224, 224, 1)' }}>
                        {order.count}
                      </TableCell>
                      <TableCell align="center" style={{ borderRight: '1px solid rgba(224, 224, 224, 1)' }}>
                        {order.price.toLocaleString()}원
                      </TableCell>
                      <TableCell align="center" style={{ color: 'red' }}>
                        <Typography variant='h4'>{order.isDeleted}</Typography>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <Divider sx={{ mt: 2 }} />
          </Box>
        ))
      )}

      {!isLoading && sortedOrders().length === 0 && (
        <Typography variant="h6" align="center">
          주문 내역이 없습니다.
        </Typography>
      )}
    </Container>
  );
};
