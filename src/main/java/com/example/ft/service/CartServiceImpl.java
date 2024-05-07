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
		// 장바구니에 이미 있는 상품인지 확인하기 위해 유저의 이메일을 기준으로 장바구니 항목을 조회합니다.
		List<CartItem> cartItemList = cartDao.listCartItems(cartItem.getEmail());

		
		// 장바구니에 저장된 상품 목록을 조회한 결과가 비어있는 경우 (장바구니가 비어있는 경우)
		if (cartItemList.isEmpty()) {
			// 장바구니에 아무 상품도 없는 경우, 요청받은 상품을 그대로 추가합니다.
			cartItem.setCount(cartItem.getCount()); // 장바구니에 추가할 상품 수량 설정
			cartDao.addToCart(cartItem); // 장바구니에 상품 추가
			return true; // 장바구니에 상품이 성공적으로 추가됨을 반환
		}

		// 장바구니에 이미 상품이 있는 경우
		boolean itemExists = cartDao.checkItemInCart(cartItem.getEmail(), cartItem.getIid(), cartItem.getIoid());

		if (itemExists) {
			// 장바구니에 이미 같은 상품과 옵션이 존재하는 경우
			int stockCount = cartItemList.get(0).getCount(); // 이미 장바구니에 있는 상품의 재고 수량 조회
			int cartItemCount = cartItem.getCount(); // 요청받은 상품의 수량 조회

			// 재고 수량과 요청 수량을 비교하여 처리
			if (stockCount >= cartItemCount) {
				// 장바구니에 이미 있는 상품의 재고 수량이 요청 수량 이상인 경우
				cartItem.setCount(stockCount); // 요청 수량을 재고 수량으로 설정
				return false; // 장바구니에 상품 추가 실패 (재고 부족)
			} else {
				// 장바구니에 이미 있는 상품의 재고 수량이 요청 수량보다 부족한 경우
				cartItem.setCount(cartItemCount); // 요청 수량을 그대로 설정
				cartDao.addToCart(cartItem); // 장바구니에 상품 추가
				return true; // 장바구니에 상품이 성공적으로 추가됨을 반환
			}
		} else {
			// 장바구니에 같은 상품이지만 다른 옵션인 경우
			// 새로운 옵션으로 간주하여 무조건 추가
			cartItem.setCount(cartItem.getCount()); // 장바구니에 추가할 상품 수량 설정
			cartDao.addToCart(cartItem); // 장바구니에 상품 추가
			return true; // 장바구니에 상품이 성공적으로 추가됨을 반환
		}
	}

	@Override
	public List<CartItem> listCartItems(String email) {
		// 유저의 이메일을 기준으로 장바구니에 담긴 상품 목록을 조회합니다.
		List<CartItem> cartItems = cartDao.listCartItems(email);
		int totalCartPrice = 0;

		// 조회된 장바구니 상품 목록을 순회하면서 각 상품의 총 가격과 가격 정보를 설정합니다.
		for (CartItem cartItem : cartItems) {
			cartItem.calculateTotalPrice(); // 각 상품의 총 가격을 계산합니다.
			totalCartPrice += cartItem.getTotalPrice(); // 전체 장바구니 가격에 상품 가격을 더합니다.

			// 세일 날짜와 등록 날짜를 비교하여 가격을 설정합니다.
			if (cartItem.getSaleDate().isEqual(cartItem.getRegDate())
					|| cartItem.getSaleDate().isAfter(cartItem.getRegDate())) {
				cartItem.setPrice(cartItem.getSalePrice()); // 세일 가격을 설정합니다.
			} else {
				cartItem.setPrice(cartItem.getPrice()); // 정가를 설정합니다.
			}
		}

		// 전체 장바구니 가격을 항목으로 만들어서 장바구니 상품 목록에 추가합니다.
		CartItem totalCartPriceItem = new CartItem();
		totalCartPriceItem.setTotalPrice(totalCartPrice);
		cartItems.add(totalCartPriceItem);

		return cartItems; // 최종적으로 설정된 장바구니 상품 목록을 반환합니다.
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