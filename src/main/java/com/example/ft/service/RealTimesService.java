package com.example.ft.service;

import java.util.List;

import com.example.ft.entity.RealTime;

public interface RealTimesService {
	
	List<RealTime> getRealTimeList();
	
	void insertRealTime(String query);
}
