package com.example.ft.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.example.ft.dao.BoardDao;
import com.example.ft.dao.WishDao;
import com.example.ft.entity.Item;
import com.example.ft.entity.Wish;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor 
public class WishServiceImpl implements WishService {
	private final WishDao wishDao;
	
	@Override
	public Wish getWish(int iid, String email) {
		return wishDao.getWish(iid, email);
	}

	@Override
	public List<Item> getWishList(String email) {
		return wishDao.getWishList(email);
	}

	@Override
	public void insertWish(Wish wish) {
		wishDao.insertWish(wish);
	}

	@Override
	public int toggleWish(Wish wish) {
		int value = wish.getValue() == 0 ? 1 : 0 ;
		wish = Wish.builder().wid(wish.getWid()).value(value).email(wish.getEmail())
							.iid(wish.getIid()).build();
		wishDao.updateWish(wish);
		return value;
	}

	@Override
	public int getWishItemCount(int iid) {
		return wishDao.getWishItemCount(iid);
	}

}
