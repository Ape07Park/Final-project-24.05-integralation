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


	@Override
	public List<Order> getOrderListByEmail(String email) {
		// TODO Auto-generated method stub
		return null;
	}

	/*
	 * orderHistory
	 */
	
	// 주문 했던 것들 리스트로 다 띄우기 
	@Override
	public List<OrderHistory> getOrderHistoryList(String email) {
		return orderDao.getOrderHistoryList(email);
	}
	
}
