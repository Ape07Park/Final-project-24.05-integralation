import React, { useState } from "react";
import { login, loginWithKakao, loginWithGoogle } from '../api/firebase';
import { useNavigate, Link } from "react-router-dom";
import { Button, CssBaseline, TextField, Grid, Box, Typography, Container, createTheme, ThemeProvider, Stack, Modal, Backdrop, Fade } from '@mui/material'; // Import Modal components
import FindPassModal from "../components/FindPassModal";

function SignIn() {
  const [userInfo, setUserInfo] = useState({ email: '', password: '' });
  const [openModal, setOpenModal] = useState(false); // State to control modal visibility
  const navigate = useNavigate();

  const handleChange = e => {
    setUserInfo({ ...userInfo, [e.target.name]: e.target.value });
  }

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      if (userInfo.email.trim() === '' || userInfo.password.trim() === '') {
        alert('이메일 혹은 패스워드를 모두 입력해주세요.');
      } else {
        const userData = await login(userInfo);
        console.log("일반 로그인 성공:", userData);

        const prevPage = localStorage.getItem('prevPage');
        if (prevPage && prevPage !== '/signUp') {
          navigate(-1);
        } else {
          navigate('/');
        }
      }
    } catch (error) {
      console.error('로그인 오류:', error);
    }
  }

  const handleGoogle = async () => {
    try {
      await loginWithGoogle();
      console.log("구글 로그인 성공");

      const prevPage = localStorage.getItem('prevPage');
      if (prevPage && prevPage !== '/signUp') {
        navigate(-1);
      } else {
        navigate('/');
      }
    } catch (error) {
      alert('구글 로그인에 실패했습니다.');
      console.error('구글 로그인 오류:', error);
    }
  }

  const handleKakao = async () => {
    try {
      await loginWithKakao();
      console.log("카카오 로그인 성공");

      const prevPage = localStorage.getItem('prevPage');
      if (prevPage && prevPage !== '/signUp') {
        navigate(-1);
      } else {
        navigate('/');
      }
    } catch (error) {
      alert('카카오 로그인에 실패했습니다.');
      console.error('카카오 로그인 오류:', error);
    }
  }

  const handleOpenFindPassModal = () => {
    setOpenModal(true);
  };

  const handleCloseFindPassModal = () => {
    setOpenModal(false);
  };

  return (
    <ThemeProvider theme={createTheme()}>
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

          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
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

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              로그인
            </Button>

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
                <Button variant="contained" color="primary" onClick={handleOpenFindPassModal}>
                  비번 찾기
                </Button>
              </Box>
            </Box>

            <Grid container justifyContent="center" spacing={2} sx={{ mt: 2 }}>
              <Grid item>
                <Stack direction="row" spacing={2}>
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

        {/* Modal for FindPassModal */}
        <Modal
          open={openModal}
          onClose={handleCloseFindPassModal}
          aria-labelledby="transition-modal-title"
          aria-describedby="transition-modal-description"
          closeAfterTransition
          BackdropComponent={Backdrop}
          BackdropProps={{
            timeout: 500,
          }}
        >
          <Fade in={openModal}>
            <Box
              sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: 400,
                bgcolor: 'background.paper',
                border: '2px solid #000',
                boxShadow: 24,
                p: 4,
              }}
            >
              <FindPassModal />
            </Box>
          </Fade>
        </Modal>

        <Box mt={8}>
          <Typography variant="body2" color="text.secondary" align="center">
            Copyright ©{' '}
            <Link color="inherit" href="#">
              FUNniture
            </Link>{' '}
            {new Date().getFullYear()}
            {'.'}
          </Typography>
        </Box>
      </Container>
    </ThemeProvider>
  );
}

export default SignIn;
