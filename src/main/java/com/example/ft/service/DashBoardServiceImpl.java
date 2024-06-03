package com.example.ft.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.example.ft.dao.DashBoardDao;
import com.example.ft.dto.DashBoardDto;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class DashBoardServiceImpl implements DashBoardService {
		private final DashBoardDao dashBoardDao;

		@Override
		public List<DashBoardDto> getTop5RevenueItems() {
			return dashBoardDao.getTop5RevenueItems();
		}

		@Override
		public DashBoardDto getOrderStatusCounts() {
			return dashBoardDao.getOrderStatusCounts();
		}

		@Override
		public DashBoardDto getOrderCancellAtions() {
			return dashBoardDao.getOrderCancellations();
		}

		@Override
		public List<DashBoardDto> getWeeklyRevenuesForLast30Days() {
			return dashBoardDao.getLast30Days();
		}

		@Override
		public List<DashBoardDto> getTop5SoldItems() {
			return dashBoardDao.getTop5SoldItems();
		}
}
