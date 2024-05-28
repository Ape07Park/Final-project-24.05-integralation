import React, { useState } from 'react';
import axios from 'axios';
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
} from "@mui/material";

const FindPassModalSpring = ({ handleClose }) => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleInputChange = (e) => {
    setEmail(e.target.value);
  };

  const getEmailMessage = async (email) => {
    try {
      const response = await axios.post('/ft/email/message', null, {
        params: { email: email }
      });
      setMessage('이메일을 열어 확인 코드를 입력해주세요.');
    } catch (error) {
      console.error('Error fetching email message:', error);
      setMessage('이메일 전송에 실패했습니다.');
    }
  };

  return (
    <Box>
      <Typography variant="h6">
        이메일을 입력하세요
      </Typography>
      <TextField
        type="email"
        value={email}
        onChange={handleInputChange}
        placeholder="Enter your email"
        fullWidth
        margin="normal"
      />
      <Button variant='contained' onClick={() => getEmailMessage(email)}>
        제출
      </Button>
      <Button variant='contained' onClick={handleClose} sx={{ mt: 2 }}>
        닫기
      </Button>
      {message && (
        <Box mt={2}>
          <Typography variant="body1">{message}</Typography>
        </Box>
      )}
    </Box>
  );
};

export default FindPassModalSpring;
