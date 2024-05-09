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
@ToString
@NoArgsConstructor
@AllArgsConstructor
@Builder   // 원하는 데이터만 골라서 처리 하겠다.
public class OrderHistory {
	private int oid;           
	private String status;   
	private int totalPrice; 
	private int count;
	private int price;
	private String name;   
	private String img;
	private LocalDateTime regDate;
	
	// 주문 날짜 추가할 것, option 추가할 것 
	
}
