package com.example.ft.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class KategorieDto {
	private int iid; 	
	private int oid;	
	private int oiid;	
	private String name;	
	private String option;
	private LocalDateTime regDate;	
	private LocalDateTime startDate;	
	private LocalDateTime endDate;	
	private String category;
	private String company;
	private int totalPrice;
	private int price;	
	private int count;	
	
	// 전체상품, 카테고리별, 제조회사별 조회
	private String itemName;
	private int orderPrice;
	private int itemPrice;
	private int orderCount;
	private String options;
	private LocalDate orderDate;
	
}
