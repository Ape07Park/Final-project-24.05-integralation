package com.example.ft.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.example.ft.dao.ItemDao;
import com.example.ft.dao.ReviewDao;
import com.example.ft.entity.Board;
import com.example.ft.entity.Review;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ReviewServiceImpl implements ReviewService {
	private final ReviewDao reviewDao;

	@Override
	public List<Board> getReviewList(String type, int iid) {
		return reviewDao.getReviewList(type, iid);
	}

	@Override
	public int totalStaIid(int iid) {
		return reviewDao.totalStaIid(iid);
	}

	@Override
	public void insertReview(Review review) {
		reviewDao.insertReview(review);
	}

	@Override
	public void updateReview(Review review) {
		reviewDao.updateReview(review);
	}

}
