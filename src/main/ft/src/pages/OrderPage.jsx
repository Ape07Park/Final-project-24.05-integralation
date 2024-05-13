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
  Checkbox,
  CardMedia,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Divider, // 추가
} from "@mui/material";
import { nanoid } from "nanoid";
import { useDaumPostcodePopup } from 'react-daum-postcode';

import { selectUserData } from '../api/firebase';
import { useNavigate } from 'react-router-dom';
import { onAuthStateChanged, getAuth } from 'firebase/auth';

const Order = () => {
  const [cartItems, setCartItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [totalCount, setTotalCount] = useState(0);


  // order
  const [orderItems, setOrderItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0); // 총 결제 금액 추가
  const [totalPayment, setTotalPayment] = useState(0);

  // user
  const [currentUserEmail, setCurrentUserEmail] = useState(null);
  const [userInfo, setUserInfo] = useState(null);

  const navigate = useNavigate();
  const auth = getAuth();

  const [orderId, setOrderId] = useState(null);
  
  useEffect(() => {
    setOrderId(nanoid())
  }, [])

  // ======== 로그인한 유저정보 불러오기 ==========
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
      // fetchCartItems();
    }
  }, [currentUserEmail]);

  useEffect(() => {
    // fetchCartItems();
  }, [currentUserEmail]);

  // ======== 로그인한 유저정보 불러오기 끝 ==========

  // ======== 아이템 정보 불러오기  ==========

  useEffect(() => {
    // Get orderItems from location state
    const locationState = window.history.state;
    if (locationState && locationState.orderItems) {
      setOrderItems(locationState.orderItems);
    } else {
      // 로컬스토리지에서 orderItems를 가져옵니다.
      const storedOrderItems = JSON.parse(localStorage.getItem('orderItems'));
      if (storedOrderItems) {
        setOrderItems(storedOrderItems);
      }
    }
  }, []);

  // ======== 아이템 정보 불러오기 끝 ==========

  // ======== 아이템 총 금액 계산 ==========
  useEffect(() => {
    // 주문 아이템이 변경될 때마다 총 결제 금액을 다시 계산
    const calculateTotalPayment = () => {
      // 주문 아이템의 가격과 수량을 곱하여 총 결제 금액 계산
      const totalPrice = orderItems.reduce((acc, item) => acc + (item.price * item.count), 0);
      setTotalPayment(totalPrice);
    };

    calculateTotalPayment();
  }, [orderItems]);

  // ======== 아이템 총 금액 계산 끝 ==========

  // ======== order로 통합하기 ==========

  // order로 통합하기 
  useEffect(() => {
    // Get orderItems from location state
    const locationState = window.history.state;
    if (locationState && locationState.orderItems) {
      setOrderItems(locationState.orderItems);
    } else {
      // 로컬스토리지에서 orderItems를 가져옵니다.
      const storedOrderItems = JSON.parse(localStorage.getItem('orderItems'));
      if (storedOrderItems) {
        setOrderItems(storedOrderItems);
      }
    }
  }, []);

  const handleSendOrder = async () => {
    // 필수 정보가 모두 입력되었는지 확인
    if (!name || !postCode || !addr || !detailAddr || !tel) {
      alert('모든 필수 정보를 입력해주세요.');
      return;
    }

    try {
        // 입력된 정보를 객체로 만듦
        const order = {
            email: currentUserEmail,
            name: name,
            postCode: postCode,
            addr: addr,
            detailAddr: detailAddr,
            tel: tel,
            req: req,
            totalPrice: totalPrice, // 총 결제 금액 추가
            orderId: orderId,
        };
    
        const orderItemData = orderItems.map(orderItem => ({
            iid: orderItem.iid,
            ioid: orderItem.ioid,
            count: orderItem.count,
            price: orderItem.price,
            oid: null // oid를 초기화합니다.
        }));

        console.log(orderItemData);

        // 서버로 전송할 데이터 구조 수정
        const data = {
            order: order,  // 주문 정보
            orderItems: orderItemData  // 주문 아이템 정보
        };

        navigate('/checkout', { state: { orderData: data } });

        // 모든 주문이 성공적으로 생성되었을 때 메시지 출력
        alert('주문이 성공적으로 생성되었습니다.');
        
    } catch (error) {
        console.error('주문 처리 중 오류:', error);
        alert('주문 생성 중 오류가 발생했습니다.');
    }
  };


  useEffect(() => {
    // 주문 아이템이 변경될 때마다 총 결제 금액을 다시 계산
    const calculateTotalPayment = () => {
      // 주문 아이템의 가격과 수량을 곱하여 총 결제 금액 계산
      const totalPrice = orderItems.reduce((acc, item) => acc + (item.price * item.count), 0);
      setTotalPrice(totalPrice);
    };

    calculateTotalPayment();
  }, [orderItems]);
  // ----------------------- user 관련 -------------------------------

  // =================== 자동으로 구매자 정보 들어가게 함 ============

  // useState는 함수 컴포넌트에서 어떤 상태(state)를 관리
  const [name, setName] = useState('');
  const [postCode, setPostCode] = useState('');
  const [addr, setAddr] = useState('');
  const [detailAddr, setDetailAddr] = useState('');
  const [tel, setTel] = useState('');
  const [req, setReq] = useState('');
  const [messageType, setMessageType] = useState('');
  const [customMessage, setCustomMessage] = useState('');

  useEffect(() => { // 컴포넌트가 렌더링될 때마다 실행되기 때문에, 기본적으로 매 렌더링마다 실행됩니다. 
    // 두 번째 인자로 배열을 전달하여 특정 상황에만 실행되도록 제어
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

  // =================== 자동으로 구매자 정보 들어가게 함 끝============

  // =========================== 받는 사람 정보 보내기 함수 ======================


  // ================ 받는 사람 정보 입력 ===================

  // Daum 우편번호 팝업 관련 함수
  const openPostcode = useDaumPostcodePopup("//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js");

  // Daum 우편번호 팝업에서 주소 선택 시 호출되는 함수
  const handleComplete = data => {
    let fullAddress = data.address; // 선택된 주소
    let extraAddress = '';
    let postCode = data.zonecode; // 우편번호

    if (data.addressType === 'R') {
      if (data.bname !== '') {
        extraAddress += data.bname;
      }
      if (data.buildingName !== '') {
        extraAddress += extraAddress !== '' ? `, ${data.buildingName}` : data.buildingName;
      }
      fullAddress += extraAddress !== '' ? ` (${extraAddress})` : '';
    }
    // 주소 설정
    setAddr(fullAddress);
    setPostCode(postCode);
  }

  // 취소 버튼 클릭 시 이전 페이지로 이동
  const handleCancel = () => {
    navigate(-1);
  };

  const handleTelChange = (e) => {
    const { value } = e.target;

    // 숫자 이외의 문자 제거
    const telValue = value.replace(/[^0-9]/g, '');

    // 하이픈(-) 추가
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

    // 최대 길이 제한을 넘지 않도록 자르기
    const maxLength = 13; // 최대 길이는 13자리 (010-1234-5678)
    const updatedTel = formattedTel.slice(0, maxLength);

    // 상태 업데이트
    setTel(updatedTel);
  };

  const handleMessageChange = (e) => {
    const selectedMessageType = e.target.value;
    setMessageType(selectedMessageType);
    if (selectedMessageType !== '직접 입력') {
      setCustomMessage('');
    }
  };

  return (
    <>
      <Container fixed sx={{ mb: 5 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={8}>
            <Typography variant="h4" sx={{ marginBottom: 2 }}>
              주문하기
            </Typography>
            <Typography variant="h6">
              담긴 상품
            </Typography>
            <TableContainer sx={{ maxWidth: '100%', overflowX: 'auto' }}>
              <Table className="table table-hover">
                <TableHead>
                  <TableRow>
                    <TableCell></TableCell>
                    <TableCell>이미지</TableCell>
                    <TableCell>상품명</TableCell>
                    <TableCell>가격</TableCell>
                    <TableCell>옵션</TableCell>
                    <TableCell>수량</TableCell>
                    <TableCell>합계</TableCell>
                    <TableCell>삭제</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {orderItems.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <Checkbox
                          checked={selectedItems.some((selectedItem) => selectedItem.iid === item.iid && selectedItem.option === item.option)}
                        />
                      </TableCell>
                      <TableCell>
                        <CardMedia
                          component="img"
                          height="50"
                          
                          image={item.img} // 이미지 주소로 수정
                          alt={item.name}
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body1" sx={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {item.name}
                        </Typography>
                      </TableCell>

                      <TableCell>
                        <Typography variant="body1">{item.price.toLocaleString()}원</Typography> {/* toLocaleString() 함수를 사용하여 원화 형식으로 표시*/}
                      </TableCell>
                      <TableCell>
                        <Typography variant="body1">{item.option}</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body1">{item.count}</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body1">{(item.price * item.count).toLocaleString()}원</Typography>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <Divider sx={{ mt: 5, mb: 2 }} />
            <Typography variant="h6">
              배송 정보
            </Typography>
            <br />
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="받는 분 성함"
                value={name}
                onChange={(e) => setName(e.target.value)} // 이름 입력 시 상태 업데이트
                sx={{ mt: 1, mb: 1 }}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                fullWidth
                type="button"
                variant="contained"
                sx={{ mt: 1, mb: 1 }}
                onClick={() => openPostcode({ onComplete: handleComplete })}
              >
                우편번호 찾기
              </Button>
            </Grid>

            <Grid item xs={12}>
              <TextField
                readOnly
                fullWidth
                label="우편번호"
                value={postCode}
                onChange={(e) => setPostCode(e.target.value)} // 우편번호 입력 시 상태 업데이트
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
                onChange={(e) => setAddr(e.target.value)} // 주소 입력 시 상태 업데이트
                sx={{ mt: 1, mb: 1 }}
                required
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="상세주소"
                value={detailAddr}
                onChange={(e) => setDetailAddr(e.target.value)} // 상세 주소 입력 시 상태 업데이트
                sx={{ mt: 1, mb: 1 }}
                required
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="연락처"
                value={tel}
                onChange={handleTelChange} // 전화번호 입력 시 상태 업데이트
                sx={{ mt: 1, mb: 1 }}
                required
              />
            </Grid>

            <Grid item xs={12} sx={{ mt: 1, mb: 1 }}>
              <FormControl fullWidth style={{ marginBottom: '5px' }}>
                <InputLabel id="message-label">배송 시 요청사항</InputLabel>
                <Select
                  labelId="message-label"
                  id="message"
                  value={messageType}
                  onChange={(e) => {
                    const selectedMessageType = e.target.value;
                    setMessageType(selectedMessageType);
                    // 선택한 메시지 유형이 '직접 입력'이 아니면 req를 선택한 메시지로 설정
                    if (selectedMessageType !== '직접 입력') {
                      setReq(selectedMessageType);
                    }
                  }}
                  label="배송 시 요청사항"
                >
                  <MenuItem value="배송 전 연락바랍니다.">배송 전 연락바랍니다.</MenuItem>
                  <MenuItem value="경비실에 맡겨주세요.">경비실에 맡겨주세요.</MenuItem>
                  <MenuItem value="집앞에 놔주세요.">집앞에 놔주세요.</MenuItem>
                  <MenuItem value="택배함에 놔주세요.">택배함에 놔주세요.</MenuItem>
                  <MenuItem value="부재시 핸드폰으로 연락주세요.">부재시 핸드폰으로 연락주세요.</MenuItem>
                  <MenuItem value="부재시 경비실에 맡겨주세요.">부재시 경비실에 맡겨주세요.</MenuItem>
                  <MenuItem value="부재시 집 앞에 놔주세요.">부재시 집 앞에 놔주세요.</MenuItem>
                  <MenuItem value="직접 입력">직접 입력</MenuItem>
                </Select>
              </FormControl>
              {/* 직접 입력이 선택됐을 때만 TextField 표시 */}
              {messageType === '직접 입력' && (
                <TextField
                  fullWidth
                  label="Delivery Request"
                  value={req} // 선택한 값이 req로 전달되도록 수정
                  onChange={(e) => setReq(e.target.value)} // 배송 요청 입력 시 상태 업데이트
                />
              )}
            </Grid>

              <Divider
                sx={{ mt: 2, mb: 2 }}
              />
            </Grid>

          <Grid item xs={12} sm={4}>
            <Typography variant="h4" sx={{ marginBottom: 2 }}>
              결제 정보
            </Typography>
            <Box sx={{ position: "sticky", top: 20 }}>
              <Card sx={{ padding: 2 }}>
                <Typography variant="subtitle1" sx={{ marginBottom: 1 }}>
                  총 상품 가격: {totalPayment.toLocaleString()}원 {/* 총 상품 가격 표시 */}
                </Typography>
                <Typography variant="subtitle1" sx={{ marginBottom: 1 }}>
                  배송비: 원
                </Typography>
                <Typography variant="h6" sx={{ marginBottom: 2 }}>
                  총 결제 금액: {totalPayment.toLocaleString()}원 {/* 총 결제 금액 표시 */}
                </Typography>
                <Button
                  variant="contained"
                  fullWidth
                  onClick={handleSendOrder}
                >
                  결제하기
                </Button>
              </Card>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </>
  );
};

export default Order;