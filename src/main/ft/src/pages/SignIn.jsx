import React, { useState } from "react";
import { login, loginWithKakao, loginWithGoogle } from '../api/firebase';
import { useNavigate, Link } from "react-router-dom";
import { Button, CssBaseline, TextField, Grid, Box, Typography, Container, createTheme, ThemeProvider, Stack, Modal, Backdrop, Fade, Divider } from '@mui/material';
import FindPassModalSpring from "../components/user/FindPassModalSpring";
import FindPassModal from "../components/user/FindPassModal";
import FindPassModalPhone from "../components/user/FindPassModalPhone";

function SignIn() {
  const [userInfo, setUserInfo] = useState({ email: '', password: '' });
  const [modalType, setModalType] = useState(null);
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

  const handleOpenFindPassModalSpring = () => {
    setModalType('spring');
  };

  const handleOpenFindPassModalFirebase = () => {
    setModalType('firebase');
  };

  const handleOpenFindPassPhone= () => {
    setModalType('mobile');
  };

  const handleCloseFindPassModal = () => {
    setModalType(null);
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
            <Box sx={{ mt: 4, p: 2, border: '1px solid #e0e0e0', borderRadius: 2, boxShadow: 2 }}>
              <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 2 }}>
                아직 계정이 없으신가요?
                <Link to='/signUp' style={{ textDecoration: 'none', marginLeft: 3 }}>
                  사용자 등록
                </Link>
              </Typography>
              <Box sx={{ textAlign: 'center', mb: 2 }}>
                <Divider sx={{ my: 2 }} />
                
                <Typography>
                  비밀번호 찾기
                  <Link onClick={handleOpenFindPassModalFirebase} style={{marginLeft: 3}}>
                    이메일
                  </Link>
                  <Link onClick={handleOpenFindPassPhone} style={{marginLeft: 5}}>
                    휴대폰
                  </Link>

                </Typography>
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

        
        <Modal
          open={modalType !== null}
          onClose={handleCloseFindPassModal}
          aria-labelledby="transition-modal-title"
          aria-describedby="transition-modal-description"
          closeAfterTransition
          BackdropComponent={Backdrop}
          BackdropProps={{
            timeout: 500,
          }}
        >
          <Fade in={modalType !== null}>
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
              {modalType === 'spring' && <FindPassModalSpring handleClose={handleCloseFindPassModal} />}
              {modalType === 'firebase' && <FindPassModal handleClose={handleCloseFindPassModal} />}
              {modalType === 'mobile' && <FindPassModalPhone open={modalType === 'mobile'} onClose={handleCloseFindPassModal} />}
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
