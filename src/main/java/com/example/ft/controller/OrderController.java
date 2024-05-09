package com.example.ft.controller;

import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.ft.entity.Order;
import com.example.ft.entity.OrderHistory;
import com.example.ft.entity.OrderItem;
import com.example.ft.entity.OrderRequest;
import com.example.ft.service.OrderService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequestMapping("/order")
@RequiredArgsConstructor
public class OrderController {

	private final OrderService orderService;

	/*
	 *  주문 요청 처리 -- 완료
	 */
	
	@PostMapping("/insert")
	public ResponseEntity<?> insertOrder(@RequestBody OrderRequest orderRequest) {
		try {
			// 주문 생성
			orderService.insertOrder(orderRequest.getOrder());
			
			// 주문 생성 후 생성된 oid를 가져와서 주문 아이템을 삽입
			int oid = orderRequest.getOrder().getOid();
			System.out.println("oid:" + oid);
			
			// 주문 아이템을 가져와서 oid를 설정합니다.
			List<OrderItem> orderItemsData = orderRequest.getOrderItems();
			
			System.out.println(orderItemsData.isEmpty());
			
			for (OrderItem orderItem : orderItemsData) {
				OrderItem newOrderItem = OrderItem.builder().oid(oid).iid(orderItem.getIid()).ioid(orderItem.getIoid())
						.count(orderItem.getCount()).price(orderItem.getPrice()).build();
				
				System.out.println(newOrderItem);
				// 주문 아이템을 삽입합니다.
				orderService.insertOrderItemWithOid(newOrderItem);
			}
			return new ResponseEntity<>("Order created successfully", HttpStatus.CREATED);
		} catch (Exception e) {
			return new ResponseEntity<>("Failed to create order", HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}
		
	/*
	 * 특정 사용자의 주문 목록 가져오기 -- 여기 다시하기 0509
	 */
	
	@GetMapping("/historyList/{email}")
	public ResponseEntity<?> getOrderListByEmail(@PathVariable String email) {
		System.out.println(email);
		if (email == null || email.isEmpty()) {
	        return ResponseEntity.badRequest().body("이메일을 제공해주세요.");
	    }
	    
	    // 사용자 이메일을 이용하여 주문 목록을 조회합니다.
	    List<OrderHistory> orderList = orderService.getOrderHistoryList(email);
	    
	    if (orderList.isEmpty()) {
	        return ResponseEntity.notFound().build();
	    }
	    
	    return ResponseEntity.ok(orderList);
	}


	
//	// 주문 1개 가져오기
//	@GetMapping("/{oid}")
//	public ResponseEntity<Order> getOrder(@PathVariable int oid) {
//		try {
//			// 클라이언트로부터 받은 주문 ID와 현재 로그인한 사용자의 이메일을 이용하여 주문 조회
//			// 이메일 정보는 보안상의 이유로 세션 또는 토큰에서 가져오는 것이 바람직할 수 있습니다.
//			String userEmail = "test@gmail.com";
//
//			// 주문 조회
//			Order order = orderService.getOrderByOid(oid);
//
//			if (order != null) {
//				// 주문이 존재하면 200 OK 상태 코드와 함께 주문 정보 반환
//				return ResponseEntity.ok(order);
//			} else {
//				// 주문이 없으면 404 Not Found 상태 코드 반환
//				return ResponseEntity.notFound().build();
//			}
//		} catch (Exception e) {
//			// 예외 발생 시 500 Internal Server Error 상태 코드 반환
//			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
//		}
//	}
	
//	 // 특정 사용자의 주문 목록 가져오기 
//    @GetMapping("/historyList/{email}")
//    public List<Order> getOrderListByEmail(@PathVariable String email) {
//        // 사용자 이메일을 이용하여 주문 목록을 조회합니다.
//        List<Order> orderList = orderService.getOrderListByEmail(email);
//        return orderList;
//    }
    
    

	// 주문 삭제
	@PostMapping("/delete")
	public ResponseEntity<String> deleteOrder(@RequestParam int oid) {
		try {
			// 주문 서비스를 호출하여 주문을 삭제
			orderService.deleteOrder(oid);
			// 주문이 성공적으로 삭제되었음을 클라이언트에게 알림
			return ResponseEntity.ok("주문이 성공적으로 삭제되었습니다.");
		} catch (Exception e) {
			// 주문 삭제에 실패한 경우, 에러 메시지와 함께 500 Internal Server Error 응답 반환
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("주문 삭제에 실패했습니다.");
		}
	}

}
