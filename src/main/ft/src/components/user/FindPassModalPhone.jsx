import React, { useState } from "react";
import { Modal, Box, TextField, Button, Typography, Grid } from "@mui/material";
import {
  selectUserEmailPassword, login, auth, changePasswordFromDB,
  updatePassword, signInWithEmailAndPassword, logout
} from "../../api/firebase";
import axios from 'axios';
import CustomButton from "../publics/CustomButton";
import { child, get, getDatabase, ref } from "firebase/database";

const FindPassModalPhone = ({ open, onClose }) => {
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [userInputCode, setUserInputCode] = useState("");
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [isCodeVerified, setIsCodeVerified] = useState(null);
  const [newPassword, setNewPassword] = useState("");
  const [newPassword2, setNewPassword2] = useState("");

  const [isDuplicate, setIsDuplicate] = useState(null);
  const [isReadOnly, setIsReadOnly] = useState(false); // 읽기 전용 상태 추가


  // 서버에 인증번호 보내라고 요청 보내기
  const sendCodeToMobile = async () => {
    try {
      // 서버로 번호를 전송
      await axios.post('/ft/sms/sendsms', phoneNumber);
      setIsCodeSent(true);
    } catch (error) {
      console.log('전화번호 전송 실패:', error);
    }
  };

  const checkVerificationCode = async () => {
    try {
      // 서버에 인증번호 요청
      const response = await axios.get('/ft/sms/sendVerifyCode');

      // JSON 형식의 응답 데이터를 파싱하여 필요한 값 추출
      const responseData = response.data;
      const verifyCodeFromServer = responseData.verifyCode;

      // 서버에서 받은 인증 코드를 상태에 설정
      setVerificationCode(verifyCodeFromServer);

      if (parseInt(userInputCode) === verifyCodeFromServer) {
        setIsCodeVerified(true);

        // 로그인 시도
        loginUser();

      } else {
        setIsCodeVerified(false);
        console.log('인증번호 불일치');
      }
    } catch (error) {
      console.log('인증번호 요청 실패:', error);
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
        } else {
          console.log("사용자 로그인에 실패하였습니다.");
        }
      } else {
        console.log("사용자 정보를 가져오는 데 실패했습니다.");
      }
    } catch (error) {
      window.alert('이메일과 휴대폰 번호가 맞지않습니다.');
    }
  };

  const changePassword = async () => {
    try {
      if (newPassword === newPassword2) {
        // 현재 로그인한 사용자를 가져옴
        const currentUser = auth.currentUser;

        // auth 비밀번호 변경 요청
        await updatePassword(currentUser, newPassword);

        //  DB 비번 변경
        await changePasswordFromDB(email, newPassword);

        // 비밀번호 변경 후 사용자 로그아웃
        await logout();

        // 모달 닫기
        onClose();
      } else {
        window.alert("비밀번호가 다릅니다.")
      }
    } catch (error) {
      console.log("비밀번호 변경에 실패하였습니다.", error);
    }
  };

  // 이메일 중복 확인 함수
  const handleCheckEmail = async () => {
    if (!email) {
      alert("이메일을 입력해주세요.");
      return;
    }

    try {
      const db = getDatabase();
      const dbRef = ref(db);
      const snapshot = await get(child(dbRef, `users`));

      if (snapshot.exists()) {
        const users = snapshot.val();
        const emails = Object.values(users).map(user => user.email);

        // 이메일이 중복되는지 확인
        if (emails.includes(email)) {
          setIsDuplicate(true);
        } else {
          setIsDuplicate(false);
        }
      }
    } catch (error) {
      console.log(error);
      setIsDuplicate(false);
      setIsReadOnly(false); // 에러가 발생할 경우 읽기 전용으로 설정하지 않음
    }
  };


  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={{ ...modalStyle }}>
        {!isCodeSent ? (
          <>
            <Typography variant="h6">인증 코드 보내기(비밀번호 찾기)</Typography>
            <TextField
              label="이메일"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              fullWidth
              margin="normal"
            />

            <Grid item xs={12} style={{ textAlign: 'center' }}>
              <CustomButton
                fullWidth
                variant="contained"
                onClick={handleCheckEmail}
                sx={{ mt: 3, mb: 1 }}

              >
                이메일 중복 확인
              </CustomButton>
              {isDuplicate === true && <div style={{ color: 'green' }}>해당 이메일이 존재합니다.</div>}
              {isDuplicate === false && <div style={{ color: 'red' }}>해당 이메일이 존재하지 않습니다.</div>}
            </Grid>

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

export default FindPassModalPhone;
