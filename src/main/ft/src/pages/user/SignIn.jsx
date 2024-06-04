import React, { useState } from "react";
import { login, loginWithKakao, loginWithGoogle } from '../../api/firebase.js';
import { useNavigate, Link } from "react-router-dom";
import { CssBaseline, TextField, Grid, Box, Typography, Container, createTheme, ThemeProvider, Stack, Modal, Backdrop, Fade, Divider } from '@mui/material';

import FindPassModal from "../../components/user/ChangePassModal.jsx";
import FindPassModalPhone from "../../components/user/FindPassModalPhone.jsx";
import CustomButton from "../../components/publics/CustomButton.jsx";
import FindEmailModalPhone from "../../components/user/FindEmailModalPhone.jsx";
import FindPassModalSpring from "../../components/user/FindPassModalSpring.jsx";

function SignIn() {
  const [userInfo, setUserInfo] = useState({ email: '', password: '' });
  const [modalType, setModalType] = useState(null);
  const navigate = useNavigate();
  const [isHoveredGoogle, setIsHoveredGoogle] = useState(false);
  const [isHoveredKakao, setIsHoveredKakao] = useState(false);
  const handleChange = e => {
    setUserInfo({ ...userInfo, [e.target.name]: e.target.value });
  }

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      if (userInfo.email.trim() === '' || userInfo.password.trim() === '') {
        alert('이메일 혹은 패스워드를 모두 입력해주세요.');
      } else {
        await login(userInfo);

        const prevPage = localStorage.getItem('prevPage');
        if (prevPage && prevPage !== '/signUp') {
          navigate(-1);
        } else {
          navigate('/');
          localStorage.setItem('prevPage', '/signIn');
        }
      }
    } catch (error) {
      console.log('로그인 오류:', error);
    }
  }

  const handleGoogle = async () => {
    try {
      await loginWithGoogle();

      const prevPage = localStorage.getItem('prevPage');
      if (prevPage && prevPage !== '/signUp') {
        navigate(-1);
      } else {
        navigate('/');
        localStorage.setItem('prevPage', '/signIn');
      }
    } catch (error) {
      alert('구글 로그인에 실패했습니다.');
      console.log('구글 로그인 오류:', error);
    }
  }

  const handleKakao = async () => {
    try {
      await loginWithKakao();

      const prevPage = localStorage.getItem('prevPage');
      if (prevPage && prevPage !== '/signUp') {
        navigate(-1);
      } else {
        navigate('/');
        localStorage.setItem('prevPage', '/signIn');
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
    setModalType('findPassToUsedFirebase');
  };

  const handleOpenFindPassPhone = () => {
    setModalType('mobile');
  };

  const handleOpenFindEmailPhone = () => {
    setModalType('findEmail');
  };

  const handleCloseFindPassModal = () => {
    setModalType(null);
  };

  const hoverGoogle = () => {
    setIsHoveredGoogle(!isHoveredGoogle);
  };

  const hoverKakao = () => {
    setIsHoveredKakao(!isHoveredKakao);
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
                <Link to='/signUp' style={{ textDecoration: 'none', marginLeft: 3 }}>
                  사용자 등록
                </Link>
              </Typography>
              <Box sx={{ textAlign: 'center', mb: 2 }}>
                <Divider sx={{ my: 2 }} />
                <Typography>
                  <Link onClick={handleOpenFindEmailPhone} style={{textDecoration: 'none'}}>
                    아이디 찾기
                  </Link>
                </Typography>
                <Typography>
                  비밀번호 찾기
                  <Link onClick={handleOpenFindPassModalFirebase} style={{marginLeft: 3, textDecoration: 'none'}}>
                    이메일
                  </Link>
                  <Link onClick={handleOpenFindPassPhone} style={{marginLeft: 5, textDecoration: 'none'}}>
                    휴대폰
                  </Link>
                </Typography>
                <Typography>
                  관리자 아이디: admin@gmail.com
                </Typography>
                <Typography>
                  관리자 패스워드: 123456
                </Typography>
              </Box>
            </Box>

            <Grid container justifyContent="center" spacing={2} sx={{ mt: 2 }}>
              <Grid item>
                <Stack direction="row" spacing={2}>

                  <img
                    src="img/googlelogo.png"
                    alt="Google Logo"
                    style={{
                      width: 40,
                      height: 40,
                      cursor: 'pointer',
                      ...(isHoveredGoogle && { transform: 'scale(1.1)', transition: 'transform 0.3s' }),
                    }}
                    onClick={() => {
                      handleGoogle();
                      hoverGoogle();
                    }}
                  />
                  <img
                    src="img/kakaologo.png"
                    alt="Kakao Logo"
                    style={{
                      width: 40,
                      height: 40,
                      cursor: 'pointer',
                      ...(isHoveredKakao && { transform: 'scale(1.1)', transition: 'transform 0.3s' }),
                    }}
                    onClick={() => {
                      handleKakao();
                      hoverKakao();
                    }}
                  />

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
              {modalType === 'findEmail' && <FindEmailModalPhone open={modalType === 'findEmail'} onClose={handleCloseFindPassModal} />}
              {modalType === 'findPassToUsedFirebase' && <FindPassModal handleClose={handleCloseFindPassModal} />}
              {modalType === 'spring' && <FindPassModalSpring open={modalType === 'spring'} onClose={handleCloseFindPassModal} />}
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
