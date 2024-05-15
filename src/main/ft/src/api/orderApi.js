import axios from 'axios';

// order
export const orderHistoryList = async (email) => {
  try {
    const response = await axios.post(`/ft/order/historyList`, { email }); // 데이터 가져오기
    return response.data; // 가져온 데이터 반환
  } catch (error) {
    console.error('데이터를 불러오는 중 에러:', error);
    throw error;
  }
};