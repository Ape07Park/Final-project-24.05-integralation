import React, { useState } from "react";
import { Modal, Box, TextField, Button, Typography } from "@mui/material";
import { auth, RecaptchaVerifier, signInWithPhoneNumber } from "../api/firebase";

const FindPassModalPhone = ({ open, onClose }) => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [user, setUser] = useState(null);

  const formatPhoneNumber = (number) => {
    // 국제 전화번호 형식으로 변환
    if (number.startsWith('0')) {
      return `+82${number.substring(1)}`;
    }
    return number;
  };

  const sendCodeToMobile = () => {
    const formattedPhoneNumber = formatPhoneNumber(phoneNumber);
    auth.languageCode = "ko"; // 한국어 설정

    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {});
    }

    signInWithPhoneNumber(auth, formattedPhoneNumber, window.recaptchaVerifier)
      .then((confirmationResult) => {
        window.confirmationResult = confirmationResult;
        setIsCodeSent(true);
      })
      .catch((error) => {
        console.log("인증에 실패하였습니다.", error);
      });
  };

  const verifyCode = () => {
    window.confirmationResult
      .confirm(verificationCode)
      .then((result) => {
        setUser(result.user);
        console.log("인증에 성공하셨습니다");
      })
      .catch((error) => {
        console.log("인증번호가 올바르지 않습니다.", error);
      });
  };

  const changePassword = () => {
    if (user) {
      user.updatePassword(newPassword).then(() => {
        console.log("비밀번호가 성공적으로 변경되었습니다.");
        onClose();
      }).catch((error) => {
        console.log("비밀번호 변경에 실패하였습니다.", error);
      });
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={{ ...modalStyle }}>
        {!isCodeSent ? (
          <>
            <Typography variant="h6">휴대폰 번호로 인증 코드 보내기</Typography>
            <TextField
              label="휴대폰 번호"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              fullWidth
              margin="normal"
            />
            <div id="recaptcha-container"></div>
            <Button variant="contained" onClick={sendCodeToMobile}>
              인증 코드 보내기
            </Button>
          </>
        ) : (
          <>
            <Typography variant="h6">인증 코드 확인</Typography>
            <TextField
              label="인증 코드"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              fullWidth
              margin="normal"
            />
            <Button variant="contained" onClick={verifyCode}>
              코드 확인
            </Button>
          </>
        )}
        {user && (
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
            <Button variant="contained" onClick={changePassword}>
              비밀번호 변경
            </Button>
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

export default FindPassModalPhone;
