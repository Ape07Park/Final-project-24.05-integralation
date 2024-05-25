package com.example.ft.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.ft.dto.DashBoardDto;
import com.example.ft.service.DashBoardService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/admin/sales")
public class DashBoardController {
	private final DashBoardService dashBoardService;

    @GetMapping("/status")
    public DashBoardDto getOrderStatusCounts() {
        return dashBoardService.getOrderStatusCounts();
    }

    @GetMapping("/cancel")
    public DashBoardDto getOrderCancellations() {
        return dashBoardService.getOrderCancellAtions();
    }

    //    전체기간 상품별 판매액(순이익) top 5
    @GetMapping("/revenue") // 5개의 수익
    public List<DashBoardDto> getTop5RevenueItems() {
        return dashBoardService.getTop5RevenueItems();
    }
    //    일자별 전체 상품이 판매액(순이익) 라인 그래프
    @GetMapping("/last30days")
    public List<DashBoardDto> getLast30DaysRevenue() {
        return dashBoardService.getWeeklyRevenuesForLast30Days();
    }
    //    전체기간 가장 많이 판매된 상품 X축:이름, Y축:갯수 top 5
    @GetMapping("/sold")
    public List<DashBoardDto> getTop5SoldItems() {
        return dashBoardService.getTop5SoldItems();
    }
	
}
