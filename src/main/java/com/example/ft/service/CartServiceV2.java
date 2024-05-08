package com.example.ft.service;


import java.util.List;

import com.example.ft.entity.CartItemRequestDto;
import com.example.ft.entity.CartItemResponseDto;

public interface CartServiceV2 {

    CartItemResponseDto findByItemAndOptionId(String email, int iid, int ioid);

    int addCartItem(CartItemRequestDto requestDto);

    List<CartItemResponseDto> findAllByUserEmail(String email);

    int deleteCartItem(String email, int[] cid);

    int deleteAllCartItem(String email);

    int updateCartItem(CartItemRequestDto requestDto);

}
