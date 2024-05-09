package com.example.ft.service;

import java.util.List; 

import com.example.ft.entity.Order;
import com.example.ft.entity.OrderHistory;
import com.example.ft.entity.OrderItem;

public interface OrderService {
	
	/*
	 * order
	 */
	
	List<Order> getOrderListByEmail(String email);
	
	Order getOrderByOid(int oid);
	
	// 주문 집어넣기
	void insertOrder(Order order);
	
	void deleteOrder(int oid);
	
	/*
	 * orderItem
	 */
	
	// 주문 아이템 집어넣기
	void insertOrderItemWithOid(OrderItem orderItem);
	
	List<OrderItem> getOrderItemListByOiid(int oiid);
		
	/*
	 * OrderHistory
	 */
	
	// email로 주문 내역 가져오기
	List<OrderHistory> getOrderHistoryList(String email);
}
