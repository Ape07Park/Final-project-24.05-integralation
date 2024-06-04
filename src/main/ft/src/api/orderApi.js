import axios from 'axios';

// order
export const orderHistoryList = async (email) => {
  try {
    const response = await axios.post(`/ft/order/historyList`, { email }); // 데이터 가져오기
    return response.data; // 가져온 데이터 반환
  } catch (error) {
    console.log('데이터를 불러오는 중 에러:', error);
    throw error;
  }
};

export const orderInsert = async (orderData) => {
  try {
    const response = await axios.post('/ft/order/insert', orderData); // 데이터 가져오기
    return response.data; // 가져온 데이터 반환
  } catch (error) {
    console.log('데이터를 불러오는 중 에러:', error);
    throw error;
  }
};

export const confirmPayment = async (requestData) => {
  try {
    const response = await fetch('ft/confirm', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestData),
    });

    const json = await response.json();

    if (!response.ok) {
      throw new Error(json.message);
    }

    return json;
  } catch (error) {
    console.log('Error confirming payment:', error);
    throw error;
  }
};

// 주문 내역 가져오기
export async function fetchOrderHistory(currentUserEmail) {
  try {
    const response = await axios.post('/ft/order/historyList', { email: currentUserEmail });
    return response.data;
  } catch (error) {
    if (error.response) {
      console.log('Failed to fetch order history:', error.response.status, error.response.data);
    } else if (error.request) {
      console.log('Failed to fetch order history: No response from the server.');
    } else {
      console.log('Failed to fetch order history:', error.message);
    }
    console.log(error);
  }
}

// 주문내역 삭제하기
// * updateOrdersCallback:주문이 삭제된 후 최신 주문 내역을 받아와 상태를 업데이트하는 함수
export async function deleteOrderHistory(orderId, email, updateOrdersCallback) {
  const confirmDelete = window.confirm("정말로 주문을 취소하시겠습니까?");
  if (!confirmDelete) return;
  
  try {
    const stringedOrderId = String(orderId);
    await axios.post('/ft/order/orderDelete', { oid: stringedOrderId });
    const updatedOrders = await fetchOrderHistory(email);
    updateOrdersCallback(updatedOrders); // 콜백 함수(setOrders) 호출로 상태 업데이트
  } catch (error) {
    console.log('주문 삭제 실패:', error);
  }
}

// -------- admin 시작--------------

// Admin의 모든 유저 주문내역 불러오기
export const fetchAdminOrderHistory = async (email) => {
  try {
    const response = await axios.post('/ft/order/admin/historyList', { email });
    return response.data;
  } catch (error) {
    console.error('주문 내역을 불러오는데 실패했습니다:', error);
    return [];
  }
};

// Admin의 주문내역 삭제하기
// * updateOrdersCallback:주문이 삭제된 후 최신 주문 내역을 받아와 상태를 업데이트하는 함수
export async function deleteAdminOrderHistory(orderId) {
  const confirmDelete = window.confirm("정말로 주문을 취소하시겠습니까?");
  if (!confirmDelete) return;
  
  try {
    const stringedOrderId = String(orderId);
    await axios.post('/ft/order/orderDelete', { oid: stringedOrderId });
  } catch (error) {
    console.log('주문 삭제 실패:', error);
  }
}

export const nonMembersOrderHistory = async (name, tel) => {
  try {
    const response = await axios.post('/ft/order/nonMembersOrderHistory', { name, tel });
    return response; // 가져온 데이터 반환
  } catch (error) {
    console.log('데이터를 불러오는 중 에러:', error);
    throw error;
  }
};