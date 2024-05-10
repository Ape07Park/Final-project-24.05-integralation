import { createStore } from 'redux';

// 초기 상태 정의
const initialState = {
  orderData: null,
};

// 리듀서 정의
function rootReducer(state = initialState, action) {
  switch (action.type) {
    case 'SET_ORDER_DATA':
      return { ...state, orderData: action.payload };
    default:
      return state;
  }
}

// 스토어 생성
const store = createStore(rootReducer);

export default store;
