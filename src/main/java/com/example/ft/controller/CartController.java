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

		for (CartItemRequest item : cartItems) {
			CartItem existedItem = cartService.findCartItemByIid(item.getIid());
			if (existedItem != null) {
				int updatedCount = existedItem.getCount() + 1;
				existedItem.setCount(updatedCount);
				existedItem.calculateTotalPrice();
				// existedItem.setEmail(user.getEmail);
				cartService.updateCartItem(item.getIid(), updatedCount);
			} else {
				if (cartService.addToCart(item)) {
					return ResponseEntity.ok(true);
				} else {
					return new ResponseEntity<Boolean>(false, HttpStatus.BAD_REQUEST);
				}
			}
		}
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
			JSONObject jObj = new JSONObject();
			ItemOption lot = itemService.getItemsOptionIoid(item.getIoid());
			jObj.put("iid", item.getIid());
			jObj.put("name", item.getName());
			jObj.put("salePrice", item.getSalePrice());
			String saleDateStr = item.getSaleDate().toString();
			jObj.put("saleDate", saleDateStr); // 날짜를 문자열로 변환하여 추가
			String regDateStr = item.getRegDate().toString();
			jObj.put("regDate", regDateStr);
			jObj.put("price", item.getPrice());
			jObj.put("img1", item.getImg1());
			jObj.put("email", item.getEmail());
			jObj.put("count", item.getCount());
			jObj.put("totalPrice", item.getTotalPrice());
			jObj.put("opcount", lot.getCount());
			jsonArray.add(jObj);
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
	public ResponseEntity<String> deleteCartItem(@RequestParam int cid) {
		cartService.deleteCartItem(cid);
		return ResponseEntity.ok("카트 아이템이 성공적으로 삭제되었습니다");
	}

	@PostMapping("/deleteAll")
	public ResponseEntity<String> deleteAllCartItems() {
		cartService.deleteAllCarts();
		return ResponseEntity.ok("모든 카트 아이템이 성공적으로 삭제되었습니다");
	}

}