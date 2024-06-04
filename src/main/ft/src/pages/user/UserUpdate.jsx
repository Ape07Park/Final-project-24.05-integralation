import React, { useState, useEffect } from 'react';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { updateUserData } from '../../api/firebase'; // updateUserData 함수 import
import { useLocation, useNavigate, Link } from 'react-router-dom'; // useHistory 대신 useNavigate 사용
import { useDaumPostcodePopup } from 'react-daum-postcode';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import CustomButton from '../../components/publics/CustomButton';

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

export default function UserUpdate() {
  // 사용자 정보 관련 상태 설정
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [postCode, setPostCode] = useState('');
  const [addr, setAddr] = useState('');
  const [detailAddr, setDetailAddr] = useState('');
  const [tel, setTel] = useState('');
  const [req, setReq] = useState('');
  const [messageType, setMessageType] = useState('');
  // 현재 페이지의 URL 정보를 가져오기 위해 useLocation 훅 사용
  const location = useLocation();
  // 페이지 이동을 위한 함수 가져오기
  const navigate = useNavigate();
  // 이전 페이지에서 전달된 userInfo 가져오기
  const { userInfo } = location.state || {};

  // 컴포넌트가 로드될 때, 이전 페이지에서 받은 userInfo로 각 상태 초기화,
  // 비밀번호는 무조건 변경하도록 함
  // 왜냐하면 유저 정보 업데이트는 유저가 진짜 그 유저가 맞는지 확인 후에 하기 때문에
  useEffect(() => {
    if (userInfo) {
      const { email, name, postCode, addr, detailAddr, tel, req } = userInfo;
      setEmail(email || '');
      setName(name || '');
      setPostCode(postCode || '');
      setAddr(addr || '');
      setDetailAddr(detailAddr || '');
      setTel(tel || '');
      setReq(req || '');
    }
  }, [userInfo]);

  // Daum 우편번호 팝업 관련 함수
  const openPostcode = useDaumPostcodePopup("//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js");

  // Daum 우편번호 팝업에서 주소 선택 시 호출되는 함수
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
    // 주소 설정
    setAddr(fullAddress);
    setPostCode(postCode);
  }

  // 사용자 정보 업데이트 함수
  const handleUpdate = async () => {
    // 필수 정보가 모두 입력되었는지 확인
    if (!email || !password || !confirmPassword || !name
      || !postCode || !addr || !detailAddr || !tel) {
      alert('모든 필수 정보를 입력해주세요.');
      return;
    }

    // 비밀번호와 비밀번호 확인 값이 일치하는지 확인
    if (password !== confirmPassword) {
      alert('비밀번호가 일치하지 않습니다.');
      return;
    }

    // 업데이트할 사용자 정보 객체 생성
    const updatedUserInfo = {
      email: email,
      password: password,
      name: name,
      postCode: postCode,
      addr: addr,
      detailAddr: detailAddr,
      tel: tel,
      req: req
    };

    try {
      // 사용자 정보 업데이트 요청
      await updateUserData(updatedUserInfo);
      // 업데이트 후, 이전 페이지로 이동
      navigate(-1);
    } catch (error) {
      console.log('사용자 정보 업데이트 중 오류:', error);
    }
  };

  // 취소 버튼 클릭 시 이전 페이지로 이동
  const handleCancel = () => {
    navigate(-1);
  };

  const handleTelChange = (e) => {
    const { value } = e.target;

    // 숫자 이외의 문자 제거
    const telValue = value.replace(/[^0-9]/g, '');

    // 하이픈(-) 추가
    let formattedTel = '';
    if (telValue.length <= 3) {
      formattedTel = telValue;
    } else if (telValue.length <= 7) {
      formattedTel = telValue.slice(0, 3) + '-' + telValue.slice(3);
    } else if (telValue.length <= 11) {
      formattedTel = telValue.slice(0, 3) + '-' + telValue.slice(3, 7) + '-' + telValue.slice(7);
    } else {
      formattedTel = telValue.slice(0, 3) + '-' + telValue.slice(3, 7) + '-' + telValue.slice(7, 11);
    }

    // 최대 길이 제한을 넘지 않도록 자르기
    const maxLength = 13; // 최대 길이는 13자리 (010-1234-5678)
    const updatedTel = formattedTel.slice(0, maxLength);

    // 상태 업데이트
    setTel(updatedTel);
  };

  return (
    <>
      <ThemeProvider theme={defaultTheme}>
        <Container component="main" maxWidth="xs">
          <Box
            sx={{
              marginTop: 8,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Typography variant="h5" gutterBottom>
              회원정보수정
            </Typography>

            <Box component="form" onSubmit={handleUpdate} sx={{ mt: 3 }}>
              <Grid container spacing={2}>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Email"
                    value={email}
                    InputProps={{
                      readOnly: true, // readOnly 속성을 true로 설정하여 수정 불가능하게 함
                    }}
                    required
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="비밀번호"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)} // 비밀번호 입력 시 상태 업데이트
                    required
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="비밀번호 확인"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)} // 비밀번호 확인 입력 시 상태 업데이트
                    required
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="이름"
                    value={name}
                    onChange={(e) => setName(e.target.value)} // 이름 입력 시 상태 업데이트
                    required
                  />
                </Grid>

                <Grid item xs={12}>
                  <CustomButton
                    fullWidth
                    type="button"
                    variant="contained"
                    sx={{ mt: 1, mb: 1 }}
                    onClick={() => openPostcode({ onComplete: handleComplete })}
                  >
                    주소 찾기
                  </CustomButton>
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="우편번호"
                    value={postCode}
                    onChange={(e) => setPostCode(e.target.value)} // 우편번호 입력 시 상태 업데이트
                    required
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="주소명"
                    value={addr}
                    onChange={(e) => setAddr(e.target.value)} // 주소 입력 시 상태 업데이트
                    required
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="상세주소"
                    value={detailAddr}
                    onChange={(e) => setDetailAddr(e.target.value)} // 상세 주소 입력 시 상태 업데이트
                    required
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="휴대폰"
                    value={tel}
                    onChange={handleTelChange} // 전화번호 입력 시 상태 업데이트
                    required
                  />
                </Grid>

                <Grid item xs={12}>
                  <FormControl fullWidth style={{ marginBottom: '5px' }}>
                    <InputLabel id="message-label">-- 선택하세요 --</InputLabel>
                    <Select
                      labelId="message-label"
                      id="message"
                      value={messageType}
                      onChange={(e) => {
                        const selectedMessageType = e.target.value;
                        setMessageType(selectedMessageType);
                        // 선택한 메시지 유형이 '직접 입력'이 아니면 req를 선택한 메시지로 설정
                        if (selectedMessageType !== '직접 입력') {
                          setReq(selectedMessageType);
                        }
                      }}
                      label="-- 선택하세요 --"
                    >
                      <MenuItem value="">-- 선택하세요 --</MenuItem>
                      <MenuItem value="배송 전 연락바랍니다.">배송 전 연락바랍니다.</MenuItem>
                      <MenuItem value="경비실에 맡겨주세요.">경비실에 맡겨주세요.</MenuItem>
                      <MenuItem value="집앞에 놔주세요.">집앞에 놔주세요.</MenuItem>
                      <MenuItem value="택배함에 놔주세요.">택배함에 놔주세요.</MenuItem>
                      <MenuItem value="부재시 핸드폰으로 연락주세요.">부재시 핸드폰으로 연락주세요.</MenuItem>
                      <MenuItem value="부재시 경비실에 맡겨주세요.">부재시 경비실에 맡겨주세요.</MenuItem>
                      <MenuItem value="부재시 집 앞에 놔주세요.">부재시 집 앞에 놔주세요.</MenuItem>
                      <MenuItem value="직접 입력">직접 입력</MenuItem>
                    </Select>
                  </FormControl>
                  {/* 직접 입력이 선택됐을 때만 TextField 표시 */}
                  {messageType === '직접 입력' && (
                    <TextField
                      fullWidth
                      label="Delivery Request"
                      value={req} // 선택한 값이 req로 전달되도록 수정
                      onChange={(e) => setReq(e.target.value)} // 배송 요청 입력 시 상태 업데이트
                    />
                  )}
                </Grid>
              </Grid>
              {/* 사용자 정보 업데이트 버튼 */}
              <CustomButton
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 1 }} // 간격 조정
                onClick={handleUpdate}
              >
                수정
              </CustomButton>

              {/* 취소 버튼 */}
              <Button
                fullWidth
                variant="contained"
                color='error'
                sx={{ mt: 3, mb: 2 }} // 간격 조정
                onClick={handleCancel}
              >
                취소
              </Button>
            </Box>
            <Copyright sx={{ mt: 5 }} />
          </Box>
        </Container>
      </ThemeProvider>
    </>
  );
}