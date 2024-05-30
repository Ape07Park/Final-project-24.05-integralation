import React, { useState } from "react";
import { Modal, Box, TextField, Button, Typography } from "@mui/material";
import axios from 'axios';
import { getDatabase, ref, get } from "firebase/database";
import CustomButton from "../CustomButton";

const FindEmailModalPhone = ({ open, onClose }) => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [userInputCode, setUserInputCode] = useState("");
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [isCodeVerified, setIsCodeVerified] = useState(null);


  // 서버에 인증번호 보내라고 요청 보내기
  const sendCodeToMobile = async () => {
    try {
      // 서버로 번호를 전송
      await axios.post('/ft/sms/sendsms', phoneNumber);
      console.log('전화번호 전송');
      setIsCodeSent(true);
    } catch (error) {
      console.error('전화번호 전송 실패:', error);
    }
  };

  const checkVerificationCode = async () => {
    try {
      // 서버에 인증번호 요청
      const response = await axios.get('/ft/sms/sendVerifyCode');
      const responseData = response.data;
      const verifyCodeFromServer = responseData.verifyCode;

      console.log('인증번호 요청:', verifyCodeFromServer);

      // 서버에서 받은 인증 코드를 상태에 설정
      setVerificationCode(verifyCodeFromServer);

      if (parseInt(userInputCode) === verifyCodeFromServer) {
        setIsCodeVerified(true);
        console.log('인증번호 일치');

        // db에 접근해서 이메일 가져오기 
        const emailFromDB = await getEmailFromDB();
        setEmail(emailFromDB);

      } else {
        setIsCodeVerified(false);
        console.log('인증번호 불일치');
      }
    } catch (error) {
      console.error('인증번호 요청 실패:', error);
    }
  };

  // 전화번호와 이름으로 이메일 가져오는 함수
  const getEmailFromDB = async () => {

    // 전화번호 입력 시 '-' 추가
    const telValue = phoneNumber.replace(/[^0-9]/g, ''); // 숫자 이외의 문자 제거
    const tel = telValue.replace(/(\d{3})(\d{3,4})(\d{4})/, '$1-$2-$3');

    const userName = name;

    if (!tel || !userName) {
      alert("전화번호와 이름을 입력해주세요.");
      return null;
    }

    try {
      const db = getDatabase();
      const dbRef = ref(db, 'users');
      const snapshot = await get(dbRef);

      if (snapshot.exists()) {
        const users = snapshot.val();
        console.log("users---------", users);
        for (const key in users) {

          if (users[key].tel === tel && users[key].name === userName) {
            return users[key].email;
          }
        }
      } else {
        console.log("데이터가 없습니다.");
      }
    } catch (error) {
      console.error(error);
    }
    return null;
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={{ ...modalStyle }}>
        {!isCodeSent ? (
          <>
            <Typography variant="h6">인증 코드 보내기(mobile)</Typography>
            <TextField
              label="이름"
              value={name}
              onChange={(e) => setName(e.target.value)}
              fullWidth
              margin="normal"
            />
            <TextField
              label="휴대폰 번호"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              fullWidth
              margin="normal"
            />
            <CustomButton variant="contained" onClick={sendCodeToMobile}>
              휴대폰으로 인증 코드 보내기
            </CustomButton>
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
        {isCodeVerified && (
          <>
            <Typography variant="h6">이메일</Typography>
            <TextField
              label="이메일"
              value={email || "없음"}
              InputProps={{
                readOnly: true,
              }}
              fullWidth
            />
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

export default FindEmailModalPhone;
