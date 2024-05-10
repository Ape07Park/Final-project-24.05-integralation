package com.example.ft.controller;

import java.util.List;
import java.util.Map;

import org.json.simple.JSONObject;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import net.minidev.json.JSONArray;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import com.example.ft.entity.Item;
import com.example.ft.entity.Wish;
import com.example.ft.service.WishService;

@SpringBootApplication(exclude = SecurityAutoConfiguration.class)
@Slf4j //
@RestController
@RequestMapping("/wish")	
@RequiredArgsConstructor
public class WishController {
	private final WishService wishService;
	
	@PostMapping("/click")
	public int click(@RequestBody Wish wishJson) {
		Wish wish = wishService.getWish(wishJson.getIid(), wishJson.getEmail());
		int value = 0;
		if (wish == null) {
			Wish wishData = Wish.builder().email(wishJson.getEmail()).iid(wishJson.getIid())
								.value(1).build();
			wishService.insertWish(wishData);
			value = 1;
		} else {
			value = wishService.toggleWish(wish);
		}
		return value;
	}
	
	@GetMapping("/count/{iid}")
	public int itemWishCount(@PathVariable int iid) {
		int itemWishCount = wishService.getWishItemCount(iid);
		return itemWishCount;
	}
	
	@PostMapping("/list")
	public JSONArray wishList(@RequestBody Map<String, String> requestBody) {
	    String email = requestBody.get("email");
	    List<Item> list = wishService.getWishList(email);
	    JSONArray jArr = new JSONArray();
	    for(Item item : list) {
	        JSONObject jObj = new JSONObject(); 
	        jObj.put("iid", item.getIid());
	        jObj.put("name", item.getName());
	        jObj.put("category", item.getCategory());
	        jObj.put("img1", item.getImg1());
	        jObj.put("img2", item.getImg2());
	        jObj.put("content", item.getContent());
	        jObj.put("price", item.getPrice());
	        jObj.put("salePrice", item.getSalePrice());
	        jObj.put("saleDate", item.getSaleDate());
	        jObj.put("regDate", item.getRegDate());
	        jObj.put("isDeleted", item.getIsDeleted());
	        jObj.put("totalSta", item.getTotalSta());
	        jObj.put("company", item.getCompany());
	        jObj.put("cost", item.getCost());
	        jArr.add(jObj);
	    }
	    return jArr;
	}
}