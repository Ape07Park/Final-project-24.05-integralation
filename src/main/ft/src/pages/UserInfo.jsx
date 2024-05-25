import React, { useEffect, useState } from 'react';
import { deleteUserData, authRemoveUser, selectUserData } from '../api/firebase';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import { useNavigate } from 'react-router-dom';
import { onAuthStateChanged, getAuth } from 'firebase/auth';
import Button from '@mui/material/Button';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Container from '@mui/material/Container';
import {  Paper, Grid, Divider } from '@mui/material';
import Box from '@mui/material/Box';

export default function UserInfo() {
  const defaultTheme = createTheme();
  const navigate = useNavigate();
  const auth = getAuth();
  const [currentUserEmail, setCurrentUserEmail] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUserEmail(user.email);
      } else {
        setCurrentUserEmail(null);
      }
    });
  }, [auth]);

  useEffect(() => {
    if (currentUserEmail) {
      const fetchUserInfo = async () => {
        try {
          const info = await selectUserData(currentUserEmail);
          setUserInfo(info);
          setIsAdmin(info && info.isAdmin === 1);
        } catch (error) {
          console.error('사용자 정보를 불러오는 중 에러:', error);
        }
      };
      fetchUserInfo();
    }
  }, [currentUserEmail]);

  const handleUpdate = () => {
    navigate('/UserUpdate', { state: { userInfo } });
  };

  const handleDelete = async () => {
    const userEmail = userInfo?.email;
    try {
      if (window.confirm('계정을 삭제하시겠습니까?')) {
        await Promise.all([
          deleteUserData(userEmail),
          authRemoveUser(userEmail)
        ]);
        alert('계정이 삭제되었습니다.');
        navigate('/signIn');
      }
    } catch (error) {
      console.error('계정 삭제 중 오류:', error);
    }
  };
  
  const InfoItem = ({ label, value }) => (
    <Grid container spacing={2} sx={{ mb: 2 }}>
      <Grid item xs={4}>
        <Typography variant="body1" fontWeight="bold" noWrap>
          {label}:
        </Typography>
      </Grid>
      <Grid item xs={8}>
        <Typography variant="body1">
          {value || 'N/A'}
        </Typography>
      </Grid>
    </Grid>
  );
  
  return (
    <ThemeProvider theme={defaultTheme}>
      
      <Container maxWidth="sm">
        <Box mt={4}>
          <Paper elevation={3} sx={{ p: 4, borderRadius: 4 }}>
            <Typography variant="h5" align="center" gutterBottom>
              마이 페이지
            </Typography>
            <Divider sx={{ my: 3 }} />
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <InfoItem label="이메일" value={userInfo?.email} />
                <InfoItem label="이름" value={userInfo?.name} />
                <InfoItem label="전화번호" value={userInfo?.tel} />
                <InfoItem label="우편번호" value={userInfo?.postCode} />
                <InfoItem label="주소" value={userInfo?.addr} />
                <InfoItem label="상세 주소" value={userInfo?.detailAddr} />
                <InfoItem label="배송 시 요청사항" value={userInfo?.req} />
                <InfoItem label="이메일 확인" value={userInfo?.emailVerified ? '확인됨' : '미확인'} />
                {isAdmin && (
                  <Box mt={2}>
                    <Typography variant="body1" color="error">
                      <strong>관리자:</strong> 예
                    </Typography>
                  </Box>
                )}
              </Grid>
            </Grid>
            <Divider sx={{ my: 3 }} />
            <Stack direction="row" justifyContent="center" spacing={2}>
              <Button variant="contained" color="primary" onClick={handleUpdate}>
                정보 수정
              </Button>
              <Button variant="contained" color="error" onClick={handleDelete}>
                계정 삭제
              </Button>
            </Stack>
          </Paper>
        </Box>
      </Container>
    </ThemeProvider>
  );
};
