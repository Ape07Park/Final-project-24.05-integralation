import React from 'react';
import { Modal, Box, Typography, Button } from '@mui/material';
import TrackerComponent from '../deliveryTracker/TrackerComponent';

const OrderDetailModal = ({ isOpen, handleClose, order }) => {
  if (!order) return null;

  const DeliveryTracker = (t_invoice) => {
    const carrier_id = 'kr.cjlogistics';
    const width = 400;
    const height = 600;
    const left = (window.innerWidth - width) / 2;
    const top = (window.innerHeight - height) / 2;
    const specs = `width=${width}, height=${height}, left=${left}, top=${top}`;
    window.open(`https://tracker.delivery/#/${carrier_id}/${t_invoice}`, "_blank", specs);
  };

  return (
    <Modal open={isOpen} onClose={handleClose}>
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
        }}
      >
        <Typography variant="h6" component="h2" style={{textAlign:'center'}}>
          주문 상세 정보
        </Typography>
        <Typography sx={{ mt: 2 }}>
          주문 번호: {order.oid}
        </Typography>
        <Typography sx={{ mt: 2 }}>
          주문 날짜: {order.regDate.substring(0, 10)}
        </Typography>
        <Typography sx={{ mt: 2 }}>
          상품명: {order.name}
          {order.map((orderItem, index) => (
              <span key={index}>
                  {orderItem.option}
              </span>
          ))}
        </Typography>
        <Typography sx={{ mt: 2 }}>
          가격: {order.price.toLocaleString()}원
        </Typography>
        <Typography sx={{ mt: 2 }}>
          개수: {order.count}
        </Typography>
        <Typography sx={{ mt: 2 }}>
          배송지: ({order.postCode}) {order.addr} {order.detailAddr}
        </Typography>
        <Typography sx={{ mt: 2 }}>
          전화번호: {order.tel}
        </Typography>
        <Typography sx={{ mt: 2, display: 'flex', alignItems: 'center' }}>
          배송 상태:
          {order.way ? (
            <div onClick={() => DeliveryTracker(order.way)} style={{ cursor: 'pointer', textAlign: 'center', display: 'inline-block', marginLeft: 8 }}>
              <TrackerComponent order={order} />
            </div>
          ) : (
            <span style={{ marginLeft: 8 }}>{order.status}</span>
          )}
        </Typography>
        <Typography sx={{ mt: 2 }}>
          송장 번호: {order.way}
        </Typography>
        <Button onClick={handleClose} sx={{ mt: 2 }} variant="contained" color="primary">
          닫기
        </Button>
      </Box>
    </Modal>
  );
};

export default OrderDetailModal;
