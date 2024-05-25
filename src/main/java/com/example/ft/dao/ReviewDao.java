package com.example.ft.dao;

import java.util.List;

import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Update;

import com.example.ft.entity.Board;
import com.example.ft.entity.Review;

@Mapper
public interface ReviewDao {

	@Select("select * from review where vid={vid} and isDeleted=0") 
	Review getReviewByVid(int vid);
	
	@Select("SELECT b.*, r.sta, r.vid from board b JOIN review r ON b.bid = r.bid WHERE b.type=#{type} and"
			+ " b.isDeleted=0 and b.iid=#{iid} order by b.regDate desc")
	List<Board> getReviewList(String type, int iid);
	
	@Select("SELECT SUM(r.sta) / COUNT(*) from board b JOIN review r ON b.bid = r.bid where b.iid=#{iid}")
	int totalStaIid(int iid);
	
	@Insert("insert into review values (default, #{sta}, #{bid}, default)")
	void insertReview(Review review);  
	
	@Update("update review set sta=#{sta} where vid=#{vid}")
	void updateReview(Review review); 
	
	@Select("SELECT oi.iid, count(oi.iid) AS ordersNumber, o.email  FROM `order` o "
			+ "JOIN orderitem oi ON o.oid = oi.oid WHERE o.email='admin@gmail.com' "
			+ "GROUP BY oi.iid")
	int reviewOrNot();

}