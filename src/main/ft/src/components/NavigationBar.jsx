import React from 'react';
import { styled, alpha, AppBar, Box, Toolbar, IconButton, Typography, InputBase, Badge, Drawer, Button, List, Divider, ListItem, ListItemButton, ListItemIcon, ListItemText, Collapse, Stack } from '@mui/material';
import {
  Menu as MenuIcon,
  Search as SearchIcon,
  ShoppingCart as ShoppingCartIcon,
  List as ListIcon,
  Whatshot as WhatshotIcon,
  Login as LoginIcon,
  Logout as LogoutIcon,
  PersonAdd as PersonAddIcon,
  Favorite as FavoriteIcon,
  ExpandLess,
  ExpandMore,
  AssignmentInd as AssignmentIndIcon
} from '@mui/icons-material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import StorageIcon from '@mui/icons-material/Storage';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthContext } from "../context/AuthContext";
import '../css/nav.css';
import WeekendIcon from '@mui/icons-material/Weekend';
import DeskIcon from '@mui/icons-material/Desk';
import HotelIcon from '@mui/icons-material/Hotel';
import KitchenIcon from '@mui/icons-material/Kitchen';
import TableBarIcon from '@mui/icons-material/TableBar';
import FoodBankIcon from '@mui/icons-material/FoodBank';

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
    <Box sx={{ width: 350, }} role="presentation" >
      <List>
        <ListItem disablePadding>
          <ListItemButton onClick={() => setDrawerOpen(false)}>
            <ListItemIcon>
              <WhatshotIcon />
            </ListItemIcon>
            {/* Render admin options if user is an admin */}
            <ListItemText component={Link} to={'/'} primary="특가" />
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
            <ListItemButton sx={{ pl: 4 }} component={Link} to={'itemlist/의자'} onClick={() => setDrawerOpen(false)}>
              <ListItemIcon>
                <WhatshotIcon />
              </ListItemIcon>
              <ListItemText primary="의자" />
            </ListItemButton>
            <ListItemButton sx={{ pl: 4 }} component={Link} to={'itemlist/소파'} onClick={() => setDrawerOpen(false)}>
              <ListItemIcon>
                <WeekendIcon />
              </ListItemIcon>
              <ListItemText primary="소파" />
            </ListItemButton>
            <ListItemButton sx={{ pl: 4 }} component={Link} to={'itemlist/책상'} onClick={() => setDrawerOpen(false)}>
              <ListItemIcon>
                <DeskIcon />
              </ListItemIcon>
              <ListItemText primary="책상"/>
            </ListItemButton>
            <ListItemButton sx={{ pl: 4 }} component={Link} to={'itemlist/침대'} onClick={() => setDrawerOpen(false)}>
              <ListItemIcon>
                <HotelIcon />
              </ListItemIcon>
              <ListItemText primary="침대" />
            </ListItemButton>
            <ListItemButton sx={{ pl: 4 }} component={Link} to={'itemlist/책장'} onClick={() => setDrawerOpen(false)}>
              <ListItemIcon>
                <KitchenIcon />
              </ListItemIcon>
              <ListItemText primary="책장" />
            </ListItemButton>
            <ListItemButton sx={{ pl: 4 }} component={Link} to={'itemlist/식탁'} onClick={() => setDrawerOpen(false)}>
              <ListItemIcon>
                <FoodBankIcon />
              </ListItemIcon>
              <ListItemText primary="식탁" />
            </ListItemButton>
            <ListItemButton sx={{ pl: 4 }} component={Link} to={'itemlist/테이블'} onClick={() => setDrawerOpen(false)}>
              <ListItemIcon>
                <TableBarIcon />
              </ListItemIcon>
              <ListItemText primary="테이블" />
            </ListItemButton>
          </List>
        </Collapse>
      </List>
      <Divider />
      <Divider />
      <List>
        <ListItem disablePadding>
          <ListItemButton component={Link} to={'orderHistoryList'} onClick={() => setDrawerOpen(false)}>
            <ListItemIcon>
              <ShoppingCartIcon />
            </ListItemIcon>
            <ListItemText primary="주문내역" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton component={Link} to={'wish/list'} onClick={() => setDrawerOpen(false)}>
            <ListItemIcon>
              <FavoriteIcon />
            </ListItemIcon>
            <ListItemText primary="찜목록" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton component={Link} to={'userInfo'} onClick={() => setDrawerOpen(false)}>
            <ListItemIcon>
              <AccountCircleIcon />
            </ListItemIcon>
            <ListItemText primary="내 정보" />
          </ListItemButton>
        </ListItem>
        {isAdmin && (
          <ListItem disablePadding>
            <ListItemButton component={Link} to={'admin/chart'} onClick={() => setDrawerOpen(false)}>
              <ListItemIcon>
                <ListIcon />
              </ListItemIcon>
              <ListItemText primary="Admin Option 1" />
            </ListItemButton>
          </ListItem>
          )}
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
    if (!user || !user.email) {
      window.location.href = '/signIn';
      return;
    }
    navigate('/cart');
  };

  const handleToOrderHistory = () => {
    if (!user || !user.email) {
      window.location.href = '/signIn';
      return;
    }
    navigate('/OrderHistoryList');
  };

  return (
    <Box sx={{ flexGrow: 1, marginBottom: 2, paddingTop: '103px', }}>
      <StyledAppBar position="static">
        <Toolbar>
          <div>
            <Button onClick={toggleDrawer(true)} color="inherit"><MenuIcon /></Button>
            <Drawer open={openDrawer} onClose={toggleDrawer(false)} BackdropProps={{ invisible: true }}>
              {DrawerList}
            </Drawer>
          </div>
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