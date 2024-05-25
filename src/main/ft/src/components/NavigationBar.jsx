import React, { useEffect, useState } from 'react';
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
import ChairAltIcon from '@mui/icons-material/ChairAlt';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import { FaHotjar } from "react-icons/fa";
import { FaBoltLightning } from "react-icons/fa6";
import DeveloperBoardIcon from '@mui/icons-material/DeveloperBoard';
import axios from 'axios';
import RealTime from './RealTime';

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
      width: '10ch',
    },
  },
}));

export default function NavigationBar() {
  const navigate = useNavigate(); // useNavigate 훅을 사용하여 네비게이션 함수 가져오기
  const [openDrawer, setDrawerOpen] = React.useState(false);
  const [openList, setListOpen] = React.useState(false);
  const { user, logout } = useAuthContext();
  const [isLoggedIn, setIsLoggedIn] = React.useState(false); // 기본적으로 로그아웃 상태
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  // ============== user 관련 함수들 =================
  const isAdmin = user && user.isAdmin == true;

  // 로그인 
  const handleLogin = () => {
    // 로그인 페이지로 이동
    navigate('/signIn');
    setDrawerOpen(false)
  };

  // 로그아웃  
  const handleLogout = () => {
    logout();
    navigate('/signIn');
    setDrawerOpen(false)
  };

  //  회원가입
  const handleSignUp = () => {
    navigate('/signUp');
    setDrawerOpen(false)
  };

  // 마이페이지
  const handleUserInfo = () => {
    navigate('/userInfo');
    setDrawerOpen(false)
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

  const handleToOrderHistory = () => {
    if (!user || !user.email) {
      window.location.href = '/signIn';
      if (window.confirm('비회원 조회를 원하시나요?')) {
        window.location.href = '/nonMemberOrderHistory';
      }
      return;
    }
    navigate('/OrderHistoryList');
    setDrawerOpen(false)
  };

  const StyledAppBar = styled(AppBar)({
    color: 'black',
    backgroundColor: '#ece6cc',
    height: '120px',
    justifyContent: 'center',
    position: 'fixed', // Add this line to make the app bar fixed
    top: 0, // Add this line to fix the app bar at the top of the viewport
    width: '100%', // Add this line to make the app bar cover the full width
    zIndex: 1000, // Add this line to ensure the app bar appears above other content
    boxShadow: 'none',
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
    setDrawerOpen(false)
  };

  const handleWish = () => {
    if (!user || !user.email) {
      window.location.href = '/signIn';
      return;
    }
    navigate('/wish/list');
    setDrawerOpen(false)
  };

  const handleDrawerClose = () => {
    setDrawerOpen(false);
    setListOpen(false);
  };

  const DrawerList = (
    <Box sx={{ width: 350, }} role="presentation" >
      <List>
        <ListItem disablePadding>
          <ListItemButton component={Link} to={'itemMenuList/hot'} onClick={() => setDrawerOpen(false)}>
            <ListItemIcon>
              <FaHotjar />
            </ListItemIcon>
            <ListItemText primary="HOT" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton component={Link} to={'itemMenuList/sale'} onClick={() => setDrawerOpen(false)}>
            <ListItemIcon>
              <FaBoltLightning />
            </ListItemIcon>
            <ListItemText primary="SALE" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton component={Link} to={'itemMenuList/mostReview'} onClick={() => setDrawerOpen(false)}>
            <ListItemIcon>
              <AutoAwesomeIcon />
            </ListItemIcon>
            <ListItemText primary="리뷰" />
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
            <ListItemButton sx={{ pl: 4 }} component={Link} to={'itemMenuList/의자'} onClick={handleDrawerClose}>
              <ListItemIcon>
                <ChairAltIcon />
              </ListItemIcon>
              <ListItemText primary="의자" />
            </ListItemButton>
            <ListItemButton sx={{ pl: 4 }} component={Link} to={'itemMenuList/소파'} onClick={handleDrawerClose}>
              <ListItemIcon>
                <WeekendIcon />
              </ListItemIcon>
              <ListItemText primary="소파" />
            </ListItemButton>
            <ListItemButton sx={{ pl: 4 }} component={Link} to={'itemMenuList/책상'} onClick={handleDrawerClose}>
              <ListItemIcon>
                <DeskIcon />
              </ListItemIcon>
              <ListItemText primary="책상" />
            </ListItemButton>
            <ListItemButton sx={{ pl: 4 }} component={Link} to={'itemMenuList/침대'} onClick={handleDrawerClose}>
              <ListItemIcon>
                <HotelIcon />
              </ListItemIcon>
              <ListItemText primary="침대" />
            </ListItemButton>
            <ListItemButton sx={{ pl: 4 }} component={Link} to={'itemMenuList/책장'} onClick={handleDrawerClose}>
              <ListItemIcon>
                <KitchenIcon />
              </ListItemIcon>
              <ListItemText primary="책장" />
            </ListItemButton>
            <ListItemButton sx={{ pl: 4 }} component={Link} to={'itemMenuList/식탁'} onClick={handleDrawerClose}>
              <ListItemIcon>
                <FoodBankIcon />
              </ListItemIcon>
              <ListItemText primary="식탁" />
            </ListItemButton>
            <ListItemButton sx={{ pl: 4 }} component={Link} to={'itemMenuList/테이블'} onClick={handleDrawerClose}>
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
          <ListItemButton onClick={handleToOrderHistory}>
            <ListItemIcon>
              <StorageIcon />
            </ListItemIcon>
            <ListItemText primary="주문내역" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton onClick={handleToCart}>
            <ListItemIcon>
              <ShoppingCartIcon />
            </ListItemIcon>
            <ListItemText primary="장바구니" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton onClick={handleWish}>
            <ListItemIcon>
              <FavoriteIcon />
            </ListItemIcon>
            <ListItemText primary="찜목록" />
          </ListItemButton>
        </ListItem>
        {isLoggedIn ? (
              <>
                <ListItem disablePadding>
                  <ListItemButton onClick={handleLogout}>
                    <ListItemIcon>
                      <LogoutIcon />
                    </ListItemIcon>
                    <ListItemText primary="로그아웃" />
                  </ListItemButton>
                </ListItem>
                <ListItem disablePadding>
                  <ListItemButton onClick={handleUserInfo}>
                    <ListItemIcon>
                      <AssignmentIndIcon />
                    </ListItemIcon>
                    <ListItemText primary="마이페이지" />
                  </ListItemButton>
                </ListItem>
              </>
            ) : (
              <>
                <ListItem disablePadding>
                  <ListItemButton onClick={handleLogin}>
                    <ListItemIcon>
                      <LoginIcon />
                    </ListItemIcon>
                    <ListItemText primary="로그인" />
                  </ListItemButton>
                </ListItem>
                <ListItem disablePadding>
                  <ListItemButton onClick={handleSignUp}>
                    <ListItemIcon>
                      <PersonAddIcon />
                    </ListItemIcon>
                    <ListItemText primary="회원가입" />
                  </ListItemButton>
                </ListItem>
              </>
            )}
        {isAdmin && (
          <ListItem disablePadding>
            <ListItemButton component={Link} to={'admin/chart'} onClick={() => setDrawerOpen(false)}>
              <ListItemIcon>
                <ListIcon />
              </ListItemIcon>
              <ListItemText primary="AdminOptionPage" />
            </ListItemButton>
          </ListItem>
        )}
        <ListItem disablePadding>
          <ListItemButton  component={Link} to={'developerPage'} onClick={() => setDrawerOpen(false)}>
            <ListItemIcon>
              <DeveloperBoardIcon />
            </ListItemIcon>
            <ListItemText primary="개발자페이지?" />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>

  );

  return (
    <Box sx={{ flexGrow: 1, marginBottom: 2, paddingTop: '103px', }}>
      <StyledAppBar position="static">
        <Toolbar>
          <Button onClick={toggleDrawer(true)} color="inherit"><MenuIcon /></Button>
          <Drawer open={openDrawer} onClose={toggleDrawer(false)} BackdropProps={{ invisible: true }}>
            {DrawerList}
          </Drawer>
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
            <Link to={'/'} className='mainPageLink'>FUNniture</Link>
          </Typography>
          <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 2 }}>
            <Stack direction="column" style={{marginTop: 30}}>
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
              <RealTime/>
            </Stack>
            
            {/* <Menu
              anchorEl={anchorEl}
              id="account-menu"
              open={open}
              onClose={handleClose}
              onClick={handleClose}
              PaperProps={{
                elevation: 0,
                sx: {
                  overflow: 'visible',
                  filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                  mt: 1.5,
                  '& .MuiAvatar-root': {
                    width: 32,
                    height: 32,
                    ml: -0.5,
                    mr: 1,
                  },
                  '&::before': {
                    content: '""',
                    display: 'block',
                    position: 'absolute',
                    top: 0,
                    right: 14,
                    width: 10,
                    height: 10,
                    bgcolor: 'background.paper',
                    transform: 'translateY(-50%) rotate(45deg)',
                    zIndex: 0,
                  },
                },
              }}
              transformOrigin={{ horizontal: 'right', vertical: 'top' }}
              anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
              <MenuItem onClick={handleClose}>
                <Avatar /> Profile
              </MenuItem>
              <MenuItem onClick={handleClose}>
                <Avatar /> My account
              </MenuItem>
              <Divider />
              <MenuItem onClick={handleClose}>
                <ListItemIcon>
                  <PersonAdd fontSize="small" />
                </ListItemIcon>
                Add another account
              </MenuItem>
              <MenuItem onClick={handleClose}>
                <ListItemIcon>
                  <Settings fontSize="small" />
                </ListItemIcon>
                Settings
              </MenuItem>
              <MenuItem onClick={handleClose}>
                <ListItemIcon>
                  <Logout fontSize="small" />
                </ListItemIcon>
                Logout
              </MenuItem>
            </Menu> */}
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