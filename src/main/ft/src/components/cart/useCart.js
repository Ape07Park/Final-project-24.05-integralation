import { useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { selectUserData } from '../api/firebase';
import { fetchCartItem, deleteCartItem, updateCartItemQuantity } from '../api/cartApi';

const useCart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [currentUserEmail, setCurrentUserEmail] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const auth = getAuth();

  // 유저 인증 상태 변화 감지
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUserEmail(user.email);
      } else {
        setCurrentUserEmail(null);
      }
    });

    return () => unsubscribe();
  }, [auth]);

  // 유저 정보 및 장바구니 아이템 가져오기
  useEffect(() => {
    if (currentUserEmail) {
      const fetchUserInfo = async () => {
        try {
          const info = await selectUserData(currentUserEmail);
          setUserInfo(info);
          setIsAdmin(info && info.isAdmin === 1);
        } catch (error) {
          console.log('사용자 정보를 불러오는 중 에러:', error);
        }
      };

      const fetchCartItems = async () => {
        try {
          const response = await fetchCartItem(currentUserEmail);
          setCartItems(response);
        } catch (error) {
          console.log('장바구니 목록을 불러오는데 실패했습니다:', error);
        }
      };

      fetchUserInfo();
      fetchCartItems();
    }
  }, [currentUserEmail]);

  // 총 가격 계산
  useEffect(() => {
    const calculateTotalPrice = () => {
      const totalPrice = cartItems.reduce((acc, item) => acc + item.totalPrice, 0);
      setTotalCount(totalPrice);
    };

    calculateTotalPrice();
  }, [cartItems]);

  // 아이템 삭제
  const handleDeleteItem = async (cid) => {
    try {
      const isConfirmed = window.confirm('정말 삭제하시겠습니까?');
      if (isConfirmed) {
        const response = await deleteCartItem(currentUserEmail, cid);
        if (response.status === 200) {
          const updatedItems = cartItems.filter((item) => item.cid !== cid);
          setCartItems(updatedItems);
        }
      }
    } catch (error) {
      console.log('상품 삭제 실패:', error);
    }
  };

  // 아이템 수량 변경
  const handleQuantityChange = async (cartId, itemId, itemOption, newQuantity) => {
    try {
      const count = parseInt(newQuantity, 10);

      await updateCartItemQuantity(cartId, currentUserEmail, itemId, itemOption, count);

      const updatedItems = cartItems.map((item) => {
        if (item.cid === cartId) {
          const newTotalPrice = count * item.price;
          return { ...item, count: count, totalPrice: newTotalPrice };
        } else {
          return item;
        }
      });

      setCartItems(updatedItems);
    } catch (error) {
      console.log('상품 수량 업데이트 실패:', error);
    }
  };

  return {
    cartItems,
    totalCount,
    currentUserEmail,
    userInfo,
    isAdmin,
    handleDeleteItem,
    handleQuantityChange,
  };
};

export default useCart;
