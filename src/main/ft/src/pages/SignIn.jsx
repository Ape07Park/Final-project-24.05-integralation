import React, { useState } from "react";
import { login, loginWithKakao, loginWithGoogle } from '../api/firebase';
import { useNavigate, Link } from "react-router-dom";
// mui
import { IconButton } from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Stack from '@mui/material/Stack';


function Copyright(props) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit" href="#">
        FUNniture
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const defaultTheme = createTheme();

export default function SignIn() {
  // 상태 변수 정의
  const [userInfo, setUserInfo] = useState({ email: '', password: '' });
  const navigate = useNavigate();

  // 이벤트 핸들러 - input 값 변화 처리
  const handleChange = e => {
    setUserInfo({ ...userInfo, [e.target.name]: e.target.value });
  }

  // 이벤트 핸들러 - 로그인 시도
  const handleSubmit = async e => {
    e.preventDefault();
    try {
      if (userInfo.email.trim() === '' || userInfo.password.trim() === '') {
        alert('이메일 혹은 패스워드를 모두 입력해주세요.');
      }
      else {
        // 로그인 시도
        const userData = await login(userInfo);
        console.log("일반 로그인 성공:", userData);
        navigate(-1);
      }
      // * 나중에 수정 필요
    } catch (error) {
      // 로그인 실패 시 오류 메시지 표시
      console.error('로그인 오류:', error);
    }
  }

  // 이벤트 핸들러 - 구글 로그인
  const handleGoogle = async () => {
    try {
      await loginWithGoogle();
      console.log("구글 로그인 성공");
      navigate(-1);
    } catch (error) {
      // 로그인 실패 시 오류 메시지 표시
      alert('구글 로그인에 실패했습니다.');
      console.error('구글 로그인 오류:', error);
    }
  }

  // 이벤트 핸들러 - 카카오 로그인
  const handleKakao = async () => {
    try {
      await loginWithKakao();
      console.log("카카오 로그인 성공");
      navigate(-1);
    } catch (error) {
      // 로그인 실패 시 오류 메시지 표시
      alert('카카오 로그인에 실패했습니다.');
      console.error('카카오 로그인 오류:', error);
    }
  }

  return (
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
            로그인
          </Typography>

          {/* 폼 요소 */}
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            {/* email 입력창 */}
            <TextField
              margin="normal"
              fullWidth
              id="email"
              label="이메일"
              name="email"
              autoComplete="email"
              autoFocus
              value={userInfo.email}
              onChange={handleChange}
              required
            />

            <TextField
              margin="normal"
              fullWidth
              name="password"
              label="비밀번호"
              type="password"
              id="password"
              autoComplete="current-password"
              value={userInfo.password}
              onChange={handleChange}
              required
            />

            {/* 로그인 버튼 */}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              onClick={handleSubmit}
            >
              로그인
            </Button>

            {/* 사용자 등록 링크 */}
            <Box sx={{ mt: 2 }}>
              <Typography variant="body2" color="text.secondary" align="center">
                아직 계정이 없으신가요?
              </Typography>
              <Box sx={{ textAlign: 'center' }}>
                <Link to='/signUp' style={{ textDecoration: 'none' }}>
                  <Button variant="contained" color="primary">
                    사용자 등록
                  </Button>
                </Link>
              </Box>
            </Box>

            {/* 소셜 로그인 버튼 */}
            <Grid container justifyContent="center" spacing={2}>
              <Grid item>
                <Stack direction="row">
                  <Button onClick={handleGoogle} aria-label="Google 로그인">
                    <img src="img/googlelogo.png" alt="Google Logo" style={{ width: 30 }} />
                  </Button>
                  <Button onClick={handleKakao}>
                    <img src="img/kakaologo.png" alt="Kakao Logo" style={{ width: 30 }} />
                  </Button>
                </Stack>
              </Grid>
            </Grid>

          </Box>
        </Box>
        <Copyright sx={{ mt: 8, mb: 4 }} />
      </Container>
    </ThemeProvider>
  )
}