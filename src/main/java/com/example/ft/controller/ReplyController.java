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
import com.example.ft.entity.Reply;
import com.example.ft.entity.Review;
import com.example.ft.service.BoardService;
import com.example.ft.service.ItemService;
import com.example.ft.service.ReplyService;
import com.example.ft.service.ReviewService;

import jakarta.servlet.http.HttpSession;

import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;


@SpringBootApplication(exclude = SecurityAutoConfiguration.class)
@Slf4j  //log로 값을 출력
@RestController   // 이건 Controller 꼭 필요한 기능
@RequestMapping("/reply") // localhost:8090/ft/board  식으로 오게 하는것
@RequiredArgsConstructor  // final을 사용하려면 필요
public class ReplyController {
	private final ReplyService replyService;
	
	@PostMapping("/insert") 
	public String replyInsert(@RequestBody Reply replyData) {
		Reply reply = Reply.builder()
							.email(replyData.getEmail()).bid(replyData.getBid())
							.content(replyData.getContent())
							.build();
		replyService.insertReply(reply);
		return "Success";
	}
	
	@PostMapping("/delete/{rid}")
	public String replyDelete(@PathVariable int rid) {
		replyService.deleteReply(rid);
		return "Success";
	}
	
	@PostMapping("/update")
	public String replyUpdate(@RequestBody Reply replyData) {
		Reply reply = Reply.builder()
							.content(replyData.getContent()).rid(replyData.getRid())
							.build();
		replyService.updateReply(reply);
		return "Success";
	}
	
	@GetMapping("/list/{bid}")
	public JSONArray getList(@PathVariable int bid) {
		List<Reply> replyList = replyService.getReplyList(bid);
		JSONArray jArr = new JSONArray();
		for(Reply reply : replyList) {
			JSONObject jObj = new JSONObject(); 
			jObj.put("rid", reply.getRid());
			jObj.put("email", reply.getEmail());
			jObj.put("bid", reply.getBid());
			jObj.put("content", reply.getContent());
			jObj.put("regDate", reply.getRegDate());
			jObj.put("isDeleted", reply.getIsDeleted());
			jObj.put("iid", reply.getIid());
			jArr.add(jObj);
		}
		return jArr;
	}
	
}