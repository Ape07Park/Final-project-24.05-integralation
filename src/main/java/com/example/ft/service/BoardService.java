package com.example.ft.service;

import java.util.List;

import com.example.ft.entity.Board;

public interface BoardService {
	
	Board getBoardByBid(int bid);   //bid 값으로 원하는 게시물 찾겠다
	
	List<Board> getBoardList(String type, int iid); // 모든 게시물을 리스트로 찾겠다
	
	void insertBoard(Board board);  // 게시물 작성할 때 사용
	
	void updateBoard(Board board); // 게시물 수정할 때 사용
	
	void deleteBoard(int bid);  // 게시물 삭제 (잠시 사용 중지 상태로 변경)
	
	List<Board> getQnAList();
	
	List<Board> adminGetQnAList();
}