import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableContainer,
  TableRow,
  Checkbox,
  Input,
  CardMedia,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select, // 추가
} from "@mui/material";

import { useDaumPostcodePopup } from 'react-daum-postcode';
import axios from 'axios';
import { selectUserData, updateUserData } from '../api/firebase';
import { useNavigate } from 'react-router-dom';
import { onAuthStateChanged, getAuth } from 'firebase/auth';

const Order = () => {
  const [cartItems, setCartItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [currentUserEmail, setCurrentUserEmail] = useState(null);
  const [userInfo, setUserInfo] = useState(null);

  const navigate = useNavigate();
  const auth = getAuth();

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
      fetchCartItems();
    }
  }, [currentUserEmail]);

  useEffect(() => {
    fetchCartItems();
  }, [currentUserEmail]);

  const fetchCartItems = async () => {
    try {
      const response = await axios.get(`/ft/api/carts/list/${currentUserEmail}`);
      setCartItems(response.data);
    } catch (error) {
      console.error('장바구니 목록을 불러오는데 실패했습니다:', error);
    }
  };

  // const handleDeleteItem = (cid) => {
  //   axios.delete(`/ft/api/carts/delete/${cid}`)
  //     .then((response) => {
  //       const updatedItems = cartItems.filter((item) => item.cid !== cid);
  //       setCartItems(updatedItems);
  //       console.log('상품이 성공적으로 삭제되었습니다.');
  //     })
  //     .catch((error) => {
  //       console.error('상품 삭제 실패:', error);
  //     });
  // };

  useEffect(() => {
    const calculateSubTotal = () => {
      const sum = cartItems.reduce((acc, curr) => {
        const itemTotal = curr.opcount * curr.price; // opcount로 수정
        return acc + itemTotal;
      }, 0);
      setTotalCount(sum);
    };

    calculateSubTotal();
  }, [cartItems]);

  useEffect(() => {
    const calculateTotalCount = () => {
      const sum = selectedItems.reduce((acc, curr) => acc + curr.totalPrice, 0);
      setTotalCount(sum);
    };

    calculateTotalCount();
  }, [selectedItems]);

  const handleToggleItem = (itemId, itemOption) => {
    const selectedItem = cartItems.find((item) => item.iid === itemId && item.option === itemOption);
    const isSelected = selectedItems.some((item) => item.iid === itemId && item.option === itemOption);

    if (isSelected) {
      setSelectedItems((prevItems) => prevItems.filter((item) => item.iid !== itemId || item.option !== itemOption));
    } else {
      setSelectedItems((prevItems) => [...prevItems, selectedItem]);
    }
  };

  const removeFromCart = (itemId) => {
    setCartItems((prevCartItems) => prevCartItems.filter((item) => item.iid !== itemId));
    setSelectedItems((prevItems) => prevItems.filter((item) => item.iid !== itemId));
  };

  // const handleQuantityChange = async (itemId, newQuantity) => {
  //   try {
  //     const count = parseInt(newQuantity, 10);
  //     await axios.post('/ft/api/carts/update', {
  //       iid: itemId,
  //       count: count
  //     });

  //     const updatedItems = cartItems.map(item => {
  //       if (item.iid === itemId) {
  //         const newTotalPrice = count * item.price;
  //         return { ...item, opcount: count, totalPrice: newTotalPrice }; // opcount로 수정
  //       } else {
  //         return item;
  //       }
  //     });

  //     setCartItems(updatedItems);
  //   } catch (error) {
  //     console.error('상품 수량 업데이트 실패:', error);
  //   }
  // };

  const redirectItem = () => {
    navigate('../CartPage');
  };

  // 유저 관련 
  // user 정보 집어넣기
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [postCode, setPostCode] = useState('');
  const [addr, setAddr] = useState('');
  const [detailAddr, setDetailAddr] = useState('');
  const [tel, setTel] = useState('');
  const [req, setReq] = useState('');

  const [messageType, setMessageType] = useState('');
  const [customMessage, setCustomMessage] = useState('');

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

  // 사용자 정보 업데이트 함수
  const handleUpdate = async () => {
    // 필수 정보가 모두 입력되었는지 확인
    if (!email || !password || !confirmPassword || !name
      || !postCode || !addr || !detailAddr || !tel) {
      alert('모든 필수 정보를 입력해주세요.');
      return;
    }

    // 업데이트할 사용자 정보 객체 생성
    const updatedUserInfo = {
      name: name,
      postCode: postCode,
      addr: addr,
      detailAddr: detailAddr,
      tel: tel,
      req: req
    };


    // 여기 수정하기
    try {
      // 사용자 정보 업데이트 요청
      await updateUserData(updatedUserInfo);
      console.log('사용자 정보가 업데이트되었습니다.');
      // 업데이트 후, 이전 페이지로 이동
      navigate(-1);
    } catch (error) {
      console.error('사용자 정보 업데이트 중 오류:', error);
    }
  };

  // 취소 버튼 클릭 시 이전 페이지로 이동
  const handleCancel = () => {
    navigate(-1);
  };


  // 
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
      <Container fixed>
        <Grid container spacing={3}>

          <Grid item xs={12} sm={8}>
            <Typography variant="h4" sx={{ marginBottom: 2 }}>
              주문하기
            </Typography>

            {/*  구매자 */}
            <Typography variant="h5">
              구매자
            </Typography>
          <Grid item xs={12}>
            <Typography variant="body1">
              <strong>Email: </strong> {userInfo?.email}
            </Typography>
            <Typography variant="body1">
              <strong>Name: </strong> {userInfo?.name}
            </Typography>
            <Typography variant="body1">
              <strong>Phone: </strong> {userInfo?.tel}
            </Typography>
            <Typography variant="body1">
              <strong>postCode: </strong> {userInfo?.postCode}
            </Typography>
            <Typography variant="body1">
              <strong>Address: </strong> {userInfo?.addr}
            </Typography>
            <Typography variant="body1">
              <strong>Detail Address: </strong> {userInfo?.detailAddr}
            </Typography>
            <Typography variant="body1">
              <strong>Delivery Request: </strong> {userInfo?.req}
            </Typography>
          </Grid>
          <hr/>

          {/* 받는 분 */}
          <Typography variant="h5">
              받는 사람
            </Typography>
            <br/>
          <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)} // 이름 입력 시 상태 업데이트
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
                    Find Postal Code
                  </Button>
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="postCode"
                    value={postCode}
                    onChange={(e) => setPostCode(e.target.value)} // 우편번호 입력 시 상태 업데이트
                    required
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Address"
                    value={addr}
                    onChange={(e) => setAddr(e.target.value)} // 주소 입력 시 상태 업데이트
                    required
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Detail Address"
                    value={detailAddr}
                    onChange={(e) => setDetailAddr(e.target.value)} // 상세 주소 입력 시 상태 업데이트
                    required
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Phone Number"
                    value={tel}
                    onChange={handleTelChange} // 전화번호 입력 시 상태 업데이트
                    required
                  />
                </Grid>

                <Grid item xs={12}>
                  <FormControl fullWidth style={{ marginBottom: '5px' }}>
                    <InputLabel id="message-label">-- 선택하세요 --</InputLabel>
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
                      label="-- 선택하세요 --"
                    >
                      <MenuItem value="">-- 선택하세요 --</MenuItem>
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
                  {cartItems.map((item) => (
                    <TableRow key={`${item.iid}-${item.option}`}>
                      <TableCell>
                        <Checkbox
                          checked={selectedItems.some((selectedItem) => selectedItem.iid === item.iid && selectedItem.option === item.option)}
                          onChange={() => handleToggleItem(item.iid, item.option)}
                        />
                      </TableCell>
                      <TableCell>
                        <CardMedia
                          component="img"
                          height="50"
                          image={item.img1} // 이미지 주소로 수정
                          alt={item.name}
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body1" sx={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {item.name}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body1">{item.price}원</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body1">{item.option}</Typography>
                      </TableCell>
                      {/* <TableCell>
                        <Input
                          type="number"
                          value={item.opcount} // opcount로 수정
                          onChange={(e) => handleQuantityChange(item.iid, e.target.value)}
                          inputProps={{ min: 1, max: item.opcount }} // opcount로 수정
                          sx={{ width: '20%' }}
                        />
                      </TableCell> */}
                      <TableCell>
                        <Typography variant="body1">{item.totalPrice}원</Typography>
                      </TableCell>
                      <TableCell>
                        {/* <Button onClick={() => handleDeleteItem(item.cid)} variant="contained" color="error">
                          삭제
                        </Button> */}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            <Button
              variant='contained'
              fullWidth
              onClick={redirectItem}
            >
              쇼핑 계속하기
            </Button>
          </Grid>

          <Grid item xs={12} sm={4}>
            <Typography variant="h4" sx={{ marginBottom: 2 }}>
              결제 정보
            </Typography>
            <Box sx={{ position: "sticky", top: 20 }}>
              <Card sx={{ padding: 2 }}>
                <Typography variant="subtitle1" sx={{ marginBottom: 1 }}>
                  총 상품 가격: {totalCount.toFixed(0)}원
                </Typography>
                <Typography variant="subtitle1" sx={{ marginBottom: 1 }}>
                  배송비: 500,550원
                </Typography>
                <Typography variant="h6" sx={{ marginBottom: 2 }}>
                  총 결제 금액: {totalCount.toFixed(0)}원
                </Typography>
                <Button
                  variant="contained"
                  fullWidth
                // onClick={submitOrder}
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
