package com.example.ft.entity;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
@Builder
public class CartItemRequest {
	private int iid;
	private String email;
	private int ioid;
	private int count;

	public CartItem toCartItem(int price, int salePrice, LocalDateTime saleDate, LocalDateTime regDate, String option) {
        CartItem cartItem = new CartItem();
        cartItem.setIid(this.iid);
        cartItem.setEmail(this.email);
        cartItem.setCount(this.count);
        cartItem.setPrice(price);
        cartItem.setSalePrice(salePrice);
        cartItem.setSaleDate(saleDate);
        cartItem.setRegDate(regDate);
        cartItem.setOption(option);
        cartItem.calculateTotalPrice(); // 총 가격 계산
        return cartItem;
    }
}