import React from 'react';
import { Modal, Box, Typography, Grid } from '@mui/material';
import '../../css/orderInfoModal.css';
import {  useNavigate } from 'react-router-dom';

const OrderInfoModal = ({ isOpen, onRequestClose, orders }) => {
  const orderList = (orders) ? Object.values(orders): []; // orders가 존재 여부 확인하고, 존재 x 시 빈 배열로 내보냄
  const navigate = useNavigate();

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(); // Format the date to 'MM/DD/YYYY' or your preferred format
  };

  // Group orders by order ID
  const groupedOrders = orderList.reduce((acc, order) => {
    if (!acc[order.oid]) {
      acc[order.oid] = [];
    }
    acc[order.oid].push(order);
    return acc;
  }, {});

  return (
    <Modal
      open={isOpen}
      onClose={onRequestClose}
      aria-labelledby="order-modal-title"
      aria-describedby="order-modal-description"
    >
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 400,
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4,
          maxHeight: '80vh',
          overflowY: 'auto'
        }}
      >
        <Typography id="order-modal-title" variant="h4" component="h2" gutterBottom>
          {orderList.length > 0 && orderList[0].regDate ? <>주문 내역({formatDate(orderList[0].regDate)})</> : '주문 내역'} {/* 길이로 orderList가 있다는 것을 확정지음 */}
        </Typography>

        <div className="order-content">
          {Object.keys(groupedOrders).length > 0 ? (
            <Grid container spacing={2} component="ul" sx={{ padding: 0 }}>
              {Object.entries(groupedOrders).map(([oid, orders]) => (
                <Grid item xs={12} key={oid} component="li" className="order-item" sx={{ listStyle: 'none', padding: 0 }}>
                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12}>
                      <Typography variant="subtitle1">주문번호: {oid}</Typography>
                    </Grid>
                    {orders.map((order, index) => (
                      <React.Fragment key={index}>
                        <Grid item xs={12}>
                          <Typography variant="body2">{formatDate(order.regDate)}</Typography>
                        </Grid>
                        <Grid item xs={3}>
                          <img src={order.img1}
                            alt={order.name}
                            className="order-item-image"
                            style={{ width: '100%', height: 'auto', cursor: 'pointer' }}
                            onClick={() => { navigate(`/item/detail/${order.iid}`) }} />
                        </Grid>
                        <Grid item xs={9}>
                          <Typography variant="h6"
                            style={{ cursor: 'pointer' }}
                            onClick={() => { navigate(`/item/detail/${order.iid}`) }}>{order.name}
                          </Typography>
                          <Typography variant="body2">옵션: {order.option}</Typography>
                          <Typography variant="body2">수량: {order.count}</Typography>
                          <Typography variant="body2"
                            style={{ fontWeight: 'bold' }}
                          >
                            배송 상태: {order.status}
                          </Typography>
                        </Grid>
                      </React.Fragment>
                    ))}
                  </Grid>
                </Grid>
              ))}
            </Grid>
          ) : (
            <Typography id="order-modal-description" variant="body1" gutterBottom>
              주문 내역이 없습니다.
            </Typography>
          )}
        </div>
      </Box>
    </Modal>
  );
};

export default OrderInfoModal;