import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  Container,
  Grid,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableContainer,
  TableRow,
  CardMedia,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Divider,
  useTheme,
  useMediaQuery,
} from "@mui/material";

import { useDaumPostcodePopup } from 'react-daum-postcode';
import axios from 'axios';
import { selectUserData } from '../api/firebase';
import { useNavigate } from 'react-router-dom';
import { onAuthStateChanged, getAuth } from 'firebase/auth';
import CustomButton from '../components/CustomButton';

const Order = () => {
  const [orderItems, setOrderItems] = useState([]);
  const [totalPayment, setTotalPayment] = useState(0);
  const [currentUserEmail, setCurrentUserEmail] = useState(null);
  const [userInfo, setUserInfo] = useState(null);

  const [name, setName] = useState('');
  const [postCode, setPostCode] = useState('');
  const [addr, setAddr] = useState('');
  const [detailAddr, setDetailAddr] = useState('');
  const [tel, setTel] = useState('');
  const [req, setReq] = useState('');
  const [messageType, setMessageType] = useState('');

  const navigate = useNavigate();
  const auth = getAuth();

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('lg'));

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
        } catch (error) {
          console.error('사용자 정보를 불러오는 중 에러:', error);
        }
      };
      fetchUserInfo();
    }
  }, [currentUserEmail]);

  useEffect(() => {
    const locationState = window.history.state;
    if (locationState && locationState.orderItems) {
      setOrderItems(locationState.orderItems);
    } else {
      const storedOrderItems = JSON.parse(localStorage.getItem('orderItems'));
      if (storedOrderItems) {
        setOrderItems(storedOrderItems);
      }
    }
  }, []);

  useEffect(() => {
    const calculateTotalPayment = () => {
      const totalPrice = orderItems.reduce((acc, item) => acc + (item.price * item.count), 0);
      setTotalPayment(totalPrice);
    };
    calculateTotalPayment();
  }, [orderItems]);

  useEffect(() => {
    if (userInfo) {
      const { name, postCode, addr, detailAddr, tel, req } = userInfo;
      setName(name || '');
      setPostCode(postCode || '');
      setAddr(addr || '');
      setDetailAddr(detailAddr || '');
      setTel(tel || '');
      setReq(req || '');
    }
  }, [userInfo]);

  const handleSendOrder = async () => {
    if (!name || !postCode || !addr || !detailAddr || !tel) {
      alert('모든 필수 정보를 입력해주세요.');
      return;
    }

    try {
      const order = {
        email: currentUserEmail,
        name: name,
        postCode: postCode,
        addr: addr,
        detailAddr: detailAddr,
        tel: tel,
        req: req,
        totalPrice: totalPayment
      };

      const orderItemData = orderItems.map(orderItem => ({
        iid: orderItem.iid,
        ioid: orderItem.ioid,
        count: orderItem.count,
        price: orderItem.price,
        oid: null
      }));

      const data = {
        order: order,
        orderItems: orderItemData
      };

      const response = await axios.post('/ft/order/insert', data);
      console.log(response);
      alert('주문이 성공적으로 생성되었습니다.');
    } catch (error) {
      console.error('주문 처리 중 오류:', error);
      alert('주문 생성 중 오류가 발생했습니다.');
    }
  };

  const openPostcode = useDaumPostcodePopup("//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js");

  const handleComplete = data => {
    let fullAddress = data.address;
    let extraAddress = '';
    let postCode = data.zonecode;

    if (data.addressType === 'R') {
      if (data.bname !== '') {
        extraAddress += data.bname;
      }
      if (data.buildingName !== '') {
        extraAddress += extraAddress !== '' ? `, ${data.buildingName}` : data.buildingName;
      }
      fullAddress += extraAddress !== '' ? ` (${extraAddress})` : '';
    }
    setAddr(fullAddress);
    setPostCode(postCode);
  }

  const handleTelChange = (e) => {
    const { value } = e.target;
    const telValue = value.replace(/[^0-9]/g, '');
    let formattedTel = '';

    if (telValue.length <= 3) {
      formattedTel = telValue;
    } else if (telValue.length <= 7) {
      formattedTel = telValue.slice(0, 3) + '-' + telValue.slice(3);
    } else if (telValue.length <= 11) {
      formattedTel = telValue.slice(0, 3) + '-' + telValue.slice(3, 7) + '-' + telValue.slice(7);
    } else {
      formattedTel = telValue.slice(0, 3) + '-' + telValue.slice(3, 7) + '-' + telValue.slice(7, 11);
    }
    const maxLength = 13;
    const updatedTel = formattedTel.slice(0, maxLength);
    setTel(updatedTel);
  };

  return (
    <Container fixed sx={{ mb: 5, mt: 5 }}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Typography variant="h6">담긴 상품</Typography>
          <TableContainer sx={{ maxWidth: '100%', overflowX: 'auto' }}>
            <Table className="table table-hover">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ whiteSpace: 'nowrap' }}>이미지</TableCell>
                  <TableCell>상품명</TableCell>
                  {!(isSmallScreen) &&
                    <>
                      <TableCell>가격</TableCell>
                      <TableCell sx={{ whiteSpace: 'nowrap' }}>옵션</TableCell>
                    </>
                  }
                  <TableCell sx={{ whiteSpace: 'nowrap' }}>수량</TableCell>
                  <TableCell >합계</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {orderItems.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <CardMedia
                        component="img"
                        height="50"
                        image={item.img}
                        alt={item.name}
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ maxWidth: '180px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {item.name}
                      </Typography>
                    </TableCell>
                    {!isSmallScreen &&
                      <>
                        <TableCell>
                          <Typography variant="body1" sx={{ fontSize: 'small' }}>{item.price.toLocaleString()}원</Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body1">{item.option}</Typography>
                        </TableCell>
                      </>
                    }
                    <TableCell>
                      <Typography variant="body1">{item.count}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body1" sx={{ fontSize: 'small' }}>{(item.price * item.count).toLocaleString()}원</Typography>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Divider sx={{ mt: 5, mb: 2 }} />
          <Typography variant="h6">배송 정보</Typography>
          <br />
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="받는 분 성함"
              value={name}
              onChange={(e) => setName(e.target.value)}
              sx={{ mt: 1, mb: 1 }}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <CustomButton
              fullWidth
              type="button"
              variant="contained"
              sx={{ mt: 1, mb: 1 }}
              onClick={() => openPostcode({ onComplete: handleComplete })}
            >
              우편번호 찾기
            </CustomButton>
          </Grid>
          <Grid item xs={12}>
            <TextField
              readOnly
              fullWidth
              label="우편번호"
              value={postCode}
              onChange={(e) => setPostCode(e.target.value)}
              sx={{ mt: 1, mb: 1 }}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              readOnly
              fullWidth
              label="주소"
              value={addr}
              onChange={(e) => setAddr(e.target.value)}
              sx={{ mt: 1, mb: 1 }}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="상세주소"
              value={detailAddr}
              onChange={(e) => setDetailAddr(e.target.value)}
              sx={{ mt: 1, mb: 1 }}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="전화번호"
              value={tel}
              onChange={handleTelChange}
              sx={{ mt: 1, mb: 1 }}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="요청사항"
              value={req}
              onChange={(e) => setReq(e.target.value)}
              sx={{ mt: 1, mb: 1 }}
            />
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth sx={{ mt: 1, mb: 1 }}>
              <InputLabel>배송 메세지 선택</InputLabel>
              <Select
                value={messageType}
                label="배송 메세지 선택"
                onChange={(e) => setMessageType(e.target.value)}
              >
                <MenuItem value="">선택해주세요</MenuItem>
                <MenuItem value="message1">배송 전에 미리 연락바랍니다</MenuItem>
                <MenuItem value="message2">부재시 경비실에 맡겨주세요</MenuItem>
                <MenuItem value="message3">부재시 문앞에 놓아주세요</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
        <Grid item xs={12} md={4}>
          <Typography variant="h5" sx={{ mb: 2 }}>결제 정보</Typography>
          <Card sx={{ p: 2 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>총 결제 금액</Typography>
            <Typography variant="h4">{totalPayment.toLocaleString()}원</Typography>
            <CustomButton
              variant="contained"
              color="primary"
              fullWidth
              sx={{ mt: 3 }}
              onClick={handleSendOrder}
            >
              주문하기
            </CustomButton>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Order;
