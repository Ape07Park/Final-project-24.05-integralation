import React, { useEffect, useState } from 'react';
import { FaAngleLeft, FaAngleRight } from 'react-icons/fa';
import '../../css/Calendar.css';
import { onAuthStateChanged, getAuth } from 'firebase/auth';
import { selectUserData } from '../../api/firebase';
import axios from 'axios';
import OrderInfoModal from './OrderInfoModal';

const Calendar = () => {
  const [currentUserEmail, setCurrentUserEmail] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [orders, setOrders] = useState({});
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
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
    }
  }, [currentUserEmail]);

  useEffect(() => {
    if (currentUserEmail) {
      const fetchOrderHistory = async () => {
        try {
          const response = await axios.post('/ft/order/historyList', { email: currentUserEmail });
          const ordersData = response.data.reduce((acc, order) => {
            const date = order.regDate.substring(0, 10); // 날짜 부분만 추출
            if (!acc[date]) {
              acc[date] = [];
            }
            acc[date].push({
              oid: order.oid,
              regDate: order.regDate,
              img1: order.img1, // assuming order object has an imageUrl field
              name: order.name, // assuming order object has a name field
              option: order.option,
              count: order.count, // assuming order object has a quantity field
              status: order.status,
              iid: order.iid,
            });
            return acc;
          }, {});
          setOrders(ordersData);
        } catch (error) {
          if (error.response) {
            console.error('주문 내역을 불러오는데 실패했습니다:', error.response.status, error.response.data);
          } else if (error.request) {
            console.error('주문 내역을 불러오는데 실패했습니다: 서버로부터 응답이 없습니다.');
          } else {
            console.error('주문 내역을 불러오는데 실패했습니다:', error.message);
          }
          setOrders({});
        }
      };
      fetchOrderHistory();
    }
  }, [currentUserEmail]);

  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth() + 1);
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  const handleDateClick = (date, orderDate) => {
    const dateString = `${currentYear}-${String(currentMonth).padStart(2, '0')}-${String(date).padStart(2, '0')}`;
    const orderData = orders[dateString] || [];

    setSelectedOrders(orderDate);
    setIsModalOpen(true);
  };

  const handlePrevMonth = () => {
    if (currentMonth === 1) {
      setCurrentMonth(12);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 12) {
      setCurrentMonth(1);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const renderCalendar = () => {
    const daysInMonth = new Date(currentYear, currentMonth, 0).getDate();
    const startingDay = new Date(currentYear, currentMonth - 1, 1).getDay();
    const weeks = [];
    let currentDay = 1;

    const fillEmptyDays = (count) => {
      const emptyDays = [];
      for (let i = 0; i < count; i++) {
        emptyDays.push(<td key={`empty-${i}`} className="empty-day"></td>);
      }
      return emptyDays;
    };

    while (currentDay <= daysInMonth) {
      const week = [];
      if (weeks.length === 0) {
        week.push(...fillEmptyDays(startingDay));
      }
      for (let i = week.length; i < 7; i++) {
        if (currentDay <= daysInMonth) {
          const dateString = `${currentYear}-${String(currentMonth).padStart(2, '0')}-${String(currentDay).padStart(2, '0')}`;
          const orderCount = orders[dateString] ? new Set(orders[dateString].map(order => order.oid)).size : 0;
          
          const cancelledCount = orders[dateString] ? orders[dateString]
          .filter((order, index, self) => {
            // oid 기준으로 같은 거 필터링
            return (
              index ===
              self.findIndex((o) => o.oid === order.oid && o.status === '취소')
            );
          })
          .filter((order) => order.status === '취소').length
        : 0;


          week.push(
            <td
              key={currentDay}
              className={`calendar-day ${cancelledCount > 0 ? 'has-cancelled-order' : ''}`}
              onClick={() => handleDateClick(currentDay, orders[dateString])}
            >
              <p className="day">
                {currentDay}
                <br />

               

                {cancelledCount > 0 && <span className="cancelled-count">{cancelledCount}건 취소</span>}

                {(orderCount - cancelledCount !== 0
                  ? <span className="total-count">주문:{orderCount - cancelledCount}건</span> 
                  :<></>)} 


              </p>
            </td>
          );
          currentDay++;
        } else {
          week.push(<td key={`empty-${i}`} className="empty-day"></td>);
        }
      }
      weeks.push(<tr key={`week-${currentDay}`} className="calendar-week">{week}</tr>);
    }

    return weeks;
  };

  return (
    <div className="calendar-container">
      <ul className="calendar-header">
        <li className="prev">
          <button className="bt_prev" onClick={handlePrevMonth}>
            <FaAngleLeft /><span>이전달</span>
          </button>
        </li>
        <li className="date">
          <span className="year">{currentYear}년</span>
          <span className="month">{String(currentMonth).padStart(2, '0')}월</span>
        </li>
        <li className="next">
          <button className="bt_next" onClick={handleNextMonth}>
            <span>다음달</span><FaAngleRight />
          </button>
        </li>
      </ul>
      <table>
        <thead>
          <tr>
            <th>월</th> <th>화</th> <th>수</th> <th>목</th> <th>금</th> <th>토</th> <th>일</th>
          </tr>
        </thead>
        <tbody>
          {renderCalendar()}
        </tbody>
      </table>
      <OrderInfoModal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        orders={selectedOrders}
      />
    </div>
  );
};

export default Calendar;
