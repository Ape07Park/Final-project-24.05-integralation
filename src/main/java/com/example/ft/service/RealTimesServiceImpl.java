package com.example.ft.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.ft.dao.ItemDao;
import com.example.ft.dao.RealTimeDao;
import com.example.ft.entity.RealTime;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class RealTimesServiceImpl implements RealTimesService{
	private final RealTimeDao realTimeDao;

	@Override
	public List<RealTime> getRealTimeList() {
		return realTimeDao.getRealTimeList();
	}

	@Override
	public void insertRealTime(String query) {
		realTimeDao.insertRealTime(query);
	}
}