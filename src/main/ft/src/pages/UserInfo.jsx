import React, { useEffect, useState } from 'react';
import { deleteUserData, authRemoveUser, selectUserData } from '../api/firebase';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import { useNavigate } from 'react-router-dom';
import { onAuthStateChanged, getAuth } from 'firebase/auth';
import Button from '@mui/material/Button';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Container from '@mui/material/Container';
import { CssBaseline, Paper, Grid, Divider } from '@mui/material';
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
  
  return (
    <ThemeProvider theme={defaultTheme}>
      <CssBaseline />
      <Container maxWidth="sm">
        <Box mt={4}>
          <Paper elevation={3} sx={{ p: 4 }}>
            <Typography variant="h5" align="center" gutterBottom>
              User Information
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <InfoItem label="Email" value={userInfo?.email} />
              
                <InfoItem label="Name" value={userInfo?.name} />
              
                <InfoItem label="Phone" value={userInfo?.tel} />
               
                <InfoItem label="Address" value={userInfo?.addr} />
                
                <InfoItem label="Detail Address" value={userInfo?.detailAddr} />
               
                <InfoItem label="Delivery Request" value={userInfo?.req} />
              
                <InfoItem label="Email Verified" value={userInfo?.emailVerified ? 'Yes' : 'No'} />
               
                {isAdmin && (
                  <Typography variant="body1" color="error">
                    <strong>Admin:</strong> Yes
                  </Typography>
                )}
              </Grid>
            </Grid>
            <Divider sx={{ my: 3 }} />
            <Stack justifyContent="center" spacing={5}>
              <Button variant="contained" onClick={handleUpdate}>
               업데이트 페이지로 이동
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
}

function InfoItem({ label, value }) {
  return (
    <Box>
      <Typography variant="body1" fontWeight="bold">{label}:</Typography>
      <Typography variant="body1">{value || 'N/A'}</Typography>
    </Box>
  );
}
