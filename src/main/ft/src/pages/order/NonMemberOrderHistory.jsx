import React, { useState } from 'react';
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
  FormControl,
  InputLabel,
  Input,
} from "@mui/material";
import { useNavigate } from 'react-router-dom';
import TrackerComponent from '../../components/deliveryTracker/TrackerComponent';
import OrderDetailModal from '../../components/order/OrderDetailModal';
import { deleteAdminOrderHistory, nonMembersOrderHistory } from '../../api/orderApi';

const NonMemberOrderHistory = () => {
  const [name, setName] = useState('');
  const [tel, setTel] = useState('');
  const [orders, setOrders] = useState([]);
  const [openOrderModal, setOpenOrderModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const navigate = useNavigate();

  const fetchOrderHistory = async () => {
    try {
      const response = await nonMembersOrderHistory(name, tel);
      setOrders(response.data);
    } catch (error) {
      console.log('주문 내역을 불러오는데 실패했습니다:', error);
      setOrders([]);
    }
  };
  
  // 날짜 별로 그룹화된 주문 목록 생성
  const groupedOrdersByDate = orders.reduce((acc, order) => {
    const date = order.regDate.substring(0, 10); // extract only the date part
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(order);
    return acc;
  }, {});

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
    deleteAdminOrderHistory(orderId);
  };

  const handleChange = (e) => {
    const { value } = e.target;
    // 숫자 이외의 문자 제거
    const telValue = value.replace(/[^0-9]/g, '');
    // 하이픈(-) 추가
    let formattedTel = '';
    if (telValue.length <= 3) {
      formattedTel = telValue;
    } else if (telValue.length <= 7) {
      formattedTel = telValue.slice(0, 3) + '-' + telValue.slice(3);
    } else if (telValue.length <= 11) {
      formattedTel = telValue.slice(0, 3) + '-' + telValue.slice(3, 7) + '-' + telValue.slice(7);
    } else {
      formattedTel = telValue.slice(0, 3) + '-' + telValue.slice(3, 7) + '-' + telValue.slice(7, 11);
    }

    // 최대 길이 제한을 넘지 않도록 자르기
    const maxLength = 13; // 최대 길이는 13자리 (010-1234-5678)
    const updatedTel = formattedTel.slice(0, maxLength);

    // 상태 업데이트
    setTel(updatedTel);
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
      <Box textAlign="center" marginBottom={2}>
        <Typography variant="h5">비회원 주문 내역 조회</Typography>
        <Box display="flex" justifyContent="center" marginBottom="1rem" marginTop="1rem">
          <Box sx={{ marginRight: '1rem' }}>
            <FormControl>
              <InputLabel htmlFor="name-input">이름</InputLabel>
              <Input 
                id="name-input"
                type="text" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
              />
            </FormControl>
          </Box>
          <Box>
            <FormControl>
              <InputLabel htmlFor="tel-input">전화번호</InputLabel>
              <Input 
                id="tel-input"
                type="text" 
                placeholder="- 없이 작성하세요" 
                value={tel} 
                onChange={handleChange}  
              />
            </FormControl>
          </Box>
        </Box>
        <Button variant="contained" color="primary" onClick={fetchOrderHistory} style={{ display: 'block', margin: '0 auto' }}>
          조회
        </Button>
      </Box>
      <Box sx={{ marginTop: 2 }}>
        {orders.length > 0 ? (
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
                      <Button size="small" sx={{marginLeft: 1}} onClick={() => handleDetail(orderList[0])}>
                        상세조회
                      </Button>
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
                                <Button variant="contained" color="error" size="small" onClick={() => handleDelete(order.oid)}>
                                  주문취소
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
        ) : (
          <Typography variant="body1">조회된 주문 내역이 없습니다.</Typography>
        )}
      </Box>
      <OrderDetailModal isOpen={openOrderModal} handleClose={closeOrderDetailModal} order={selectedOrder} />
    </Container>
  );
};

export default NonMemberOrderHistory;