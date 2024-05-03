package com.example.ft.service;

import java.util.List;

import com.example.ft.entity.CartItem;
import com.example.ft.entity.CartItemRequest;

public interface CartService {

    boolean addToCart(CartItemRequest cartItem);

    List<CartItem> listCartItems(String email);

    void updateCartItem(int iid, int count);

    void deleteCartItem(int iid);
    
    void deleteAllCarts();

    CartItem findCartItemByIid(int iid);

}