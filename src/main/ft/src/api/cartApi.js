import axios from 'axios';

export const addToCart = async (cartItem) => {
  try {
    const response = await axios.post('/ft/api/v2/carts', cartItem);
    return response.data;
  } catch (error) {
    console.log('장바구니 추가 실패:', error);
    throw error;
  }
};

export const fetchCartItem = async (currentUserEmail) => {
  try {
    const response = await axios.get(`/ft/api/v2/carts/list/${currentUserEmail}`);
    return response.data;
  } catch (error) {
    console.log('장바구니 목록을 불러오는데 실패했습니다:', error);
    throw error;
  }
};

export const deleteCartItem = async (currentUserEmail, cid) => {
  try {
    const response = await axios.delete(`/ft/api/v2/carts/delete/${currentUserEmail}`, {
      data: [cid]
    });
    return response;
  } catch (error) {
    console.log('상품 삭제 실패:', error);
    throw error;
  }
};

export const deleteAllCartItems = async (currentUserEmail) => {
  try {
    const response = await axios.post(`/ft/api/v2/carts/delete/${currentUserEmail}`);
    return response.data;
  } catch (error) {
    console.log('상품 삭제 실패:', error);
    throw error;
  }
};

export const updateCartItemQuantity = async (cartId, currentUserEmail, itemId, itemOption, newQuantity) => {
  try {
    const count = parseInt(newQuantity, 10);
    const response = await axios.post('/ft/api/v2/carts/update', {
      cid: cartId,
      email: currentUserEmail,
      iid: itemId,
      ioid: itemOption,
      count: count,
    });
    return response.data;
  } catch (error) {
    console.log('상품 수량 업데이트 실패:', error);
    throw error;
  }
};