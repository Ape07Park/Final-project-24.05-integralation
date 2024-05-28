package com.example.ft.dao;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

import com.example.ft.dto.KategorieDto;

@Mapper
public interface KategorieDao {

	// 전체 주문상품 조회
	@Select("SELECT " 
			+ " o.regDate AS orderDate, "
			+ " i.name AS itemName, i.iid, " 
			+ " i.category AS category, "
			+ " i.company AS company, "
			+ " io.option AS options, "
			+ " oi.price AS orderPrice, " 
			+ " i.cost AS itemPrice, "
			+ " oi.count AS orderCount " 
			+ "FROM " + " orderitem oi " 
			+ "JOIN " + " item i ON oi.iid = i.iid "
			+ "JOIN " + " `order` o ON oi.oid = o.oid " 
			+ "JOIN " + " itemoption io ON oi.ioid = io.ioid " 
			+ "WHERE "
			+ " o.regDate BETWEEN #{startDate} AND #{endDate}")
	List<KategorieDto> getAllOrderProducts(LocalDate startDate, LocalDate endDate);

	// 카테고리별 상품 조회
	@Select("SELECT "
	        + " i.iid, i.name AS itemName,"
	        + " i.category AS category, "
	        + " i.company AS company, "
	        + " io.option AS options, "
	        + "i.cost AS itemPrice, "
	        + "SUM(oi.count) AS orderCount, "
	        + "oi.price AS orderPrice, "
	        + "o.regDate AS orderDate "
	        + "FROM orderItem oi "
	        + "JOIN item i ON oi.iid = i.iid "
	        + "JOIN `order` o ON oi.oid = o.oid "
	        + "JOIN " + " itemoption io ON oi.ioid = io.ioid " 
	        + "WHERE o.regDate BETWEEN #{startDate} AND #{endDate} "
	        + "group by i.iid, i.company, i.category, io.option, i.name, i.cost, oi.price, o.regDate "
	        + "order by category DESC ")
	List<KategorieDto> getCategoryItemByDateRange(LocalDate startDate, LocalDate endDate);

	// 제조회사별 조회
	@Select("SELECT " 
			+ " i.iid, i.company AS company,"
			+ " i.name AS itemName, " 
			+ " i.category AS category, "
			+ " io.option AS options, "
			+ " i.cost AS itemPrice, " 
			+ "SUM(oi.count) AS orderCount, "
			+ " oi.price AS orderPrice, " 
			+ "o.regDate AS orderDate "
			+ "FROM orderItem oi " 
			+ "JOIN item i ON oi.iid = i.iid " 
			+ "JOIN `order` o ON oi.oid = o.oid " 
			+ "JOIN " + " itemoption io ON oi.ioid = io.ioid " 
			+ "WHERE o.regDate BETWEEN #{startDate} AND #{endDate} "
			+ "GROUP BY i.iid, i.category, i.company, io.option, i.name, i.cost, oi.price, o.regDate "
			+ "order by company DESC ")
	List<KategorieDto> getByCompanyAndDateRange(LocalDate startDate, LocalDate endDate);
}