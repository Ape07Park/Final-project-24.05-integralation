import React, { useEffect, useState } from 'react';
import { TableCell, TableRow, IconButton, Stack, Typography, TableBody, Table } from '@mui/material';
import ChairAltIcon from '@mui/icons-material/ChairAlt';
import WeekendIcon from '@mui/icons-material/Weekend';
import DeskIcon from '@mui/icons-material/Desk';
import HotelIcon from '@mui/icons-material/Hotel';
import KitchenIcon from '@mui/icons-material/Kitchen';
import FoodBankIcon from '@mui/icons-material/FoodBank';
import TableBarIcon from '@mui/icons-material/TableBar';
import './maincategorytable.css';
import { useNavigate, useParams } from 'react-router-dom';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import { FaHotjar } from "react-icons/fa";
import { FaBoltLightning } from "react-icons/fa6";

export default function MainCategoryBox() {
    const navigate = useNavigate(); 
    const { menu } = useParams();
    const [menus, setMenus] = useState(null);

    useEffect(() =>{
        setMenus(menu)
    })

    const handleMenuCategoryClick = (category) => {
        navigate(`/itemMenuList/${category}`);
    };
    return (
        <Table className="main-category-table">
            <TableBody>
                <TableRow>
                    <TableCell align="center">
                        <IconButton
                            size="small"
                            color="inherit"
                            onClick={() => handleMenuCategoryClick('hot')}
                            style={{ color: menus === 'hot' ? 'orange' : 'black' }}
                        >
                            <Stack direction="column" alignItems="center">
                                <FaHotjar />
                                <Typography variant="body2">
                                    HOT
                                </Typography>
                            </Stack>
                        </IconButton>
                    </TableCell>
                    <TableCell align="center">
                        <IconButton
                            size="small"
                            color="inherit"
                            onClick={() => handleMenuCategoryClick('sale')}
                            style={{ color: menus === 'sale' ? 'orange' : 'black' }}
                        >
                            <Stack direction="column" alignItems="center">
                                <FaBoltLightning/>
                                <Typography variant="body2">
                                    SALE
                                </Typography>
                            </Stack>
                        </IconButton>
                    </TableCell>
                    <TableCell align="center">
                        <IconButton
                            size="small"
                            color="inherit"
                            onClick={() => handleMenuCategoryClick('mostReview')}
                            style={{ color: menus === 'mostReview' ? 'orange' : 'black' }}
                        >
                            <Stack direction="column" alignItems="center">
                                <AutoAwesomeIcon />
                                <Typography variant="body2">
                                    리뷰
                                </Typography>
                            </Stack>
                        </IconButton>
                    </TableCell>
                    <TableCell align="center">
                        <IconButton
                            size="small"
                            color="inherit"
                            onClick={() => handleMenuCategoryClick('의자')}
                            style={{ color: menus === '의자' ? 'orange' : 'black' }}
                        >
                            <Stack direction="column" alignItems="center">
                                <ChairAltIcon />
                                <Typography variant="body2">의자</Typography>
                            </Stack>
                        </IconButton>
                    </TableCell>
                    <TableCell align="center">
                        <IconButton
                            size="small"
                            color="inherit"
                            onClick={() => handleMenuCategoryClick('소파')}
                            style={{ color: menus === '소파' ? 'orange' : 'black' }}
                        >
                            <Stack direction="column" alignItems="center">
                                <WeekendIcon />
                                <Typography variant="body2">소파</Typography>
                            </Stack>
                        </IconButton>
                    </TableCell>
                    <TableCell align="center">
                        <IconButton
                            size="small"
                            color="inherit"
                            onClick={() => handleMenuCategoryClick('책상')}
                            style={{ color: menus === '책상' ? 'orange' : 'black' }}
                        >
                            <Stack direction="column" alignItems="center">
                                <DeskIcon />
                                <Typography variant="body2">책상</Typography>
                            </Stack>
                        </IconButton>
                    </TableCell>
                    <TableCell align="center">
                        <IconButton
                            size="small"
                            color="inherit"
                            onClick={() => handleMenuCategoryClick('침대')}
                            style={{ color: menus === '침대' ? 'orange' : 'black' }}
                        >
                            <Stack direction="column" alignItems="center">
                                <HotelIcon />
                                <Typography variant="body2">침대</Typography>
                            </Stack>
                        </IconButton>
                    </TableCell>
                    <TableCell align="center">
                        <IconButton
                            size="small"
                            color="inherit"
                            onClick={() => handleMenuCategoryClick('책장')}
                            style={{ color: menus === '책장' ? 'orange' : 'black' }}
                        >
                            <Stack direction="column" alignItems="center">
                                <KitchenIcon />
                                <Typography variant="body2">책장</Typography>
                            </Stack>
                        </IconButton>
                    </TableCell>
                    <TableCell align="center">
                        <IconButton
                            size="small"
                            color="inherit"
                            onClick={() => handleMenuCategoryClick('식탁')}
                            style={{ color: menus === '식탁' ? 'orange' : 'black' }}
                        >
                            <Stack direction="column" alignItems="center">
                                <FoodBankIcon />
                                <Typography variant="body2">식탁</Typography>
                            </Stack>
                        </IconButton>
                    </TableCell>
                    <TableCell align="center">
                        <IconButton
                            size="small"
                            color="inherit"
                            onClick={() => handleMenuCategoryClick('테이블')}
                            style={{ color: menus === '테이블' ? 'orange' : 'black' }}
                        >
                            <Stack direction="column" alignItems="center">
                                <TableBarIcon />
                                <Typography variant="body2">테이블</Typography>
                            </Stack>
                        </IconButton>
                    </TableCell>
                    
                </TableRow>
            </TableBody>
        </Table>
    );
}