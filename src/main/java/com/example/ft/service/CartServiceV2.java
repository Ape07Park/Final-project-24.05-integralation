package com.example.ft.service;

import com.example.ft.dto.CartItemRequestDto;
import com.example.ft.dto.CartItemResponseDto;


import java.util.List;

public interface CartServiceV2 {

    CartItemResponseDto findByItemAndOptionId(String email, int iid, int ioid);

    int addCartItem(CartItemRequestDto requestDto);

    List<CartItemResponseDto> findAllByUserEmail(String email);

    int deleteCartItem(String email, int[] cid);

    int deleteAllCartItem(String email);

    int updateCartItem(CartItemRequestDto requestDto);
    
    // 결제 후 장바구니 초기화
    void deletePaymentAllCartItme(int oid);

}
