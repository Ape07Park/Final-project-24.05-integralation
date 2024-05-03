package com.example.ft.service;

import java.util.List;
import org.springframework.stereotype.Service;

import com.example.ft.dao.CartDao;
import com.example.ft.entity.CartItem;
import com.example.ft.entity.CartItemRequest;


import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CartServiceImpl implements CartService {

    private final CartDao cartDao;

    @Override
    public boolean addToCart(CartItemRequest cartItem) {
    	//	CartDao 에서 아이템의 정보들을 불러옴 근데 이거는 진짜 불필요한 로직입니다.
    	// 사유는 ItemDao에서 단순하게 갔고오면 되는건데 굳이 join을 걸어가면서 할 필요가 없기 떄문에 추후에 수정하는 걸로 하구요!
    	List<CartItem> cartItemList = cartDao.listCartItems(cartItem.getEmail());
    	//	가져온 데이터들의 첫번째로 하드 코딩 했습니다. 이유는 한개씩 추가할거니까요!
    	// 그래서 장바구니에 추가하려는 아이템의 count를 가져와서 stockCount라는 변수에 할당 == 재고
    	 // cartItemList가 비어있는 경우 처리
        if (cartItemList.isEmpty()) {
            // 장바구니에 아무것도 없는 경우
            cartItem.setCount(cartItem.getCount());
            cartDao.addToCart(cartItem);
            return true;
        }

        // cartItemList가 비어있지 않은 경우
        int stockCount = cartItemList.get(0).getCount();
        int cartItemCount = cartItem.getCount();

        // 재고 수량과 요청 수량 비교
        if (stockCount >= cartItemCount) {
            cartItem.setCount(stockCount);
            return false;
        } else {
            cartItem.setCount(cartItemCount);
            cartDao.addToCart(cartItem);
            return true;
        }
    }

    @Override
    public List<CartItem> listCartItems(String email) {
        List<CartItem> cartItems = cartDao.listCartItems(email);
        int totalCartPrice = 0;

        for (CartItem cartItem : cartItems) {
            cartItem.calculateTotalPrice();
            totalCartPrice += cartItem.getTotalPrice();
            // 우선 sale >= reg 나는 세일가격을 보여줄거야
            // 세일날이 등록일보다 높으면 세일가격이 보여주게 하고
            // 반대이면 정가가 보이게한다.
            // 작은 시간 isAfter 많으시간 false
            if (cartItem.getSaleDate().isEqual(cartItem.getRegDate()) || 
            	cartItem.getSaleDate().isAfter(cartItem.getRegDate())) {
            	cartItem.setPrice(cartItem.getSalePrice());

            } else {
            	cartItem.setPrice(cartItem.getPrice());
            }
        }

        CartItem totalCartPriceItem = new CartItem();
        totalCartPriceItem.setTotalPrice(totalCartPrice);


        return cartItems;
    }

    
    @Override
    public void deleteCartItem(int iid) {
        cartDao.deleteCartItem(iid);
    }

    @Override
    public void deleteAllCarts() {
        cartDao.deleteAllCarts();
    }

    @Override
    public void updateCartItem(int iid, int newCount) {
        // 장바구니 항목 조회
        CartItem cartItem = cartDao.findCartItemByIid(iid);
        
        if (cartItem != null) {
            // 수량 업데이트
            cartItem.setCount(newCount);
            
            // 업데이트된 장바구니 항목 저장
            cartDao.updateCartItem(iid, newCount);
        } else {
            // 해당 상품이 장바구니에 없는 경우, 예외 처리 또는 로그 처리
            throw new IllegalArgumentException("CartItem not found for iid: " + iid);
        }
    }

    @Override
    public CartItem findCartItemByIid(int iid) {
        return cartDao.findCartItemByIid(iid);
    }
}