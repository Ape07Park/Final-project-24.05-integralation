import React from 'react';
import { styled, alpha } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import InputBase from '@mui/material/InputBase';
import Badge from '@mui/material/Badge';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import AccountCircle from '@mui/icons-material/AccountCircle';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ListIcon from '@mui/icons-material/List';
import WhatshotIcon from '@mui/icons-material/Whatshot';
import LoginIcon from '@mui/icons-material/Login'; // login icon
import LogoutIcon from '@mui/icons-material/Logout'; // logout icon
import PersonAddIcon from '@mui/icons-material/PersonAdd'; // signUp
import { Link } from 'react-router-dom';
import '../css/nav.css';
import { ExpandLess, ExpandMore } from '@mui/icons-material';
import { Collapse } from '@mui/material';
import { useNavigate } from 'react-router-dom'; // useNavigate 추가
import { useAuthContext } from "../context/AuthContext";
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import { Stack } from '@mui/material';

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: 0,
  marginLeft: theme.spacing(2),
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '20ch',
    },
  },
}));

export default function NavigationBar() {
  const navigate = useNavigate(); // useNavigate 훅을 사용하여 네비게이션 함수 가져오기
  const [openDrawer, setDrawerOpen] = React.useState(false);
  const [openList, setListOpen] = React.useState(false);
  const { user, logout } = useAuthContext();
  const [isLoggedIn, setIsLoggedIn] = React.useState(false); // 기본적으로 로그아웃 상태

  // ============== user 관련 함수들 =================
  const isAdmin = user && user.isAdmin == true;

  // 로그인 
  const handleLogin = () => {
    // 로그인 페이지로 이동
    navigate('/signIn');
  };

  // 로그아웃  
  const handleLogout = () => {
    logout();
    navigate('/signIn');
  };

  //  회원가입
  const handleSignUp = () => {
    navigate('/signUp');
  };

  // 마이페이지
  const handleUserInfo = () => {
    navigate('/userInfo');
  };
  // ============== user 관련 함수들 끝 =================

  const toggleDrawer = (newOpen) => () => {
    setDrawerOpen(newOpen);
  };
  const toggleList = (newOpen) => () => {
    setListOpen(newOpen);
  };

  // 페이지 로딩 시 로그인 상태 확인
  React.useEffect(() => {
    const checkLoginStatus = () => {
      // 세션 로그인 여부를 확인하는 로직
      const loggedIn = user ? true : false;
      setIsLoggedIn(loggedIn);
    };
    checkLoginStatus();
  }, [user]);



  // 추가: 세션 로그인 상태를 확인하고 업데이트하는 함수
  const checkLoginStatus = () => {
    // 세션 로그인 여부를 확인하는 로직
    // 세션이 로그인되어 있다면 setIsLoggedIn(true) 호출
    // 세션이 로그아웃되어 있다면 setIsLoggedIn(false) 호출
  };

  // 추가: 컴포넌트가 처음 마운트될 때 세션 로그인 상태를 확인
  React.useEffect(() => {
    checkLoginStatus();
  }, []);


  // 변경: AccountCircle 아이콘을 세션 로그인 상태에 따라 다르게 렌더링

  const DrawerList = (
    <Box sx={{ width: 350,}} role="presentation" >
      <List>
        <ListItem disablePadding>
        {isAdmin && (
        <>
          <ListItem disablePadding>
            <ListItemButton component={Link} to={'admin/itemlist'} onClick={() => setDrawerOpen(false)}>
              <ListItemIcon>
                <ListIcon/>
              </ListItemIcon>
              <ListItemText primary="Admin Option 1" />
            </ListItemButton>
          </ListItem>
        </>
      )}
          <ListItemButton onClick={() => setDrawerOpen(false)}>
            <ListItemIcon>
              <WhatshotIcon />
            </ListItemIcon>
              {/* Render admin options if user is an admin */}
            <ListItemText primary="특가" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton onClick={toggleList(!openList)}>
            <ListItemIcon>
              <ListIcon />
            </ListItemIcon>
            <ListItemText primary="카테고리" />
            {openList ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>
        </ListItem>
        <Collapse in={openList} unmountOnExit>
          <List component="div" disablePadding>
            <ListItemButton sx={{ pl: 4 }}>
              <ListItemIcon>
                <WhatshotIcon />
              </ListItemIcon>
              <ListItemText primary="의자" />
            </ListItemButton>
            <ListItemButton sx={{ pl: 4 }}>
              <ListItemIcon>
                <WhatshotIcon />
              </ListItemIcon>
              <ListItemText primary="책상" />
            </ListItemButton>
            <ListItemButton sx={{ pl: 4 }}>
              <ListItemIcon>
                <WhatshotIcon />
              </ListItemIcon>
              <ListItemText primary="책상" />
            </ListItemButton>
            <ListItemButton sx={{ pl: 4 }}>
              <ListItemIcon>
                <WhatshotIcon />
              </ListItemIcon>
              <ListItemText primary="책상" />
            </ListItemButton>
            <ListItemButton sx={{ pl: 4 }}>
              <ListItemIcon>
                <WhatshotIcon />
              </ListItemIcon>
              <ListItemText primary="책상" />
            </ListItemButton>
          </List>
        </Collapse>
      </List>
      <Divider />
      <Divider />
      <List>
        {['주문내역', '내 정보'].map((text, index) => (
          <ListItem key={text} disablePadding>
            <ListItemButton>
              <ListItemIcon>
                {index % 2 === 0 ? <ShoppingCartIcon /> : <AccountCircle />}
              </ListItemIcon>
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  const StyledAppBar = styled(AppBar)({
    backgroundColor: 'gray',
    height: '120px',
    justifyContent: 'center',
    position: 'fixed', // Add this line to make the app bar fixed
    top: 0, // Add this line to fix the app bar at the top of the viewport
    width: '100%', // Add this line to make the app bar cover the full width
    zIndex: 1000, // Add this line to ensure the app bar appears above other content
  });

  // 검색 버튼 클릭 시 실행되는 함수
  const handleSearch = (event) => {
    event.preventDefault(); // 기본 이벤트 방지
    const searchQuery = event.target.elements.search.value.trim(); // 검색어 추출
    if (searchQuery) {
      navigate(`/itemlist/${searchQuery}`); // navigate 함수로 페이지 이동
    }
  };

  const handleToCart = () => {
    navigate('/cart');
  };

  return (
    <Box sx={{ flexGrow: 1, marginBottom: 2, paddingTop: '103px',  }}>
      <StyledAppBar position="static">
        <Toolbar>
          <div>
            <Button onClick={toggleDrawer(true)} color="inherit"><MenuIcon /></Button>
            <Drawer open={openDrawer} onClose={toggleDrawer(false)} BackdropProps={{ invisible: true }}>
              {DrawerList}
            </Drawer>
          </div>
          <Link to={'/wish/list'}>찜</Link>
          <Box sx={{ flexGrow: 1 }} />
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              flex: '1'
            }}
          >
            <Link to={'/'} className='mainPageLink'>FUNiture</Link>
          </Typography>
          <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 2 }}>
            <form onSubmit={handleSearch}>
              <Search>
                <SearchIconWrapper>
                  <SearchIcon />
                </SearchIconWrapper>
                <StyledInputBase
                  name="search"
                  placeholder="검색"
                  inputProps={{ 'aria-label': 'search' }}
                />
              </Search>
            </form>

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
                {/* <Button color="inherit" onClick={handleLogin} startIcon={<LoginIcon />}>
                  로그인
                </Button>
                <Button color="inherit" onClick={handleSignUp} startIcon={<PersonAddIcon />}>
                  회원가입
                </Button> */}
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