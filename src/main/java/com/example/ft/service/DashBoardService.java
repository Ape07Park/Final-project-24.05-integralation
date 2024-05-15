package com.example.ft.service;

import java.util.List;

import com.example.ft.dto.DashBoardDto;

public interface DashBoardService {
	

	
	// Dto를 통해서 주문/배송 현황을 조회 - clear
	DashBoardDto getOrderStatusCounts();
	
	// Dto를 통해서 취소/반품 현황 조회 - clear
	DashBoardDto getOrderCancellAtions();

	// DashBoardDto를 통해서 상품 매출액(순이익)Top5
	List<DashBoardDto> getTop5RevenueItems();
	
	// Dto를 통해서 30일 기준으로 (주간) 매출액 조회
	List<DashBoardDto> getWeeklyRevenuesForLast30Days();
	
	// Dto를 통해서 가장많이 팔린 상품 갯수 조회
	List<DashBoardDto> getTop5SoldItems();
	
}
