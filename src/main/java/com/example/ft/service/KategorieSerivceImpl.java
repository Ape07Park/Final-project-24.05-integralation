package com.example.ft.service;

import java.time.LocalDate;
import java.util.List;

import org.springframework.stereotype.Service;

import com.example.ft.dao.KategorieDao;
import com.example.ft.dto.KategorieDto;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class KategorieSerivceImpl implements KategorieSerivce {
	
	private final KategorieDao kategorieDao;

	@Override
	public List<KategorieDto> getAllOrderProducts(LocalDate startDate, LocalDate endDate) {
	    return kategorieDao.getAllOrderProducts(startDate, endDate);
	}
	
	@Override
	public List<KategorieDto> getCategoryItemByDateRange(LocalDate startDate, LocalDate endDate) {
	    return kategorieDao.getCategoryItemByDateRange(startDate, endDate);
	}
	
	@Override
	public List<KategorieDto> getByCompanyAndDateRange(LocalDate startDate, LocalDate endDate) {
	    return kategorieDao.getByCompanyAndDateRange(startDate, endDate);
	}
}

