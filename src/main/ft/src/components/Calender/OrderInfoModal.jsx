import React from 'react';
import { Modal, Box, Button, Typography } from '@mui/material';

const OrderInfoModal = ({ isOpen, onRequestClose, orders }) => {
  // orders를 배열로 변환
  const orderList = Object.values(orders);
  console.log(orderList);
  return (
    <Modal
      open={isOpen}
      onClose={onRequestClose}
      aria-labelledby="order-modal-title"
      aria-describedby="order-modal-description"
    >
      <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, bgcolor: 'background.paper', boxShadow: 24, p: 4 }}>
        <Typography id="order-modal-title" variant="h4" component="h2" gutterBottom>
          주문 내역
        </Typography>
        <Button onClick={onRequestClose} className="close-button">닫기</Button>
        {orderList.length > 0 ? (
          <ul>
            {orderList.map((order, index) => (
              <li key={index} className="order-item">
                <p>:{order.regDate} </p>
                <img src={order.img1} alt={order.name} className="order-item-image" />
                <div className="order-item-details">
                  <h3>{order.name}</h3>
                  <p>옵션:{order.option} </p>
                  <p>수량: {order.count}</p>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <Typography id="order-modal-description" variant="body1" gutterBottom>
            주문 내역이 없습니다.
          </Typography>
        )}
      </Box>
    </Modal>
  );
};

export default OrderInfoModal;