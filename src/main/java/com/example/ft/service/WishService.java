package com.example.ft.service;

import java.util.List;

import com.example.ft.entity.Board;
import com.example.ft.entity.Item;
import com.example.ft.entity.Review;
import com.example.ft.entity.Wish;

public interface WishService {
	
	// 찜이 생성되어있었는지 체크
	Wish getWish(int iid, String email);
	// 유저가 찜눌은 아이템을 리스트로 출력
	List<Item> getWishList(String email);
	// 
//	Wish getWishByWid(int wid);
	// 찜 추가
	void insertWish(Wish wish); 
	// 찜이 있으면 업데이트해서 수정
	int toggleWish(Wish wish);
	// 아이템에 찜갯수
	int getWishItemCount(int iid);
	
}
