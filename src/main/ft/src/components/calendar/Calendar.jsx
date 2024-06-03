import React, { useEffect, useState } from 'react';
import { FaAngleLeft, FaAngleRight } from 'react-icons/fa';
import '../../css/Calendar.css';
import { onAuthStateChanged, getAuth } from 'firebase/auth';
import { selectUserData } from '../../api/firebase';
import OrderInfoModal from './OrderInfoModal';
import { fetchAdminOrderHistory } from '../../api/orderApi';

const Calendar = () => {
  const [currentUserEmail, setCurrentUserEmail] = useState(null);
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
        } catch (error) {
          console.log('사용자 정보를 불러오는 중 에러:', error);
        }
      };
      fetchUserInfo();
    }
  }, [currentUserEmail]);

  useEffect(() => {
    const fetchOrderHistory = async () => {
      if (currentUserEmail) {
        try {
          const response = await fetchAdminOrderHistory(currentUserEmail);
          const ordersData = (response || []).reduce((acc, order) => {
            const date = order.regDate.substring(0, 10);
            if (!acc[date]) {
              acc[date] = [];
            }
            acc[date].push({
              oid: order.oid,
              regDate: order.regDate,
              img1: order.img1,
              name: order.name,
              option: order.option,
              count: order.count,
              status: order.status,
              iid: order.iid,
              totalPrice: order.totalPrice,
            });
            return acc;
          }, {});
          setOrders(ordersData);
        } catch (error) {
          if (error.response) {
            console.log('주문 내역을 불러오는데 실패했습니다:', error.response.status, error.response.data);
          } else if (error.request) {
            console.log('주문 내역을 불러오는데 실패했습니다: 서버로부터 응답이 없습니다.');
          } else {
            console.log('주문 내역을 불러오는데 실패했습니다:', error.message);
          }
          setOrders({});
        }
      }
    };
    fetchOrderHistory();
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
          
          const totalPrice = orders[dateString]
            ? [...new Set(orders[dateString].map(order => order.oid))]
                .map(oid => orders[dateString].find(order => order.oid === oid))
                .filter(order => order.status !== '취소')
                .map(order => order.totalPrice) 
                .reduce((acc, curr) => acc + curr, 0) 
            : 0;
          
            const cancelledCount = orders[dateString] ? orders[dateString]
              .filter((order, index, self) => {
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
              <p style={{textAlign:'left'}}>
                <span>
                  {currentDay}
                </span>
                <br />
                {(orderCount - cancelledCount !== 0
                  ? <span className="total-count">주문: {orderCount - cancelledCount}건</span> 
                  :<></>)}
                <br />
                {cancelledCount > 0 && <span className="cancelled-count">취소: {cancelledCount}건</span>}
                {totalPrice > 0 && 
                  <>
                    <div style={{fontSize:'0.8em'}}>총 판매가 :</div>
                    <div style={{fontSize:'0.9em'}}>{totalPrice.toLocaleString()}원</div>
                  </>
                }
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
      <table className='claendarTable'>
        <thead>
          <tr>
            <th className='t0'>일</th><th>월</th><th>화</th><th>수</th><th>목</th><th>금</th><th className='t6'>토</th>
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
