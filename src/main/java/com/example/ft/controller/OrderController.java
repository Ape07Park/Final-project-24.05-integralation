package com.example.ft.controller;

import java.util.List;
import java.util.Map;

import javax.swing.plaf.synth.SynthOptionPaneUI;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.ft.entity.Order;
import com.example.ft.entity.OrderHistory;
import com.example.ft.entity.OrderItem;
import com.example.ft.entity.OrderRequest;
import com.example.ft.service.ItemService;
import com.example.ft.service.OrderService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/order")
@RequiredArgsConstructor
public class OrderController {
	private final ItemService itemService;
	private final OrderService orderService;

	// 주문 1개 가져오기
	@GetMapping("/{oid}")
	public ResponseEntity<Order> getOrder(@PathVariable int oid) {
		try {
			// 클라이언트로부터 받은 주문 ID와 현재 로그인한 사용자의 이메일을 이용하여 주문 조회
			// 이메일 정보는 보안상의 이유로 세션 또는 토큰에서 가져오는 것이 바람직할 수 있습니다.
			String userEmail = "test@gmail.com";

			// 주문 조회
			Order order = orderService.getOrderByOid(oid);

			if (order != null) {
				// 주문이 존재하면 200 OK 상태 코드와 함께 주문 정보 반환
				return ResponseEntity.ok(order);
			} else {
				// 주문이 없으면 404 Not Found 상태 코드 반환
				return ResponseEntity.notFound().build();
			}
		} catch (Exception e) {
			// 예외 발생 시 500 Internal Server Error 상태 코드 반환
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
		}
	}

	// 주문한 것들 조회
	@GetMapping("/list/{email}")
	public ResponseEntity<List<Order>> getOrderById(@PathVariable String email) {
		try {
			List<Order> orders = orderService.getOrderListByEmail(email);
			if (orders != null && !orders.isEmpty()) {
				return ResponseEntity.ok(orders);
			} else {
				return ResponseEntity.notFound().build();
			}
		} catch (Exception e) {
			// 예외 발생 시 500 Internal Server Error 상태 코드 반환
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
		}
	}

	@PostMapping("/insert")
	public ResponseEntity<?> insertOrder(@RequestBody OrderRequest orderRequest) {
		Order order = orderService.oderIdCheck(orderRequest.getOrder().getOrderId());
		try {
			if (order == null) {
				// 주문 생성
				orderService.insertOrder(orderRequest.getOrder());

				// 주문 생성 후 생성된 oid를 가져와서 주문 아이템을 삽입
				int oid = orderRequest.getOrder().getOid();

				// 주문 아이템을 가져와서 oid를 설정합니다.
				List<OrderItem> orderItemsData = orderRequest.getOrderItems();

				for (OrderItem orderItem : orderItemsData) {
					OrderItem newOrderItem = OrderItem.builder().oid(oid).iid(orderItem.getIid())
							.ioid(orderItem.getIoid()).count(orderItem.getCount()).price(orderItem.getPrice()).build();

					// 주문 아이템을 삽입합니다.
					orderService.insertOrderItemWithOid(newOrderItem);
				}
			}
			return new ResponseEntity<>("Order created successfully", HttpStatus.CREATED);
		} catch (Exception e) {
			return new ResponseEntity<>("Failed to create order", HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	// 특정 사용자의 주문 목록 가져오기
	@PostMapping("/historyList")
	public ResponseEntity<?> getOrderListByEmail(@RequestBody Map<String, String> data) { // 이메일 json으로 받음. 그래서 map
		String email = data.get("email"); // 이메일 가져오기

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

	// admin으로 모든 사용자의 주문 목록 가져오기
	@PostMapping("/admin/historyList")
	public ResponseEntity<?> getOrderListForAdmin(@RequestBody Map<String, String> data) {
		
		String adminEmail = data.get("email"); // adminEmail이라는 key를 통해 admin의 이메일을 받음

		if (!adminEmail.equals("admin@gmail.com")) {
			return ResponseEntity.badRequest().body("관리자 이메일을 제공해주세요.");
		}

		List<OrderHistory> allOrderList = orderService.getOrderHistoryListForAdmin();

		if (allOrderList.isEmpty()) {
			return ResponseEntity.notFound().build();
		}

		return ResponseEntity.ok(allOrderList);

	}

	//
	@PostMapping("/statusUpdate")
	public String statusUpdate(@RequestBody Order order) {
		String status = (order.getStatus().equals("배송완료") ? "배송완료" : "배송중");
		Order orderData = Order.builder().status(status).oid(order.getOid()).build();
		orderService.statusUpdate(orderData);
		return "update";
	}

	// 운송장 번호 업데이트
    @PostMapping("/orderWayUpdate")
    public ResponseEntity<?> updateOrderWay(@RequestBody Map<String, String> data) {
        int oid = Integer.parseInt(data.get("oid"));
        String way = data.get("way");

        if (way == null || way.isEmpty()) {
            return ResponseEntity.badRequest().body("운송장 번호를 제공해주세요.");
        }

        try {
            // 주문 정보 업데이트
            orderService.orderWayUpdate(oid, way);
            return ResponseEntity.ok("운송장 번호가 업데이트되었습니다.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("운송장 번호 업데이트에 실패했습니다.");
        }
    }
    
    @PostMapping("/orderDelete")
    public ResponseEntity<?> deleteOrder(@RequestBody Map<String, String> data) {
    	
        int oid = Integer.parseInt(data.get("oid"));
        try {
            // 주문 정보 업데이트
            orderService.deleteOrder(oid);
            
            List<OrderItem> orderItemList = orderService.getOrderItems(oid);
            for (OrderItem item : orderItemList) {
            	itemService.inventoryCalculationCancel(item.getIoid(), item.getCount());
            }
            
            return ResponseEntity.ok("주문 취소 되었습니다.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("주문 취소에 실패했습니다.");
        }
    }
    
    // 비회원
 	@PostMapping("/nonMembersOrderHistory")
 	public ResponseEntity<?> nonMembersOrderHistory(@RequestBody Map<String, String> data) { // 이메일 json으로 받음. 그래서 map
 		String name = data.get("name");
 		String tel = data.get("tel"); 

 		if (name == null || tel == null) {
 			return ResponseEntity.badRequest().body("정보를 입력해주세요");
 		}

 		// 사용자 이름과 폰넘버로 조회 구현예정
 		List<OrderHistory> orderList = orderService.nonMembersOrderHistory(name, tel);

 		if (orderList.isEmpty()) {
 			return ResponseEntity.notFound().build();
 		}

 		return ResponseEntity.ok(orderList);
 	}
}