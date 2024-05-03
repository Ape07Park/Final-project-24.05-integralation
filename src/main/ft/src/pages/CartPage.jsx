import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CartPage = ({ email }) => {
  const [cartItems, setCartItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    // 장바구니 목록을 받아오는 API 호출
    const fetchCartItems = async () => {
      try {
        const response = await axios.get(`/ft/api/carts/list/${email}}`);
        console.log(response.request.status); // 200
        console.log(response.request.statusText) // ok
        setCartItems(response.data); // 전체 장바구니 목록을 설정
        console.log(response.data);
      } catch (error) {
        // alert('Re')
        console.error('장바구니 목록을 불러오는데 실패했습니다:', error);
      }
    };

    fetchCartItems();
  }, [email]);

  useEffect(() => {
    const calculateSubTotal = () => {
      // 선택된 상품의 총 가격 계산
      const sum = cartItems.reduce((acc, curr) => {
        const itemTotal = curr.count * curr.price;
        return acc + itemTotal;
      }, 0);
      // 총 가격을 totalCount 상태에 업데이트
      setTotalCount(sum);
    };

    calculateSubTotal(); // 최초 실행 및 cartItems 변경 시 실행
  }, [cartItems]);

  useEffect(() => {
    // 선택된 상품들의 총 합계 계산
    const calculatetotalCount = () => {
      const sum = selectedItems.reduce((acc, curr) => acc + curr.totalPrice, 0);
      setTotalCount(sum);
    };

    calculatetotalCount();
  }, [selectedItems]);

  // 상품을 선택하는 토글
  const handleToggleItem = (itemId) => {
    const isSelected = selectedItems.some((selectedItem) => selectedItem.iid === itemId);
  
    if (isSelected) {
      // 이미 선택된 상품일 경우 제거
      setSelectedItems((prevItems) => prevItems.filter((item) => item.iid !== itemId));
    } else {
      // 선택되지 않은 상품일 경우 추가
      const selectedItem = cartItems.find((item) => item.iid === itemId);
      setSelectedItems((prevItems) => [...prevItems, selectedItem]);
    }
  };

  const removeFromCart = (itemId) => {
    // 선택한 상품을 장바구니에서 제거
    setCartItems((prevCartItems) => prevCartItems.filter((item) => item.iid !== itemId));
    // 선택한 상품 목록에서도 제거
    setSelectedItems((prevItems) => prevItems.filter((item) => item.iid !== itemId));
  };

  const handleQuantityChange = async (itemId, newQuantity) => {
    try {
      const count = parseInt(newQuantity, 10);
  
      // 수량 업데이트 요청
      await axios.post('/ft/api/carts/update', {
        iid: itemId,
        count: count
      });
  
    // 선택된 상품의 정보를 찾아서 totalPrice를 업데이트
    const updatedItems = cartItems.map(item => {
      if (item.iid === itemId) {
        // 기존 totalPrice 가져오기
        const newTotalPrice = count * item.price;

         // 업데이트된 항목 반환
         return { ...item, count: count, totalPrice: newTotalPrice };
        } else {
          return item; // 업데이트할 항목이 아닌 경우 기존 항목 그대로 반환
        }
      });

    // 업데이트된 상품 목록으로 상태 업데이트
    setCartItems(updatedItems);

    console.log('상품 수량이 업데이트되었습니다.');
  } catch (error) {
    console.error('상품 수량 업데이트 실패:', error);
  }
};

  return (
    <div className="container">
      <div className="jumbotron" style={{ paddingTop: '50px', paddingBottom: '50px' }}>
        <h2>장바구니</h2>
      </div>
      <div className="row" style={{ backgroundColor: '#f7f7f7', borderRadius: '20px', padding: '20px 0' }}>
        <div className="col">
          <input
            type="checkbox"
            id="allChk"
            checked={selectedItems.length === cartItems.length}
            onChange={() => {
              if (selectedItems.length === cartItems.length) {
                setSelectedItems([]);
              } else {
                setSelectedItems([...cartItems]); // 전체 선택 기능 추가
              }
            }}
          />
          <b>전체</b>
        </div>
        <div className="col text-end">
          <button className="btn btn-danger me-2" onClick={() => selectedItems.forEach((item) => removeFromCart(item.iid))}>
            선택 삭제
          </button>
          <button className="btn btn-success">주문하기</button>
        </div>
      </div>
      <div className="row" style={{ paddingTop: '50px' }}>
        <div className="col">
          <table className="table table-hover">
            <thead>
              <tr>
                <th>삭제</th>
                <th>이미지</th>
                <th>상품명</th>
                <th>가격</th>
                <th>수량</th>
                <th>합계</th>
              </tr>
            </thead>
            <tbody>
              {cartItems.map((item) => (
                <tr key={item.iid}>
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedItems.some((selectedItem) => selectedItem.iid === item.iid)}
                      onChange={() => handleToggleItem(item.iid)}
                    />
                  </td>
                  <td>{item.img1}</td>
                  <td>{item.name}</td>
                  <td>
                    {/* 프론트에서 적용하는 방법! */}
                    {/* {saleDate && new Date(item.regDate) >= new Date(saleDate) ? (
                      <span>{item.salePrice}원</span>
                    ) : (
                      <span>{item.price}원</span>
                    )} */}
                     <span>{item.price}원</span>
                  </td>
                  <td>
                    <input
                      type="number"
                      value={item.count}
                      onChange={(e) => handleQuantityChange(item.iid, e.target.value)}
                      min={1}
                      max={item.opcount}
                    />
                  </td>
                  <td>{item.totalPrice}원</td>
                  <td>
                    <button onClick={() => handleToggleItem(item.iid)} className="btn btn-danger">
                      삭제
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div style={{ paddingTop: '20px' }}>
            <div className="text-end">
              <b>총액:</b> {totalCount.toFixed(0)}원
            </div>
            <button className="btn btn-secondary mt-3">쇼핑 계속하기</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
