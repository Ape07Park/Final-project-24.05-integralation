import React from 'react';
import { styled, AppBar, Box, Toolbar, IconButton, Typography, Badge, Stack } from '@mui/material';
import {
  ShoppingCart as ShoppingCartIcon,
  Login as LoginIcon,
  Logout as LogoutIcon,
  PersonAdd as PersonAddIcon,
  AssignmentInd as AssignmentIndIcon
} from '@mui/icons-material';
import StorageIcon from '@mui/icons-material/Storage';
import { Link } from 'react-router-dom';
import { useAuthContext } from "../../context/AuthContext";
import '../../css/nav.css';
import RealTime from './RealTime';
import useNavigation from './UseNavigation';
import SearchBar from './SearchBar';
import MainDrawer from './MainDrawer';


export default function NavigationBar() {
  
  const { user, logout } = useAuthContext(); // 로그인 확인
  const [isLoggedIn, setIsLoggedIn] = React.useState(false); // 기본적으로 로그아웃 상태로 설정




  // ============== 페이지 이동 관련 =================

  const {
    handleLogin,
    handleLogout,
    handleSignUp,
    handleUserInfo,
    handleToCart,
    handleToOrderHistory,
  } = useNavigation();
  

  // ============== 로그인 관련 =================

  // 로그인 확인 함수
  const checkLoginStatus = () => {
    const loggedIn = user ? true : false;
    setIsLoggedIn(loggedIn);
  };

  // 페이지 로딩 시 로그인 상태 확인
  React.useEffect(() => {
    checkLoginStatus();
  }, [user]);

  // 추가: 컴포넌트가 처음 마운트될 때 세션 로그인 상태를 확인
  React.useEffect(() => {
    checkLoginStatus();
  }, []);

  
  const StyledAppBar = styled(AppBar)({
    color: 'black',
    backgroundColor: '#ece6cc',
    height: '120px',
    justifyContent: 'center',
    position: 'fixed',
    top: 0,
    width: '100%',
    zIndex: 1000,
    boxShadow: 'none',
  });

  return (
    <Box sx={{ flexGrow: 1, marginBottom: 2, paddingTop: '103px', }}>
      <StyledAppBar position="static">
        <Toolbar>
          <MainDrawer />
          <Box sx={{ flexGrow: 0.55, display: { xs: 'none', md: 'flex' } }} />
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{
              flexGrow: 1,
              textAlign: 'center', // 수평 방향 가운데 정렬
              display: 'flex', // 컨테이너를 플렉스 박스로 설정
              justifyContent: 'center', // 수평 방향 가운데 정렬
              alignItems: 'center', // 세로 방향 가운데 정렬
            }}
          >
            <Link to={'/'} className='mainPageLink'>FURNiture</Link>
          </Typography>
          <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 2 }}>
            <Stack direction="column" style={{ marginTop: 30 }}>
              <SearchBar />
              <RealTime />
            </Stack>
            <IconButton size="small" color="inherit" onClick={handleToOrderHistory}>
              <Stack direction="column" alignItems="center">
                <Badge badgeContent={0} color="error">
                  <StorageIcon />
                </Badge>
                <Typography variant="body2" sx={{ fontSize: '0.7rem' }}>주문내역</Typography>
              </Stack>
            </IconButton>
            <IconButton size="small" color="inherit" onClick={handleToCart}>
              <Stack direction="column" alignItems="center">
                <Badge badgeContent={0} color="error">
                  <ShoppingCartIcon />
                </Badge>
                <Typography variant="body2" sx={{ fontSize: '0.7rem' }}>장바구니</Typography>
              </Stack>
            </IconButton>
            {isLoggedIn ? (
              <>
                <IconButton size="small" color="inherit" onClick={handleLogout}>
                  <Stack direction="column" alignItems="center">
                    <LogoutIcon />
                    <Typography variant="body2" sx={{ fontSize: '0.7rem' }}>로그아웃</Typography>
                  </Stack>
                </IconButton>
                <IconButton size="small" color="inherit" onClick={handleUserInfo}>
                  <Stack direction="column" alignItems="center">
                    <AssignmentIndIcon />
                    <Typography variant="body2" sx={{ fontSize: '0.7rem' }}>마이페이지</Typography>
                  </Stack>
                </IconButton>
              </>
            ) : (
              <>
                <IconButton size="small" color="inherit" onClick={handleLogin}>
                  <Stack direction="column" alignItems="center">
                    <LoginIcon />
                    <Typography variant="body2" sx={{ fontSize: '0.7rem' }}>로그인</Typography>
                  </Stack>
                </IconButton>
                <IconButton size="small" color="inherit" onClick={handleSignUp}>
                  <Stack direction="column" alignItems="center">
                    <PersonAddIcon />
                    <Typography variant="body2" sx={{ fontSize: '0.7rem' }}>회원가입</Typography>
                  </Stack>
                </IconButton>
              </>
            )}
          </Box>
        </Toolbar>
      </StyledAppBar>
    </Box>
  );
}