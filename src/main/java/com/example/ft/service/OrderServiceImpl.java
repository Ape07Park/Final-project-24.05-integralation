package com.example.ft.service;

import java.util.List;  

import org.apache.ibatis.annotations.Update;
import org.springframework.stereotype.Service;

import com.example.ft.dao.OrderDao;
import com.example.ft.entity.Order;
import com.example.ft.entity.OrderHistory;
import com.example.ft.entity.OrderItem;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class OrderServiceImpl implements OrderService {
	private final OrderDao orderDao;

	/*
	 * order
	 */
	
	@Override
	public Order getOrderByOid(int oid) {
		return orderDao.getOrderByOid(oid);
	}
	
	// 주문 했던 것들 리스트로 다 띄우기 
	@Override
	public List<Order> getOrderListByEmail(String email) {
		return orderDao.getOrderListByEmail(email);
	}
	
	@Override
	public void insertOrder(Order order) {
		orderDao.insertOrder(order);
	}

	@Override
	public void deleteOrder(int oid) {
		orderDao.deleteOrder(oid);
	}
		
	/*
	 * orderItem
	 */
	
	@Override
	public List<OrderItem> getOrderItemListByOiid(int oiid) {
		return orderDao.getOrderItemListByOiid(oiid);
	}

	@Override
	public void insertOrderItemWithOid(OrderItem orderItem) {
	    orderDao.insertOrderItemWithOid(orderItem); // 수정 필요
	}

	// 주문 했던 것들 리스트로 다 띄우기  - 사용 중
	@Override
	public List<OrderHistory> getOrderHistoryList(String email) {
		return orderDao.getOrderHistoryList(email);
	}
	
	// 주문 했던 것 다 띄우기 - admin용 
	@Override
	public List<OrderHistory> getOrderHistoryListForAdmin() {
		
		return orderDao.getOrderHistoryListForAdmin();
	}
	
	//
	@Override
	public void statusCheckUpdate(String orderId) {
		String status = "주문완료";
		orderDao.statusCheckUpdate(status, orderId);
	}

	@Override
	public Order oderIdCheck(String orderId) {
		return orderDao.oderIdCheck(orderId);
	}

	@Override
	public int getOid(String orderId) {
		return orderDao.getOid(orderId);
	}

	@Override
	public List<OrderItem> getOrderItems(int oid) {
		return orderDao.getOrderItems(oid);
	}

	@Override
	public void statusUpdate(Order order) {
		orderDao.statusUpdate(order);
	}

	@Override
	public void orderWayUpdate(int oid, String way) {
	    // oid로 order 가져오기
	    Order order = orderDao.getOrderByOid(oid);

	    // way 업데이트
	    order.setWay(way);

	    // Save the updated order
	    orderDao.orderWayUpdate(order);
	}

	@Override
	public void oiidReviewUpdate(int oiid) {
		orderDao.oiidReviewUpdate(oiid);
	}

	@Override
	public List<OrderHistory> nonMembersOrderHistory(String name, String tel) {
		return orderDao.nonMembersOrderHistory(name, tel);
	}


}