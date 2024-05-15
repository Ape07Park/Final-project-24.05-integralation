package com.example.ft.dto;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class DashBoardDto {
	private int iid; 	
	private int oid;	
	private int oiid;	
	private String name;	
	private String status;	
	private LocalDateTime regDate;	
	private int price;	
	private int count;	
	private int cost;	
	private int isDeleted;

	// 주문/배송 조회(각 갯수)
	private int orderCount;	//주문완료
	private int payCompleteCount;	// 결제완료
	private int deliveryCount;	// 배송중
	private int delivertcompleteCount; // 배송완료

	// 취소/반품/교환 조회(각 갯수)
	private int cancelCount;	// 취소
	private int returnCount; 	// 반품
	private int exchangeCount;	//교환

	//    품전체기간 상품별 판매액(순이익) top 5
	private int productId;	//제품 아이디
	private String productName;	// 제품 이름
	private int totalRevenue;	// 합계 순이익

	//    전체기간 가장 많이 판매된 상품 X축:이름, Y축:갯수 top 5
	private int totalSoldQuantity;	// 총판매 수

	//    일자별 전체 상품이 판매액(순이익) 라인 그래프
	private int totalPrice;
	private String orderDate;





}
