package com.example.ft.service;

import com.example.ft.dao.CartDaoV2;
import com.example.ft.dto.CartItemRequestDto;
import com.example.ft.dto.CartItemResponseDto;
import com.example.ft.entity.CartItem;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class CartServiceV2Impl implements CartServiceV2{

    private final CartDaoV2 cartDaoV2;
    /**
     * 내가 원하는 기능은 상품 추가 (addToCart):
     * 사용자가 장바구니에 상품을 추가할 때, 이미 해당 상품이 장바구니에 있는지 확인합니다.
     * 만약 이미 있는 상품이면 수량을 증가시키고, 없는 상품이면 새로 추가합니다.
     * 상품의 재고 수량과 사용자가 요청한 수량을 비교하여 재고 부족 여부를 확인합니다.
     * 상품을 장바구니에 추가하기 전에 재고 수량을 확인하여 재고 부족 시 사용자에게 알림을 제공합니다.
     * 사용자가 상품을 선택할 때 해당 상품의 옵션을 함께 선택하도록 구현합니다.
     * 옵션까지 고려하여 장바구니에 추가할 때, 선택된 옵션만 장바구니에 포함되도록 처리합니다.
     */
    @Override
    public CartItemResponseDto findByItemAndOptionId(String email, int iid, int iOid) {
        CartItemResponseDto findCartItem = cartDaoV2.findByItemAndOptionId(email, iid, iOid);
        return findCartItem;
    }

    @Override
    public int addCartItem(CartItemRequestDto requestDto) {
        int result = 0;
        List<CartItemRequestDto.ItemOptionV2> optionList = requestDto.getOptionList();
        // 아이템 옵션을 순회
        for (CartItemRequestDto.ItemOptionV2 itemOption : optionList) {
            int stockCount = cartDaoV2.findCountByItem(requestDto.getIid(), itemOption.getIoid()).getCount();

            CartItemResponseDto existCartItem = cartDaoV2.findByItemAndOptionId(requestDto.getEmail(), requestDto.getIid(), itemOption.getIoid());
            if (existCartItem == null) {    //  장바구니에 없는 상품
                if (stockCount < itemOption.getCount()) {
                    return 0;
                }
                result += cartDaoV2.addCartItem(requestDto.getIid(), requestDto.getEmail(), itemOption.getIoid(), itemOption.getCount());
            } else {    // 장바구니에 있는 상품
                int updateCount = existCartItem.getCount();
                if (stockCount < (existCartItem.getCount() + updateCount)) {
                    return 0;
                }
                result += cartDaoV2.updateCartItem(requestDto.getEmail(), existCartItem.getCid(), (existCartItem.getCount() + updateCount));
            }
        }
        return result;
    }

    @Override
    public List<CartItemResponseDto> findAllByUserEmail(String email) {
        List<CartItemResponseDto> result = cartDaoV2.findAllByUserEmail(email);
        for (CartItemResponseDto item : result) {
            item.calculateTotalPrice();
        }
        return result;
    }

    @Override
    public int deleteCartItem(String email, int[] cids) {
        int result = 0;
        for (int cid : cids) {
            result += cartDaoV2.deleteCartItem(email, cid);
        }
        return result;
    }

    @Override
    public int deleteAllCartItem(String email) {
        int result = cartDaoV2.deleteAllCartItem(email);
        return result;
    }

    @Override
    public int updateCartItem(CartItemRequestDto requestDto) {
        int stockCount = cartDaoV2.findCountByItem(requestDto.getIid(), requestDto.getIoid()).getCount();
        if (stockCount < requestDto.getCount()) {
            return 0;
        }
        int result = cartDaoV2.updateCartItem(requestDto.getEmail(), requestDto.getCid(), requestDto.getCount());
        return result;
    }

	@Override
	public void deletePaymentAllCartItme(int oid) {
		cartDaoV2.deletePaymentAllCartItme(oid);
	}
}
