import React, { useState } from "react";
import { authRegister, loginWithGoogle, loginWithKakao } from '../api/firebase';
import { Link, useNavigate } from "react-router-dom";
import { useDaumPostcodePopup } from 'react-daum-postcode';

// mui 
import { IconButton } from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';

import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import { createTheme, ThemeProvider } from '@mui/material/styles';

// 디자인
function Copyright(props) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit" href="https://mui.com/">
        Your Website
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const defaultTheme = createTheme();

// 기능
export default function SignUp() {
  const [userInfo, setUserInfo] = useState({
    email: '', password: '', confirmPassword: '', name: '', addr: '',
    detailAddr: '', tel: '', req: '', def: '', isAdmin: 0 // isAdmin 초기값 추가
  });

  const navigate = useNavigate();

  // 사용자 정보 변경 핸들러
  const handleChange = e => {
    const { name, value } = e.target;

    if (name === "req" && value.trim() === '') {
      setUserInfo({ ...userInfo, [name]: '조심히 와주세요' });
    }
    else if (name === "tel") {
      // 전화번호 입력 시 '-' 추가
      const telValue = value.replace(/[^0-9]/g, ''); // 숫자 이외의 문자 제거
      const formattedTel = telValue.replace(/(\d{3})(\d{3,4})(\d{4})/, '$1-$2-$3');
      if (formattedTel.length <= 13) {
        setUserInfo({ ...userInfo, [name]: formattedTel });
      }
    } else {
      setUserInfo({ ...userInfo, [name]: value });
    }
  }

  // 이메일 중복 확인 핸들러
  const handleEmailBlur = () => {
    // 여기서는 간단히 이메일이 비어있지 않으면 중복된 것으로 가정합니다.
    if (userInfo.email !== '') {
      setUserInfo({ ...userInfo, emailExists: true });
    }
  }

  // 폼 제출 핸들러
  const handleSubmit = e => {
    e.preventDefault(); // 기본 제출 동작 방지

    // 필수 정보가 입력되었는지 확인
    if (!userInfo.email || !userInfo.password || !userInfo.confirmPassword || !userInfo.name || !userInfo.addr || !userInfo.detailAddr || !userInfo.tel || !userInfo.req || !userInfo.def) {
      alert("모든 필수 정보를 입력해주세요.");
      return;
    }

    if (userInfo.password !== userInfo.confirmPassword) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }

    authRegister(userInfo); // 사용자 등록 함수 호출
    console.log("회원가입 정보:", userInfo); // 회원가입 정보 출력
    navigate('/signIn');
  }

  // 구글 로그인 핸들러
  const handleGoogle = async () => {
    try {
      const userInfo = await loginWithGoogle();
      console.log("구글로 로그인한 사용자 정보:", userInfo);
      navigate('/UserInfo');
      setTimeout(() => {
        alert("업데이트 페이지에서 사용자 정보를 업데이트 해주세요");
      }, 700); // setTimeout을 사용하여 다음 이벤트 큐에 넣어 순서를 조정합니다.
    } catch (error) {
      console.error("구글 로그인 오류:", error);
      alert("구글 로그인에 오류가 발생했습니다.");
      navigate(-1); // 또는 다른 경로로 리다이렉트
    }
  }

  // 카카오 로그인 핸들러
  const handleKakao = async () => {
    try {
      const userInfo = await loginWithKakao();
      console.log("카카오로 로그인한 사용자 정보:", userInfo);
      // 'UserInfo' 페이지로 이동 후, 일정 시간 뒤에 알림을 띄우고 'UserUpdate' 페이지로 이동
      navigate('/UserInfo');
      setTimeout(() => {
        alert("업데이트 페이지에서 사용자 정보를 업데이트 해주세요");
      }, 700);
    } catch (error) {
      console.error("카카오 로그인 오류:", error);
      alert("카카오 로그인에 오류가 발생했습니다.");
      navigate(-1); // 또는 다른 경로로 리다이렉트
    }
  }

  // Daum 우편번호 팝업 열기 함수
  const openPostcode = useDaumPostcodePopup("//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js");

  // Daum 우편번호 팝업에서 주소 선택 시 호출되는 완료 핸들러
  const handleComplete = data => {
    let fullAddress = data.address; // 선택된 주소
    let extraAddress = '';

    if (data.addressType === 'R') {
      if (data.bname !== '') {
        extraAddress += data.bname;
      }
      if (data.buildingName !== '') {
        extraAddress += extraAddress !== '' ? `, ${data.buildingName}` : data.buildingName;
      }
      fullAddress += extraAddress !== '' ? ` (${extraAddress})` : '';
    }

    setUserInfo({
      ...userInfo,
      addr: fullAddress // 선택된 주소를 사용자 정보에 업데이트
    });
  };

  return (
    <>
      <ThemeProvider theme={defaultTheme}>
        <Container component="main" maxWidth="xs">
          <CssBaseline />
          <Box
            sx={{
              marginTop: 8,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >

            <Typography component="h1" variant="h5">
              회원가입 - * 표시 입력 필수
            </Typography>

            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
              <Grid container spacing={2}>

                <Grid item xs={12}>
                  {/* 이메일 */}
                  <TextField
                    autoComplete="given-name"
                    name="email"
                    fullWidth
                    id="email"
                    label="이메일 *"
                    autoFocus
                    value={userInfo.email}
                    onChange={handleChange}
                    onBlur={handleEmailBlur}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    name="password"
                    label="비밀번호 *"
                    type="password"
                    id="password"
                    autoComplete="new-password"
                    value={userInfo.password}
                    onChange={handleChange}
                  />
                </Grid>

                {/* 비밀번호 확인 */}
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    name="confirmPassword"
                    label="비밀번호 확인 *"
                    type="password"
                    id="confirmPassword"
                    autoComplete="confirmPassword"
                    value={userInfo.confirmPassword}
                    onChange={handleChange}
                  />
                </Grid>

                {/* 이름 */}
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    id="name"
                    label="이름 *"
                    name="name"
                    autoComplete="name"
                    value={userInfo.name}
                    onChange={handleChange}
                  />
                </Grid>

                {/*우편번호찾기*/}
                <Grid item xs={12}>
                  <Button
                    type="button"
                    fullWidth
                    variant="contained"
                    sx={{ mt: 3, mb: 1 }}
                    onClick={() => openPostcode({ onComplete: handleComplete })}
                  >
                    우편번호 찾기
                  </Button>
                </Grid>

                {/*우편번호*/}
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    id="addr"
                    label="우편번호 *"
                    name="addr"
                    autoComplete="sample6_postcode"
                    value={userInfo.addr}
                    readOnly
                  />
                </Grid>

                {/*상세주소*/}
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    name='detailAddr'
                    label="상세주소 *"
                    type="text"
                    id="sample6_detailAddress"
                    autoComplete="sample6_deailAddress"
                    value={userInfo.detailAddr}
                    onChange={handleChange}
                  />
                </Grid>

                {/*전화번호*/}
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    name="tel"
                    label="전화번호 *"
                    type="tel"
                    id="tel"
                    maxLength="13"
                    value={userInfo.tel}
                    onChange={handleChange}
                  />
                </Grid>

                {/*배송시 요청사항*/}
                <Grid item xs={12} style={{ display: 'none' }}>
                  <TextField
                    fullWidth
                    name="req"
                    label="배송시 요청사항"
                    id="req"
                    maxLength="13"
                    value={userInfo.req = "조심히 와주세요"}
                    hidden
                    onChange={handleChange}
                  />
                </Grid>

                {/* 기본 배송 여부 선택 */}
                <Grid item xs={12}>
                  <RadioGroup
                    row
                    name='def'
                    value={userInfo.def}
                    onChange={handleChange}
                  >
                    <FormControlLabel
                      value="Y"
                      control={<Radio />}
                      label="예"
                      checked={userInfo.def === "Y"}
                    />
                    <FormControlLabel
                      value="N"
                      control={<Radio />}
                      label="아니요"
                      checked={userInfo.def === "N"}
                    />
                  </RadioGroup>
                </Grid>
              </Grid>
            </Box>

            {/* 사용자 등록 버튼 */}
            <Button fullWidth variant="contained" sx={{ mt: 3, mb: 2 }} onClick={handleSubmit}>
              사용자 등록
            </Button>

            {/* 이미 계정이 있으신가요? */}
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link to="/SignIn" variant="body2" style={{ marginRight: '10px' }}>
                  계정이 있으신가요? 로그인
                </Link>
                <Button onClick={handleGoogle} startIcon={<img src="img/googlelogo.png" alt="구글 로고" style={{ width: '36px', marginRight: '8px' }} />}>
                  
                </Button>
                <Button onClick={handleKakao} startIcon={<img src="img/kakaologo.png" alt="카카오 로고" style={{ width: '36px', marginRight: '8px' }} />}>
                  
                </Button>
                {/* <Button onClick={handleNaver} startIcon={<img src="img/naver-logo.jpg" alt="네이버 로고" style={{ width: '36px', marginRight: '8px' }} />}>
                  네이버 로그인
                </Button> */}
              </Grid>
            </Grid>
          </Box>
          <Copyright sx={{ mt: 5 }} />
        </Container>
      </ThemeProvider >
    </>
  )
};