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
public class CartItem {
	private int cid;
	private int iid; // 상품 ID
	private int ioid; // 상품옵션 ID
	private String email; // 사용자 이메일
	private String name;
	private String img1;
	private int count; // 서버에서 가져온 수량, 내가 변경이 가능해야됨
	private int price; // 서버에서 받아온 가격
	private int salePrice;
	private double totalPrice; // 상품 총 가격
	private LocalDateTime saleDate;
	private LocalDateTime regDate;
	private String option;

	public void calculateTotalPrice() {
		LocalDateTime time = LocalDateTime.now();
		if (saleDate == null) {
			// saleDate가 null인 경우 처리, 기본값으로 처리
			this.totalPrice = this.price * this.count;
		} else {
			if (saleDate.isBefore(time) || saleDate.isEqual(time)) {
				this.totalPrice = this.price * this.count;
			} else {
				this.totalPrice = this.salePrice * this.count;
			}
		}
	}
}