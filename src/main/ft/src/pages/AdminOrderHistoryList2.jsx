import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box,
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Divider,
  TableContainer,
  Button,
} from "@mui/material";
import { Modal } from '@mui/material';
import { onAuthStateChanged, getAuth } from 'firebase/auth';
import { selectUserData } from '../api/firebase';
import { useNavigate } from 'react-router-dom';
import TrackerComponent from '../components/TrackerComponent';
import WayModal from '../components/WayModal';

const t_key = process.env.REACT_APP_SWEETTRACKER_KEY;

const AdminOrderHistoryList2 = () => {
  const [currentUserEmail, setCurrentUserEmail] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const navigate = useNavigate();
  const auth = getAuth();
  const [orders, setOrders] = useState([]);
  const [sortedByStatus, setSortedByStatus] = useState(false); // 배송 조회 상태에 따라 정렬 여부

  const [openModal, setOpenModal] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null); // 선택된 주문 ID 상태

  const handleOpenModal = (orderId) => {
    setSelectedOrderId(orderId); // 선택된 주문 ID 설정
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

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
    if (currentUserEmail) {
      const fetchOrderHistory = async () => {
        try {
          const response = await axios.post('/ft/order/admin/historyList', { email: currentUserEmail });
          setOrders(response.data);
          console.log(response);
        } catch (error) {
          if (error.response) {
            console.error('주문 내역을 불러오는데 실패했습니다:', error.response.status, error.response.data);
          } else if (error.request) {
            console.error('주문 내역을 불러오는데 실패했습니다: 서버로부터 응답이 없습니다.');
          } else {
            console.error('주문 내역을 불러오는데 실패했습니다:', error.message);
          }
          setOrders([]);
        }
      };
      fetchOrderHistory();
    }
  }, [currentUserEmail]);

  // Group orders by status
  const groupOrdersByStatus = () => {
    const groupedOrders = orders.reduce((acc, order) => {
      if (!acc[order.status]) {
        acc[order.status] = [];
      }
      acc[order.status].push(order);
      return acc;
    }, {});

    // Move '주문 완료' status to the front
    if (groupedOrders['주문 완료']) {
      const completedOrders = groupedOrders['주문 완료'];
      delete groupedOrders['주문 완료'];
      groupedOrders['주문 완료'] = completedOrders;
    }

    return groupedOrders;
  };

  const DeliveryTracker = (t_invoice) => {
    const carrier_id = 'kr.cjlogistics';
    const width = 400;
    const height = 600;
    const left = (window.innerWidth - width) / 2;
    const top = (window.innerHeight - height) / 2;
    const specs = `width=${width}, height=${height}, left=${left}, top=${top}`;
    window.open(`https://tracker.delivery/#/${carrier_id}/${t_invoice}`, "_blank", specs);
  };

  const handleDelete = async (orderId) => {
    const confirmDelete = window.confirm("정말로 주문을 취소하시겠습니까?");
    if (!confirmDelete) return; // 사용자가 취소를 선택한 경우 함수 종료

    try {
      await axios.post('/ft/order/orderDelete', { oid: orderId });
      console.log('주문 삭제 완료');
      // 여기서 필요하다면 상태를 업데이트하거나 다른 작업을 수행할 수 있습니다.
    } catch (error) {
      console.error('주문 삭제 실패:', error);
    }
  };

  const sortOrdersByOid = () => {
    navigate("/admin/order/list")
  }

  return (
    <Container fixed sx={{ mt: 5, mb: 5 }}>
      <Typography variant="h4" sx={{ marginBottom: 3 }} style={{ textAlign: "center" }}>
        주문 내역
      </Typography>

      <Button onClick={sortOrdersByOid} variant='contained'>
        주문번호별  정렬
      </Button>

      {Object.entries(groupOrdersByStatus()).map(([status, orderList]) => (
        <div key={status}>
          <Typography variant="h6" sx={{ marginBottom: 1 }}>
            {status}
          </Typography>

          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>주문 번호</TableCell>
                  <TableCell>상품명</TableCell>
                  <TableCell>개수</TableCell>
                  <TableCell>가격</TableCell>
                  <TableCell>주문자</TableCell>
                  <TableCell>주문 날짜</TableCell>
                  <TableCell>운송장 번호</TableCell>
                  <TableCell>배송조회</TableCell>
                  <TableCell>주문취소/반품</TableCell>
                  <TableCell>주문취소</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {orderList.map((order, index) => (
                  <TableRow key={index}>
                    <TableCell>{order.oid}</TableCell>
                    <TableCell
                      style={{ cursor: 'pointer' }}
                      onClick={() => { navigate(`/item/detail/${order.iid}`) }}
                    >
                      {order.name.length > 10 ? order.name.substring(0, 10) + '...' : order.name}
                      <br />
                      ({order.option})
                    </TableCell>
                    <TableCell>{order.count}</TableCell>
                    <TableCell>{order.price.toLocaleString()}원</TableCell>
                    <TableCell>{order.email}</TableCell>
                    <TableCell>{order.regDate.substring(0, 10)}</TableCell>
                    <TableCell>
                      <WayModal
                        open={openModal && selectedOrderId === order.oid} // 선택된 주문에만 모달이 열리도록 설정
                        onClose={handleCloseModal}
                        order={order}
                      />
                      {order.way ? (
                        <span onClick={() => handleOpenModal(order.oid)} style={{ cursor: 'pointer' }}>
                          {order.way}
                        </span>
                      ) : (
                        <Button variant="contained" onClick={() => handleOpenModal(order.oid)}>
                          운송장 입력
                        </Button>
                      )}
                    </TableCell>
                    <TableCell>
                      {order.way ? (
                        <div onClick={() => DeliveryTracker(order.way)} style={{ cursor: 'pointer' }}>
                          <TrackerComponent order={order} />
                        </div>
                      ) : order.status}
                    </TableCell>
                    <TableCell>
                      {order.status !== '주문완료' && (
                        <Button variant="contained" color="error" onClick={() => handleDelete(order.oid)}>
                          주문취소
                        </Button>
                      )}
                      {order.status === '주문완료' && (
                        <>
                          <Divider orientation="vertical" flexItem />
                          <Button variant="contained" color="error" onClick={() => handleDelete(order.oid)}>
                            주문취소
                          </Button>
                        </>
                      )}
                    </TableCell>

                    <TableCell style={{color:'red', textAlign:'center'}}>
                      <>
                        <Typography variant='h4'>
                      {order.isDeleted}
                        </Typography>
                      </>
                      </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Divider sx={{ my: 3 }} />
        </div>
      ))}
    </Container>
  );
};

export default AdminOrderHistoryList2;
