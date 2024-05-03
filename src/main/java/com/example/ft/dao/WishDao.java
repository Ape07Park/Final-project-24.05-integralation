package com.example.ft.dao;

import java.util.List;

import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Update;

import com.example.ft.entity.Item;
import com.example.ft.entity.Wish;

@Mapper
public interface WishDao {

	@Select("select * from wish where email=#{email} and iid=#{iid}")
	Wish getWish(int iid, String email);
	
	@Select("select * from wish where wid=#{wid}")
	Wish getWishByWid(int wid);
	
	@Select("select * from wish w JOIN item i ON w.iid = i.iid WHERE w.email=#{email} AND w.value=1")
	List<Item> getWishList(String email);
	
	@Select("select count(*) from wish where iid=#{iid} and value=1")
	int getWishItemCount(int iid);
	
	@Insert("insert into wish values(default, #{email}, #{iid}, #{value})")
	void insertWish(Wish wish);
	
	@Update("update wish set value=#{value} where wid=#{wid}")
	void updateWish(Wish wish);
}
