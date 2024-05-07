package com.example.ft.controller;

import lombok.RequiredArgsConstructor;

import java.util.List;

import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.ft.entity.CartItem;
import com.example.ft.entity.CartItemRequest;
import com.example.ft.entity.ItemOption;
import com.example.ft.service.CartService;
import com.example.ft.service.ItemService;

@SpringBootApplication(exclude = SecurityAutoConfiguration.class)
@RequiredArgsConstructor
@RestController
@RequestMapping("/api/carts")
public class CartController {

	private final CartService cartService;
	private final ItemService itemService;

	@PostMapping
	public ResponseEntity<Boolean> addToCart(@RequestBody List<CartItemRequest> cartItems) {
		// 받아온 상품 목록(cartItems)을 순회하면서 처리합니다.
		for (CartItemRequest item : cartItems) {
			System.out.println(item);
			// 해당 상품 ID에 해당하는 장바구니 상품을 조회합니다.
			CartItem existedItem = cartService.findCartItemByIid(item.getIid());

			if (existedItem != null) {
				// 이미 장바구니에 있는 상품인 경우
				int updatedCount = existedItem.getCount() + 1; // 수량을 1 증가시킵니다.
				existedItem.setCount(updatedCount); // 증가된 수량을 설정합니다.
				existedItem.calculateTotalPrice(); // 상품의 총 가격을 다시 계산합니다.
				existedItem.setEmail(existedItem.getEmail());
				// 장바구니에 있는 상품의 수량을 업데이트합니다.
				cartService.updateCartItem(item.getIid(), updatedCount);
			} else {
				// 장바구니에 없는 상품인 경우, 새로 추가합니다.
				if (cartService.addToCart(item)) {
					// 장바구니 추가가 성공한 경우 true를 반환합니다.
					return ResponseEntity.ok(true);
				} else {
					// 장바구니 추가가 실패한 경우 BadRequest 상태코드를 반환합니다.
					return new ResponseEntity<Boolean>(false, HttpStatus.BAD_REQUEST);
				}
			}
		}
		// 모든 상품을 성공적으로 처리한 경우 true를 반환합니다.
		return ResponseEntity.ok(true);
	}

	@GetMapping("/list/{email}")
	public ResponseEntity<String> listCartItems(@PathVariable String email) {
		List<CartItem> cartItems = cartService.listCartItems(email);
		if (cartItems == null || cartItems.isEmpty()) {
			return ResponseEntity.notFound().build(); // 장바구니에 아이템이 없는 경우
		}

		JSONArray jsonArray = new JSONArray();
		for (CartItem item : cartItems) {
			if (item.getIid() != 0) {
				JSONObject jObj = new JSONObject();
				jObj.put("iid", item.getIid());
				jObj.put("name", item.getName());
				jObj.put("salePrice", item.getSalePrice());
				jObj.put("price", item.getPrice());
				jObj.put("img1", item.getImg1());
				jObj.put("email", item.getEmail());
				jObj.put("count", item.getCount());
				jObj.put("totalPrice", item.getTotalPrice());
//				jObj.put("option", item.getOption());

				jsonArray.add(jObj);
			}
		}
		System.out.println(jsonArray);
		// ResponseEntity를 사용하여 JSON 배열을 반환
		return new ResponseEntity<>(jsonArray.toString(), HttpStatus.OK);
	}

	@PostMapping("/update")
	public ResponseEntity<Boolean> updateCartItem(@RequestBody CartItemRequest cartItemRequest) {
		cartService.updateCartItem(cartItemRequest.getIid(), cartItemRequest.getCount());
		return ResponseEntity.ok(true);
	}

	@PostMapping("/delete")
	public ResponseEntity<String> deleteCartItem(@RequestParam int iid) {
		cartService.deleteCartItem(iid);
		return ResponseEntity.ok("카트 아이템이 성공적으로 삭제되었습니다");
	}

	@PostMapping("/deleteAll")
	public ResponseEntity<String> deleteCart(@RequestParam int cid) {
		cartService.deleteAllCarts();
		return ResponseEntity.ok("모든 카트 아이템이 성공적으로 삭제되었습니다");
	}

}