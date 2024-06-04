package com.example.ft.controller;

import java.util.List;

import org.slf4j.Logger;
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
import com.example.ft.entity.Review;
import com.example.ft.service.BoardService;
import com.example.ft.service.ItemService;
import com.example.ft.service.OrderService;
import com.example.ft.service.ReviewService;

import org.springframework.web.bind.annotation.RequestBody;

@SpringBootApplication(exclude = SecurityAutoConfiguration.class)
@Slf4j  //log로 값을 출력
@RestController   // 이건 Controller 꼭 필요한 기능
@RequestMapping("/board") // localhost:8090/ft/board  식으로 오게 하는것
@RequiredArgsConstructor  // final을 사용하려면 필요
public class BoardController {
	private final BoardService boardService; 
	private final ReviewService reviewService; 
	private final ItemService itemService;
	private final OrderService orderService;
	
	@GetMapping("/list/{type}/{iid}")
	public JSONArray list(@PathVariable String type, @PathVariable int iid) {
		JSONArray jArr = new JSONArray();
		if (type.equals("review")) {
			List<Board> list = reviewService.getReviewList(type, iid);
			for(Board board : list) {
				JSONObject jObj = new JSONObject();
				jObj.put("bid",board.getBid());
				jObj.put("iid",board.getIid());
				jObj.put("email",board.getEmail());
				jObj.put("type",board.getType());
				jObj.put("typeQnA",board.getTypeQnA());
				jObj.put("title",board.getTitle());
				jObj.put("regDate",board.getRegDate());
				jObj.put("content",board.getContent());
				jObj.put("img",board.getImg());
				jObj.put("sta",board.getSta());
				jObj.put("vid",board.getVid());
				jArr.add(jObj);
			}
		} else {
			List<Board> list = boardService.getBoardList(type, iid);
			for(Board board : list) {
				JSONObject jObj = new JSONObject();
				jObj.put("bid",board.getBid());
				jObj.put("iid",board.getIid());
				jObj.put("email",board.getEmail());
				jObj.put("type",board.getType());
				jObj.put("typeQnA",board.getTypeQnA());
				jObj.put("title",board.getTitle());
				jObj.put("regDate",board.getRegDate());
				jObj.put("content",board.getContent());
				jObj.put("img",board.getImg());
				jObj.put("secretMsg",board.getSecretMsg());
				jArr.add(jObj);
			}
		}
		return jArr;
	}
	
	@PostMapping("/insert")
	public String boardInsert(@RequestBody Board boardData) {
		Board board = Board.builder()
				  		.iid(boardData.getIid()).email(boardData.getEmail()).type(boardData.getType())
				  		.typeQnA(boardData.getTypeQnA()).title(boardData.getTitle())
				  		.content(boardData.getContent()).img(boardData.getImg())
				  		.secretMsg(boardData.getSecretMsg())
				  		.build();
		boardService.insertBoard(board);
		if (boardData.getType().equals("review")) {
			Review review = Review.builder()
							.bid(board.getBid()).sta(boardData.getSta())
							.build();
			reviewService.insertReview(review);
			int totalSta = reviewService.totalStaIid(boardData.getIid());
			Item item = Item.builder()
						.iid(boardData.getIid()).totalSta(totalSta)
						.build();
			itemService.totalSta(item);
			orderService.oiidReviewUpdate(boardData.getOiid());
		}
		return "등록되었습니다.";
	}
	
	@PostMapping("/update")
	public String boardUpdate(@RequestBody Board boardData) {
		Board board = Board.builder().bid(boardData.getBid())
		  		.iid(boardData.getIid()).email(boardData.getEmail()).type(boardData.getType())
		  		.typeQnA(boardData.getTypeQnA()).title(boardData.getTitle())
		  		.content(boardData.getContent()).img(boardData.getImg()).secretMsg(boardData.getSecretMsg()).build();
		boardService.updateBoard(board);
		if (boardData.getType().equals("review")) {
			Review review = Review.builder()
							.vid(boardData.getVid()).sta(boardData.getSta())
							.build();
			reviewService.updateReview(review);
			int totalSta = reviewService.totalStaIid(boardData.getIid());
			Item item = Item.builder()
					.iid(boardData.getIid()).totalSta(totalSta)
					.build();
			itemService.totalSta(item);
		}
		return "수정되었습니다.";
	}
	
	@PostMapping("/delete/{bid}")
	public String boardDelete(@PathVariable int bid) {
		boardService.deleteBoard(bid);
		return "삭제되었습니다.";
	}
	
	@GetMapping("/QnAList")
	public JSONArray list() {
		JSONArray jArr = new JSONArray();
		List<Board> list = boardService.getQnAList();
		for(Board board : list) {
			JSONObject jObj = new JSONObject();
			jObj.put("bid",board.getBid());
			jObj.put("iid",board.getIid());
			jObj.put("email",board.getEmail());
			jObj.put("type",board.getType());
			jObj.put("typeQnA",board.getTypeQnA());
			jObj.put("title",board.getTitle());
			jObj.put("regDate",board.getRegDate());
			jObj.put("content",board.getContent());
			jObj.put("img",board.getImg());
			jArr.add(jObj);
		}
		return jArr;
	}
	
	@GetMapping("/adminQnAList")
	public JSONArray adminQnAList() {
		JSONArray jArr = new JSONArray();
		List<Board> list = boardService.adminGetQnAList();
		for(Board board : list) {
			JSONObject jObj = new JSONObject();
			jObj.put("bid",board.getBid());
			jObj.put("iid",board.getIid());
			jObj.put("email",board.getEmail());
			jObj.put("type",board.getType());
			jObj.put("typeQnA",board.getTypeQnA());
			jObj.put("title",board.getTitle());
			jObj.put("regDate",board.getRegDate());
			jObj.put("content",board.getContent());
			jObj.put("img",board.getImg());
			jObj.put("replyStatus",board.getReplyStatus());
			jArr.add(jObj);
		}
		return jArr;
	}
}