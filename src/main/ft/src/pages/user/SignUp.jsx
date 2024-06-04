import React, { useState } from "react";
import { authRegister, loginWithGoogle, loginWithKakao } from '../../api/firebase';
import { Link, useNavigate } from "react-router-dom";
import { useDaumPostcodePopup } from 'react-daum-postcode';
import { getDatabase, ref, child, get } from "firebase/database";

// mui 
import CustomButton from "../../components/publics/CustomButton";
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Divider, Stack } from "@mui/material";

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
    email: '', password: '', confirmPassword: '', name: '', postCode: '', addr: '',
    detailAddr: '', tel: '', req: ''
  });
  const [isDuplicate, setIsDuplicate] = useState(null);
  const [isReadOnly, setIsReadOnly] = useState(false); // 읽기 전용 상태 추가

  localStorage.setItem('prevPage', '/signUp');
  const navigate = useNavigate();

  const [isHoveredGoogle, setIsHoveredGoogle] = useState(false);
  const [isHoveredKakao, setIsHoveredKakao] = useState(false);
  
  const handleGoogle = async () => {
    try {
      await loginWithGoogle();
      navigate('/UserInfo');
      setTimeout(() => {
        alert("업데이트 페이지에서 사용자 정보를 업데이트 해주세요");
      }, 700); // setTimeout을 사용하여 다음 이벤트 큐에 넣어 순서를 조정합니다.
    } catch (error) {
      console.log("구글 로그인 오류:", error);
      alert("구글 로그인에 오류가 발생했습니다.");
      navigate(-1); // 또는 다른 경로로 리다이렉트
    }
  }

  const handleKakao = async () => {
    try {
      await loginWithKakao();
      // 'UserInfo' 페이지로 이동 후, 일정 시간 뒤에 알림을 띄우고 'UserUpdate' 페이지로 이동
      navigate('/UserInfo');
      setTimeout(() => {
        alert("업데이트 페이지에서 사용자 정보를 업데이트 해주세요");
      }, 700);
    } catch (error) {
      console.log("카카오 로그인 오류:", error);
      alert("카카오 로그인에 오류가 발생했습니다.");
      navigate(-1); // 또는 다른 경로로 리다이렉트
    }
  }

  // 사용자 정보 변경 핸들러
  const handleChange = e => {
    const { name, value } = e.target;

    if (name === "req" && value.trim() === '') {
      setUserInfo({ ...userInfo, [name]: '조심히 와주세요' });
    } else if (name === "tel") {
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

  // 이메일 중복 확인 함수
  const handleCheckEmail = async () => {
    const email = userInfo.email;
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
          setIsReadOnly(false); // 중복되면 읽기 전용으로 설정하지 않음
        } else {
          setIsDuplicate(false);
          setIsReadOnly(true); // 중복되지 않으면 읽기 전용으로 설정
        }
      } else {
        console.log("데이터가 없습니다.");
        setIsDuplicate(false);
        setIsReadOnly(true); // 데이터가 없을 경우 읽기 전용으로 설정
      }
    } catch (error) {
      console.log(error);
      setIsDuplicate(false);
      setIsReadOnly(false); // 에러가 발생할 경우 읽기 전용으로 설정하지 않음
    }
  };

  // 폼 제출 핸들러
  const handleSubmit = e => {
    e.preventDefault(); // 기본 제출 동작 방지

    // 필수 정보가 입력되었는지 확인
    if (!userInfo.email || !userInfo.password || !userInfo.confirmPassword || !userInfo.name ||
      !userInfo.addr || !userInfo.addr || !userInfo.detailAddr || !userInfo.tel || !userInfo.req) {
      alert("모든 필수 정보를 입력해주세요.");
      return;
    }

    if (userInfo.password !== userInfo.confirmPassword) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }

    alert("회원가입 완료")
    authRegister(userInfo); // 사용자 등록 함수 호출
    navigate('/signIn');
  }

  // Daum 우편번호 팝업 열기 함수
  const openPostcode = useDaumPostcodePopup("//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js");

  // Daum 우편번호 팝업에서 주소 선택 시 호출되는 완료 핸들러
  const handleComplete = data => {
    let fullAddress = data.address; // 선택된 주소
    let extraAddress = '';
    let postCode = data.zonecode; // 우편번호

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
      addr: fullAddress, // 선택된 주소를 사용자 정보에 업데이트
      postCode: postCode // 우편번호를 사용자 정보에 업데이트
    });
  };

  const hoverGoogle = () => {
    setIsHoveredGoogle(!isHoveredGoogle);
  };

  const hoverKakao = () => {
    setIsHoveredKakao(!isHoveredKakao);
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
              회원가입
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
                    label="이메일"
                    autoFocus
                    value={userInfo.email}
                    onChange={handleChange}
                    required
                    InputProps={{
                      readOnly: isReadOnly, // 읽기 전용 상태 반영
                    }}
                  />
                </Grid>

                <Grid item xs={12} style={{ textAlign: 'center' }}>
                  <CustomButton
                    fullWidth
                    variant="contained"
                    onClick={handleCheckEmail}
                    sx={{ mt: 3, mb: 1 }}

                  >
                    이메일 중복 확인
                  </CustomButton>
                  {isDuplicate === true && <div style={{ color: 'red' }}>이 이메일은 이미 사용 중입니다.</div>}
                  {isDuplicate === false && isReadOnly && <div style={{ color: 'green' }}>이 이메일은 사용 가능합니다.</div>}
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    name="password"
                    label="비밀번호"
                    placeholder="6자리 이상"
                    type="password"
                    id="password"
                    autoComplete="new-password"
                    value={userInfo.password}
                    onChange={handleChange}
                    required
                  />
                </Grid>

                {/* 비밀번호 확인 */}
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    name="confirmPassword"
                    label="비밀번호 확인"
                    placeholder="6자리 이상"
                    type="password"
                    id="confirmPassword"
                    autoComplete="confirmPassword"
                    value={userInfo.confirmPassword}
                    onChange={handleChange}
                    required
                  />
                </Grid>

                {/* 이름 */}
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    id="name"
                    label="이름"
                    name="name"
                    autoComplete="name"
                    value={userInfo.name}
                    onChange={handleChange}
                    required
                  />
                </Grid>

                {/*우편번호찾기*/}
                <Grid item xs={12}>
                  <CustomButton
                    type="button"
                    fullWidth
                    variant="contained"
                    sx={{ mt: 3, mb: 1 }}
                    onClick={() => openPostcode({ onComplete: handleComplete })}
                  >
                    우편번호 찾기
                  </CustomButton>
                </Grid>

                {/*우편번호*/}
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    id="postCode"
                    label="우편번호"
                    name="postCode"
                    autoComplete="sample6_postcode"
                    value={userInfo.postCode}
                    readOnly
                    required
                  />
                </Grid>

                {/*우편번호*/}
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    id="addr"
                    label="주소"
                    name="addr"
                    autoComplete="sample6_postcode"
                    value={userInfo.addr}
                    readOnly
                    required
                  />
                </Grid>

                {/*상세주소*/}
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    name='detailAddr'
                    label="상세주소"
                    type="text"
                    id="sample6_detailAddress"
                    autoComplete="sample6_deailAddress"
                    value={userInfo.detailAddr}
                    onChange={handleChange}
                    required
                  />
                </Grid>

                {/*전화번호*/}
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    name="tel"
                    label="전화번호"
                    type="tel"
                    id="tel"
                    maxLength="13"
                    value={userInfo.tel}
                    onChange={handleChange}
                    required
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
              </Grid>
            </Box>

            {/* 사용자 등록 버튼 */}
            <CustomButton fullWidth variant="contained" sx={{ mt: 3, mb: 2 }} onClick={handleSubmit}>
              사용자 등록
            </CustomButton>

            <Divider sx={{ my: 2 }} />

            {/* 이미 계정이 있으신가요? */}
            <Grid container justifyContent="center" spacing={2}>
              <Grid item>
                <Link to="/SignIn" variant="body2" style={{ marginRight: '10px' }}>
                  계정이 있으신가요? 로그인
                </Link>
              </Grid>
            </Grid>

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
          <Copyright sx={{ mt: 5 }} />
        </Container>
      </ThemeProvider>
    </>
  )
};
