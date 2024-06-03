import React from 'react';
import { Box, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Collapse, Button, Drawer, Divider } from '@mui/material';
import { useAuthContext } from "../../context/AuthContext";
import { FaHotjar } from "react-icons/fa";
import { FaBoltLightning } from "react-icons/fa6";
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import WeekendIcon from '@mui/icons-material/Weekend';
import DeskIcon from '@mui/icons-material/Desk';
import HotelIcon from '@mui/icons-material/Hotel';
import KitchenIcon from '@mui/icons-material/Kitchen';
import TableBarIcon from '@mui/icons-material/TableBar';
import FoodBankIcon from '@mui/icons-material/FoodBank';
import ChairAltIcon from '@mui/icons-material/ChairAlt';
import { Link } from 'react-router-dom';
import { ExpandLess, ExpandMore } from '@mui/icons-material';
import DeveloperBoardIcon from '@mui/icons-material/DeveloperBoard';
import StorageIcon from '@mui/icons-material/Storage';
import {
    Menu as MenuIcon,
    ShoppingCart as ShoppingCartIcon,
    List as ListIcon,
    Login as LoginIcon,
    Logout as LogoutIcon,
    PersonAdd as PersonAddIcon,
    Favorite as FavoriteIcon,
    AssignmentInd as AssignmentIndIcon,
} from '@mui/icons-material';
import useNavigation from './UseNavigation';

function MainDrawer() {
    const [openDrawer, setDrawerOpen] = React.useState(false); // 사이드메뉴(드로어)
    const [openList, setListOpen] = React.useState(false); // 사이드메뉴 내 리스트 토글
    const { user } = useAuthContext(); // 로그인 확인


    const isAdmin = user && user.isAdmin == true; //admin 확인절차

    const [isLoggedIn, setIsLoggedIn] = React.useState(false); // 기본적으로 로그아웃 상태로 설정

    const {
        handleLogin,
        handleLogout,
        handleSignUp,
        handleUserInfo,
        handleToCart,
        handleWish,
        handleToOrderHistory,
    } = useNavigation();

    const toggleDrawer = (newOpen) => () => {
        setDrawerOpen(newOpen);
    };

    const toggleDrawerList = (newOpen) => () => {
        setListOpen(newOpen);
    };

    const handleDrawerClose = () => {
        setDrawerOpen(false);
        setListOpen(false);
    };

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

    return (
        <>
            <Button onClick={toggleDrawer(true)} color="inherit"><MenuIcon /></Button>
            <Drawer open={openDrawer} onClose={toggleDrawer(false)} BackdropProps={{ invisible: true }}>
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
                            <ListItemButton onClick={toggleDrawerList(!openList)}>
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
                            <ListItemButton component={Link} to={'developerPage'} onClick={() => setDrawerOpen(false)}>
                                <ListItemIcon>
                                    <DeveloperBoardIcon />
                                </ListItemIcon>
                                <ListItemText primary="개발자 소개페이지" />
                            </ListItemButton>
                        </ListItem>
                    </List>
                </Box>
            </Drawer>
        </>
    );
}

export default MainDrawer;
