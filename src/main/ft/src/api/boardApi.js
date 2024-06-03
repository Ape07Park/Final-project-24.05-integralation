import axios from 'axios';

// board
export const fetchQnAList = async () => {
  try {
    const response = await axios.get('/ft/board/QnAList'); // 데이터 가져오기
    return response.data; // 가져온 데이터 반환
  } catch (error) {
    console.log('데이터를 불러오는 중 에러:', error);
    throw error;
  }
};

// review
// 리뷰 데이터를 가져오는 함수
export const fetchReviewsData = async (iid) => {
  try {
    const response = await axios.get(`/ft/board/list/review/${iid}`);
    return response;
  } catch (error) {
    throw error;
  }
};

// 문의 데이터를 가져오는 함수
export const fetchQnAData = async (iid) => {
  try {
    const response = await axios.get(`/ft/board/list/QnA/${iid}`);
    return response;
  } catch (error) {
    throw error;
  }
};

export const submitBoard = async (formData) => {
  try {
    const response = await axios.post('/ft/board/insert', formData);
    return response.data;
  } catch (error) {
    console.error('Error submitting review:', error);
    throw error;
  }
};

export const updateBoard = async (formData) => {
  try {
    const response = await axios.post('/ft/board/update', formData);
    return response.data;
  } catch (error) {
    console.log('Error updating review:', error);
    throw error;
  }
};

export const deleteBoard = async (postId) => {
  try {
    const response = await axios.post(`/ft/board/delete/${postId}`);
    return response;
  } catch (error) {
    console.log('Error deleting post:', error);
    throw error;
  }
};

export const adminQnAList = async () => {
  try {
    const response = await axios.get('/ft/board/adminQnAList'); // 데이터 가져오기
    return response.data; // 가져온 데이터 반환
  } catch (error) {
    console.log('데이터를 불러오는 중 에러:', error);
    throw error;
  }
};
