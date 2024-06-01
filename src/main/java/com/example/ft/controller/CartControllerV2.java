package com.example.ft.controller;

import com.example.ft.dto.CartItemRequestDto;
import com.example.ft.dto.CartItemResponseDto;
import com.example.ft.service.CartServiceV2;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v2/carts")
public class CartControllerV2 {
    private final CartServiceV2 cartServiceV2;

    @PostMapping
    public ResponseEntity<Boolean> addToCart(@RequestBody CartItemRequestDto cartItemRequest) {
        int result = cartServiceV2.addCartItem(cartItemRequest);
        return ResponseEntity.ok(result == 0 ? false : true);
    }

    @GetMapping("/list/{email}")
    public ResponseEntity<List<CartItemResponseDto>> listCartItems(@PathVariable String email) {
        List<CartItemResponseDto> data = cartServiceV2.findAllByUserEmail(email);
        return ResponseEntity.ok(data);
    }

    @DeleteMapping("/delete/{email}")
    public ResponseEntity<Boolean> deleteCartItem(@PathVariable String email, @RequestBody int[] cids) {
        int result = cartServiceV2.deleteCartItem(email, cids);
        return ResponseEntity.ok(result == 0 ? false : true);
    }

    @PostMapping("/update")
    public ResponseEntity<Boolean> updateCartItem(@RequestBody CartItemRequestDto cartItemRequest) {
        int result = cartServiceV2.updateCartItem(cartItemRequest);
        return ResponseEntity.ok(result == 0 ? false : true);
    }

    @PostMapping("/delete/{email}")
    public ResponseEntity<Boolean> deleteAllCartItem(@PathVariable String email) {
        int result = cartServiceV2.deleteAllCartItem(email);
        return ResponseEntity.ok(result == 0 ? false : true);
    }
}