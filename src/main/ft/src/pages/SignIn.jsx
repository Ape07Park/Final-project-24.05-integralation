import React, { useState } from "react";
import { login, loginWithKakao, loginWithGoogle } from '../api/firebase';
import { useNavigate, Link } from "react-router-dom";
import { CssBaseline, TextField, Grid, Box, Typography, Container, createTheme, ThemeProvider, Stack, Modal, Backdrop, Fade, Divider } from '@mui/material';
import FindPassModalSpring from "../components/FindPassModalSpring";
import FindPassModal from "../components/FindPassModal";
import FindPassModalPhone from "../components/FindPassModalPhone";
import CustomButton from "./CustomButton.jsx";
import FindEmailModalPhone from "../components/FindEmailModalPhone.jsx";

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

  const handleOpenFindEmailPhone= () => {
    setModalType('email');
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

            <CustomButton
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              로그인
            </CustomButton>

            <Box sx={{ mt: 4, p: 2, border: '1px solid #e0e0e0', borderRadius: 2, boxShadow: 2 }}>
              <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 2 }}>
                아직 계정이 없으신가요?
              </Typography>
              <Box sx={{ textAlign: 'center', mb: 2 }}>
                <Link to='/signUp' style={{ textDecoration: 'none' }}>
                  <CustomButton variant="contained" color="primary" sx={{ mb: 1 }}>
                    사용자 등록
                  </CustomButton>
                </Link>
                <Divider sx={{ my: 2 }} />
                <CustomButton variant="contained" color="primary" onClick={handleOpenFindPassModalSpring} sx={{ mb: 1 }}>
                  스프링으로 비번 찾기(이메일)
                </CustomButton>
                <CustomButton variant="contained" color="primary" onClick={handleOpenFindPassModalFirebase}>
                  파이어베이스로 비번 변경(이메일)
                </CustomButton>
                <CustomButton variant="contained" color="primary" onClick={handleOpenFindPassPhone}>
                  휴대폰으로 비번 찾기
                </CustomButton>
                <CustomButton variant="contained" color="primary" onClick={handleOpenFindEmailPhone}>
                  휴대폰으로 아이디 찾기 찾기
                </CustomButton>
              </Box>
            </Box>

            <Grid container justifyContent="center" spacing={2} sx={{ mt: 2 }}>
              <Grid item>
                <Stack direction="row" spacing={2}>
                  <CustomButton onClick={handleGoogle} aria-label="Google 로그인">
                    <img src="img/googlelogo.png" alt="Google Logo" style={{ width: 30 }} />
                  </CustomButton>
                  <CustomButton onClick={handleKakao}>
                    <img src="img/kakaologo.png" alt="Kakao Logo" style={{ width: 30 }} />
                  </CustomButton>
                </Stack>
              </Grid>
            </Grid>
          </Box>
        </Box>

        {/* Modal for FindPassModal */}
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
              {modalType === 'email' && <FindEmailModalPhone open={modalType === 'email'} onClose={handleCloseFindPassModal} />}
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
