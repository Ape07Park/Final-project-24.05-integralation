import React, { useState } from 'react';
import axios from 'axios';
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  Grid,
} from "@mui/material";
import CustomButton from '../publics/CustomButton';
import {selectUserEmailPassword, login, auth, changePasswordFromDB, 
  updatePassword, signInWithEmailAndPassword, logout} from "../../api/firebase";

const FindPassModalSpring = ({ open, onClose }) => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [userInputCode, setUserInputCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newPassword2, setNewPassword2] = useState('');
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [isCodeVerified, setIsCodeVerified] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');

  const getEmailMessage = async (email) => {
    try {
      const response = await axios.post('/ft/email/message', null, {
        params: { email: email }
      });
      setMessage('이메일을 열어 확인 코드를 입력해주세요.');
      setIsCodeSent(true);  // 이메일 전송 후 상태 업데이트
    } catch (error) {
      console.error('Error fetching email message:', error);
      setMessage('이메일 전송에 실패했습니다.');
    }
  };

  const checkVerificationCode = async () => {
    try {
      const response = await axios.get('/ft/email/getEpw');

      const responseData = response.data;
      const verifyCodeFromServer = responseData.ePw;

      console.log('인증번호 요청:', verifyCodeFromServer);

      setVerificationCode(verifyCodeFromServer);

      if (userInputCode === verifyCodeFromServer) {
        setIsCodeVerified(true);
        console.log('인증번호 일치');
        // 로그인 시도
        loginUser();
      } else {
        setIsCodeVerified(false);
        console.log('인증번호 불일치');
      }
    } catch (error) {
      console.error('인증번호 요청 실패:', error);
    }
  };

  const loginUser = async () => {
    try {
      // 강제 로그인을 위해 가져온 이메일과 비밀번호로 로그인 시도
      const userCredentials = await selectUserEmailPassword(email);
      if (userCredentials && userCredentials.email && userCredentials.password) {
        const { email, password } = userCredentials;
  
        // Firebase Authentication을 사용하여 이메일과 비밀번호로 로그인
        const { user } = await signInWithEmailAndPassword(auth, email, password);
        if (user) {
          console.log('로그인 성공');
        } else {
          console.error("사용자 로그인에 실패하였습니다.");
        }
      } else {
        console.error("사용자 정보를 가져오는 데 실패했습니다.");
      }
    } catch (error) {
      console.error("로그인에 실패하였습니다.", error);
    }
  };

  const changePassword = async () => {
    try {
      if (newPassword === newPassword2) {
        // 현재 로그인한 사용자를 가져옴
        const currentUser = auth.currentUser;     

        // 비밀번호 변경 요청
        await updatePassword(currentUser, newPassword);

        //  *** DB에서 비번 변경
        // 어디서 내가 입력한 이메일을 여기로 가져올 것인가?
        
        console.log("email*******" + email);
        await changePasswordFromDB(email, newPassword);

        console.log("비밀번호가 성공적으로 변경되었습니다.");

        // 비밀번호 변경 후 사용자 로그아웃
        await logout();

        // 모달 닫기
        onClose();
      } else {
        window.alert("비밀번호가 다릅니다.")
    }
    } catch (error) {
      console.error("비밀번호 변경에 실패하였습니다.", error);
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={{ ...modalStyle }}>
        {!isCodeSent ? (
          <>
            <Typography variant="h6">
              이메일을 입력하세요(스프링)
            </Typography>
            <TextField
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              fullWidth
              margin="normal"
            />
            <Grid style={{ textAlign: 'center' }}>
              <CustomButton variant='contained' onClick={() => getEmailMessage(email)}>
                이메일로 인증코드 보내기
              </CustomButton>
            </Grid>
          </>
        ) : (
          <>
            <Typography variant="h6">인증 코드 확인</Typography>
            <TextField
              label="인증 코드"
              value={userInputCode}
              onChange={(e) => setUserInputCode(e.target.value)}
              fullWidth
              margin="normal"
            />
            <CustomButton variant="contained" onClick={checkVerificationCode}>
              코드 확인
            </CustomButton>
          </>
        )}
        {message && (
          <Box mt={2}>
            <Typography variant="body1">{message}</Typography>
          </Box>
        )}
        {isCodeVerified && (
          <>
            <Typography variant="h6">새 비밀번호 설정</Typography>
            <TextField
              label="새 비밀번호"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              fullWidth
              margin="normal"
            />
            <TextField
              label="새 비밀번호 확인"
              type="password"
              value={newPassword2}
              onChange={(e) => setNewPassword2(e.target.value)}
              fullWidth
              margin="normal"
            />
            <CustomButton variant="contained" onClick={changePassword}>
              비밀번호 변경
            </CustomButton>
          </>
        )}
      </Box>
    </Modal>
  );
};

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
};

export default FindPassModalSpring;
