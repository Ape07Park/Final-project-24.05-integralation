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
	
	void insertOrder(Order order);
	
	void deleteOrder(int oid);
	
	/*
	 * orderItem
	 */
	
	List<OrderItem> getOrderItemListByOiid(int oiid);
	
	void insertOrderItemWithOid(OrderItem orderItem);
	
	// email로 주문 내역 가져오기
	List<OrderHistory> getOrderHistoryList(String email);

	// email로 주문 내역 가져오기
	List<OrderHistory> nonMembersOrderHistory(String name, String tel);
	
	// admin의 주문 내역 가져오기 
	List<OrderHistory> getOrderHistoryListForAdmin();
	
	/*
	 * OrderData
	 */
	//
	// status 변경하기
	void statusCheckUpdate(String orderId);
	
	// oid 추출
	int getOid(String orderId);
	
	// 오더Id 확인
	Order oderIdCheck(String orderId);
	
	// oid로 orderItem list
	List<OrderItem> getOrderItems(int oid);
	
	void statusUpdate(Order order);
	
	// oiid 리뷰 여부 수정
	void oiidReviewUpdate(int oiid);
	//
	void orderWayUpdate(int oid, String way);
	
}