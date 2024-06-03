import React, { useState } from 'react';
import { changePassword } from '../../api/firebase';
import {
  Box,
  Typography,
  TextField,
  Button,
} from "@mui/material";

import CustomButton from '../publics/CustomButton';

const ChangePassModal = ({ handleClose }) => {
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
      <Typography variant="h6" style={{ textAlign: 'center' }}>
        이메일을 입력하세요(비밀번호 변경)
      </Typography>
      <TextField
        type="email"
        value={email}
        onChange={handleInputChange}
        placeholder="Enter your email"
        fullWidth
        margin="normal"
      />
      <Box display="flex" justifyContent="center" mt={2}>
        <CustomButton variant="contained" onClick={() => findPassFirebase(email)}>
          이메일로 인증코드 보내기
        </CustomButton>
      </Box>
      {message && (
        <Box mt={2}>
          <Typography variant="h6">이메일 주소 확인</Typography>
          <Typography variant="body1">{message}</Typography>
        </Box>
      )}
    </Box>
  );
};

export default ChangePassModal;
