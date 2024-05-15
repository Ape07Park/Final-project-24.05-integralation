import React, { useEffect, useState } from 'react';
import { TableCell, TableRow, IconButton, Stack, Typography, TableBody, Table } from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import ChairAltIcon from '@mui/icons-material/ChairAlt';
import WeekendIcon from '@mui/icons-material/Weekend';
import DeskIcon from '@mui/icons-material/Desk';
import HotelIcon from '@mui/icons-material/Hotel';
import KitchenIcon from '@mui/icons-material/Kitchen';
import FoodBankIcon from '@mui/icons-material/FoodBank';
import TableBarIcon from '@mui/icons-material/TableBar';
import './maincategorytable.css';
import { useNavigate, useParams } from 'react-router-dom';

export default function MainCategoryBox() {
    const navigate = useNavigate(); 
    const { searchQuery } = useParams();
    const [selectedCategory, setSelectedCategory] = useState(null);

    useEffect(() =>{
        setSelectedCategory(searchQuery)
    })

    const handleCategoryClick = (category) => {
        navigate(`/itemlist/${category}`);
    };
    return (
        <Table className="main-category-table">
            <TableBody>
                <TableRow>
                    <TableCell align="center">
                        <IconButton
                            size="small"
                            color="inherit"
                            onClick={() => handleCategoryClick('의자')}
                            style={{ color: selectedCategory === '의자' ? 'orange' : 'black' }}
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
                            onClick={() => handleCategoryClick('소파')}
                            style={{ color: selectedCategory === '소파' ? 'orange' : 'black' }}
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
                            onClick={() => handleCategoryClick('책상')}
                            style={{ color: selectedCategory === '책상' ? 'orange' : 'black' }}
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
                            onClick={() => handleCategoryClick('침대')}
                            style={{ color: selectedCategory === '침대' ? 'orange' : 'black' }}
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
                            onClick={() => handleCategoryClick('책장')}
                            style={{ color: selectedCategory === '책장' ? 'orange' : 'black' }}
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
                            onClick={() => handleCategoryClick('식탁')}
                            style={{ color: selectedCategory === '식탁' ? 'orange' : 'black' }}
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
                            onClick={() => handleCategoryClick('테이블')}
                            style={{ color: selectedCategory === '테이블' ? 'orange' : 'black' }}
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