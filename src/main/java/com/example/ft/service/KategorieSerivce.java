package com.example.ft.service;

import java.time.LocalDate;
import java.util.List;

import com.example.ft.dto.KategorieDto;

public interface KategorieSerivce {

	// 전체 주문상품 조회
	List<KategorieDto> getAllOrderProducts(LocalDate startDate, LocalDate endDate);
	
	// 카테고리별 상품 조회
	List<KategorieDto> getCategoryItemByDateRange(LocalDate startDate, LocalDate endDate);
	
	// 제조회사별 조회
	List<KategorieDto> getByCompanyAndDateRange(LocalDate startDate, LocalDate endDate);
	
}
