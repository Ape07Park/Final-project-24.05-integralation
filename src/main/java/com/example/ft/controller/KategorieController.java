package com.example.ft.controller;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.ft.dto.KategorieDto;
import com.example.ft.service.KategorieSerivce;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/admin/products")
public class KategorieController {
	private final KategorieSerivce kategorieService;
	
	@GetMapping("/all")
	public List<KategorieDto> getAllOrderProducts(
	    @RequestParam("startDate") LocalDate startDate,
	    @RequestParam("endDate") LocalDate endDate
	) { 
	    return kategorieService.getAllOrderProducts(startDate, endDate);
	}

	@GetMapping("/category")
	public List<KategorieDto> getCategoryItemByDateRange(
	    @RequestParam("startDate") LocalDate startDate,
	    @RequestParam("endDate") LocalDate endDate
	) {
	    return kategorieService.getCategoryItemByDateRange(startDate, endDate);
	}

	@GetMapping("/company")
	public List<KategorieDto> getByCompanyAndDateRange(
	    @RequestParam("startDate") LocalDate startDate,
	    @RequestParam("endDate") LocalDate endDate
	) {
	    return kategorieService.getByCompanyAndDateRange(startDate, endDate);
	}
}
