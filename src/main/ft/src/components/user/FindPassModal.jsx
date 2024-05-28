import React, { useState } from 'react';
import { changePassword } from '../../api/firebase';
import {
  Box,
  Typography,
  TextField,
  Button,
} from "@mui/material";

const FindPassModal = ({ handleClose }) => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleInputChange = (e) => {
    setEmail(e.target.value);
  };

  const findPassFirebase = async (email) => {
    try {
      await changePassword(email);
      setMessage('이메일을 전송하였습니다. 확인 해주세요.');
    } catch (error) {
      setMessage('비밀번호 변경 요청 실패.');
    }
  };

  return (
    <Box>
      <Typography variant="h6">
        이메일을 입력하세요 - 파이어베이스
      </Typography>
      <TextField
        type="email"
        value={email}
        onChange={handleInputChange}
        placeholder="Enter your email"
        fullWidth
        margin="normal"
      />
      <Button variant='contained' onClick={() => findPassFirebase(email)}>
        제출
      </Button>
      {message && (
        <Box mt={2}>
          <Typography variant="h6">이메일 주소 확인</Typography>
          <Typography variant="body1">{message}</Typography>
        </Box>
      )}
      <Button variant='contained' onClick={handleClose} sx={{ mt: 2 }}>
        닫기
      </Button>
    </Box>
  );
};

export default FindPassModal;
