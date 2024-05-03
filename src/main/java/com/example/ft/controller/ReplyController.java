//package com.example.ft.controller;
//
//import java.util.List;
//
//import org.springframework.boot.autoconfigure.SpringBootApplication;
//import org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration;
//import org.springframework.stereotype.Controller;
//import org.springframework.web.bind.annotation.RequestMapping;
//import org.springframework.web.bind.annotation.RestController;
//
//import lombok.RequiredArgsConstructor;
//import lombok.extern.slf4j.Slf4j;
//import net.minidev.json.JSONArray;
//import net.minidev.json.JSONObject;
//import netscape.javascript.JSObject;
//
//import org.springframework.web.bind.annotation.GetMapping;
//import org.springframework.web.bind.annotation.PathVariable;
//import org.springframework.web.bind.annotation.PostMapping;
//
//import com.example.ft.entity.Board;
//import com.example.ft.entity.Item;
//import com.example.ft.entity.ItemRequest;
//import com.example.ft.entity.Review;
//import com.example.ft.service.BoardService;
//import com.example.ft.service.ItemService;
//import com.example.ft.service.ReviewService;
//
//import jakarta.servlet.http.HttpSession;
//
//import org.springframework.web.bind.annotation.RequestBody;
//
//@SpringBootApplication(exclude = SecurityAutoConfiguration.class)
//@Slf4j  //log로 값을 출력
//@RestController   // 이건 Controller 꼭 필요한 기능
//@RequestMapping("/reply") // localhost:8090/ft/board  식으로 오게 하는것
//@RequiredArgsConstructor  // final을 사용하려면 필요
//public class ReplyController {
//	private final BoardService boardService; 
//	private final ReviewService reviewService; 
//	private final ItemService itemService;
//	
//	@PostMapping("/insert") //uid=board.uid
//	public String reply(@RequestBody ) {
//		String sessUid = (String) session.getAttribute("sessUid");
//		int isMine = (sessUid.equals(uid)) ? 1 : 0;
//		Reply reply = new Reply(comment, sessUid, bid, isMine);
//		replyService.insertReply(reply);
//		boardService.increaseReplyCount(bid);
//		
//		int count = boardService.replyCount(bid);
//		boardService.updateReplyCount(bid, count);
//
//		return "redirect:/board/detail/" + bid + "/" + uid + "?option=DNI";
//	}
//	
//	@PostMapping("/delete")
//	public String replyDelete(@PathVariable int rid, @PathVariable int bid) {
//		replyService.deleteReply(rid);
//		int count = boardService.replyCount(bid);
//		
//		boardService.updateReplyCount(bid, count);
//		return "board/detail::#replyDelete";
//	}
//	
//	@PostMapping("/update")
//	public String replyUpdate(int rid, int bid, String uid, String comment) {
//		Reply reply = new Reply(rid, comment);
//		replyService.updateReply(reply);
//		return "redirect:/board/detail/" + bid + "/" + uid + "?option=DNI";
//	}
//}