import React from "react";
import { Box, Button, CardContent,  Input,  MenuItem, Select, Typography } from "@mui/material";
import { Card } from "react-bootstrap";
import CountDown from "./CountDown";
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import "../../css/itemInfo.css"

const ItemInfo = ({ item, options, selectedOptions, handleOptionChange, decreaseQuantity, increaseQuantity, removeOption, totalPrice, handleOrder,
                    handleAddToCart, handleCopyLink, iswish, itemWishCount, handleLikeClick, nonMembersHandleOrder
 }) => {
  
  return (
      <Card>
        <CardContent>
          {/* 상품 이름 및 가격 */}
          <Typography variant="h5" gutterBottom>
            {item.name}
          </Typography>
          <Typography variant="body1" gutterBottom>
            <CountDown saleDate={item.saleDate} />
          </Typography>
          {/* 가격 정보 */}
          <div style={{ marginBottom: '10px' }} >
            {/* 세일 가격 표시 */}
            <span id="nowPrice" style={item.salePrice && new Date(item.saleDate) > new Date() ? { textDecoration: 'line-through', lineHeight: '1.5', fontSize: 'small' } : {}}>
              {item.saleDate && new Date(item.saleDate) > new Date() && item.price ? `${item.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}원` : ''}
            </span><br/>
            {/* 현재 가격 표시 */}
            <span id="currentPrice">{item.saleDate && new Date(item.saleDate) > new Date() ? (item.salePrice ? item.salePrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') : '') : (item.price ? item.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') : '')}</span><span>원</span>
          </div>
          {/* 옵션 선택 */}
          <div style={{ marginBottom: '10px' }}>
            {/* 옵션 선택 메뉴 */}
            <Select
              value=''
              onChange={handleOptionChange}
              displayEmpty
              title="옵션 선택"
              fullWidth
              style={{ width: '80%' }}
              MenuProps={{ PaperProps: { style: { width: 'max-content' } } }}
            >
              <MenuItem value='' disabled>옵션 선택</MenuItem>
              {options.map(option => (
                <MenuItem 
                  key={option.option} 
                  value={option.option} 
                  style={{ justifyContent: 'space-between' }}
                  disabled={option.stock === 0}
                >
                  <span>{option.option}</span>
                  <span>{option.stock}개</span>
                </MenuItem>
              ))}
            </Select>
            {/* 선택된 옵션 표시 */}
            {selectedOptions.map((option, index) => (
              <Box 
                key={index} 
                display="flex" 
                alignItems="center" 
                marginBottom={1} 
                p={1}
                borderRadius={1}
                boxShadow={2}
                bgcolor="#f5f5f5"
                border="1px solid #ccc"
                style={{ width: '75%', marginTop: 5, minHeight: 40,  }} 
              >
                <Typography variant="body1" style={{ flexGrow: 1 }}>
                  {option.option}
                </Typography>
                <button className="optionButton" style={{border:0, width:30, cursor: 'pointer',}} onClick={() => decreaseQuantity(index)}>-</button>
                <Box display="flex" alignItems="center" justifyContent="center">
                  <Input
                    value={option.count}
                    readOnly
                    style={{ 
                      width: `${(option.count.toString().length + 1) * 10}px`, 
                      margin: '0 0px', 
                      backgroundColor: 'transparent', 
                      textAlign: 'center', 
                    }} 
                    disableUnderline 
                    inputProps={{ min: 0, max: 5 }}
                  />
                </Box>
                <button className="optionButton" style={{border:0, width:30, cursor: 'pointer',}} onClick={() => increaseQuantity(index, option.stock)}>+</button>
                <Button className="optionButton" onClick={() => removeOption(index)}>X</Button>
              </Box>
            ))}
          </div>
          {/* 총 가격 표시 */}
          <Typography variant="h6" style={{ fontWeight: 'bold' }}>
            총 가격: {totalPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}원
          </Typography>
          {/* 주문 및 장바구니 버튼 */}
          <Button variant="contained" className="mainButton" style={{ marginBottom: '10px', }} 
            onClick={handleOrder}>주문하기</Button> 
          <Button variant="contained" className="mainButton" style={{ marginBottom: '10px', marginLeft:5 }} onClick={handleAddToCart}>장바구니</Button>
          <Button variant="contained" style={{ marginBottom: '10px', marginLeft:5, backgroundColor: '#808099' }} onClick={nonMembersHandleOrder}>비회원 주문하기</Button>
          <br/>
          {/* 공유 및 찜하기 버튼 */}
          <Button variant="contained" className="mainButton" color="primary" style={{ marginBottom: '10px' }} onClick={handleCopyLink}>공유하기</Button>
          <Button variant="contained" color="primary" style={{ marginBottom: '10px', marginLeft:5, backgroundColor: 'transparent', color: 'black', }} onClick={handleLikeClick}>
            {iswish ? <FavoriteIcon style={{ color: 'red', width: 18 }} /> : <FavoriteBorderIcon style={{width:18}}/>} {itemWishCount}
          </Button>
        </CardContent>
      </Card>
    );
  };

export default ItemInfo;