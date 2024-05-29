package com.example.ft.controller;

import java.util.List;

import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import net.minidev.json.JSONArray;
import net.minidev.json.JSONObject;
import netscape.javascript.JSObject;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;

import com.example.ft.entity.Board;
import com.example.ft.entity.Item;
import com.example.ft.entity.ItemRequest;
import com.example.ft.entity.RealTime;
import com.example.ft.entity.Reply;
import com.example.ft.entity.Review;
import com.example.ft.service.BoardService;
import com.example.ft.service.ItemService;
import com.example.ft.service.RealTimesService;
import com.example.ft.service.ReplyService;
import com.example.ft.service.ReviewService;

import jakarta.servlet.http.HttpSession;

import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;


@SpringBootApplication(exclude = SecurityAutoConfiguration.class)
@Slf4j  //log로 값을 출력
@RestController   // 이건 Controller 꼭 필요한 기능
@RequestMapping("/realTime") // localhost:8090/ft/board  식으로 오게 하는것
@RequiredArgsConstructor  // final을 사용하려면 필요
public class RealTimeController {
	private final RealTimesService realTimeService;
	
	@GetMapping("/list")
	public JSONArray getList() {
		List<RealTime> list = realTimeService.getRealTimeList();
		JSONArray jArr = new JSONArray();
		for(RealTime query : list) {
			JSONObject jObj = new JSONObject(); 
			jObj.put("query", query.getQuery());
			jArr.add(jObj);
		}
		return jArr;
	}
	
}