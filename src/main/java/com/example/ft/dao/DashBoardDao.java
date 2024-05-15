package com.example.ft.dao;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

import com.example.ft.dto.DashBoardDto;

@Mapper
public interface DashBoardDao {

	// 주문/배송 조회(각 갯수)
	@Select("SELECT " +
			"    SUM(IF(status = '결제대기중', 1, 0)) AS waitingPayCount," +
			"    SUM(IF(status = '주문완료', 1, 0)) AS orderCount," +
			"    SUM(IF(status = '결제완료', 1, 0)) AS payCompleteCount, " +
			"    SUM(IF(status = '배송중', 1, 0)) AS deliveryCount," +
			"    SUM(IF(status = '배송완료', 1, 0)) AS delivertcompleteCount " +
			"FROM " +
			"    `order`")
	DashBoardDto getOrderStatusCounts();
	
	// 취소/반품/교환 조회(각 갯수)
	@Select("SELECT " +
			"    SUM(IF(status = '취소', 1, 0)) AS cancelCount," +
			"    SUM(IF(status = '반품', 1, 0)) AS returnCount," +
			"    SUM(IF(status = '교환', 1, 0)) AS exchangeCount " +
			"FROM " +
			"    `order`")
	DashBoardDto getOrderCancellations();

	//    품전체기간 상품별 판매액(순이익) top 5
	@Select("select i.iid as productId," +
			"       i.name as productName," +
			"       sum((oi.price - i.cost) * oi.count) as totalRevenue " +
			"from `order` o " +
			"left join orderItem oi " +
			"on oi.oid = o.oid " +
			"left join item i " +
			"on i.iid = oi.iid " +
			"where o.status = '배송완료' and o.isDeleted = 0 " +
			"group by i.iid, i.name " +
			"order by totalRevenue desc limit 5")
    List<DashBoardDto> getTop5RevenueItems();

    // 최근 30일간 판매추이
    @Select("select sum(totalPrice) as totalPrice, DATE_FORMAT(regDate, '%m-%d') AS orderDate " +
			"from `order` o " +
			"group by regDate,status, isDeleted " +
			"having o.regDate >= DATE_SUB(CURDATE(), INTERVAL 30 DAY) AND o.status = '배송완료' AND o.isDeleted = 0 " +
			"order by regDate asc")
    List<DashBoardDto> getLast30Days();

    // 가장 많이 팔린 상품 Top 5
    @Select("SELECT i.iid AS productId, i.name AS productName, SUM(oi.count) AS totalSoldQuantity " +
            "FROM `order` o JOIN orderItem oi ON o.oid = oi.oid JOIN item i ON oi.iid = i.iid " +
            "WHERE o.status = '배송완료' AND o.isDeleted = 0 " +
            "GROUP BY i.iid, i.name ORDER BY totalSoldQuantity DESC LIMIT 5")
    List<DashBoardDto> getTop5SoldItems();
}
