package com.example.ft.service;

import java.util.List;

import com.example.ft.entity.Board;
import com.example.ft.entity.Review;

public interface ReviewService {

	List<Board> getReviewList(String type, int bid);
	
	int totalStaIid(int iid);
	
	void insertReview(Review review);  
	
	void updateReview(Review review); 
	
}
