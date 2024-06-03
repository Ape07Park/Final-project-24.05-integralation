import React, { useState } from 'react';
import axios from 'axios';
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
} from "@mui/material";

const WayModal = ({ open, onClose, order }) => {
  const [trackingNumber, setTrackingNumber] = useState(order.way || '');

  const handleTrackingNumberChange = (event) => {
    setTrackingNumber(event.target.value);
  };

  const handleUpdateWay = async () => {
    try {
      // 서버로 운송장 번호를 전송
      order.oid = String(order.oid); // 05/31 추가함
      await axios.post('/ft/order/orderWayUpdate', { oid: order.oid, way: trackingNumber });
      // 모달 닫기
      onClose();
    } catch (error) {
      console.log('운송장 번호 업데이트 실패:', error);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box
        sx={{
          position: 'absolute',
          width: 400,
          bgcolor: 'background.paper',
          border: '2px solid #000',
          boxShadow: 24,
          p: 4,
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
        }}
      >
        <Typography id="modal-modal-title" variant="h6" component="h2">
          운송장 번호 입력
        </Typography>
        <TextField
          label="운송장 번호"
          fullWidth
          value={trackingNumber}
          onChange={handleTrackingNumberChange}
        />
        <Button variant="contained" onClick={handleUpdateWay}>업데이트</Button>
      </Box>
    </Modal>
  );
};

export default WayModal;