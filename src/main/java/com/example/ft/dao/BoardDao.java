package com.example.ft.dao;

import java.util.List;

import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.SelectKey;
import org.apache.ibatis.annotations.Update;

import com.example.ft.entity.Board;

@Mapper
public interface BoardDao {

	@Select("select * from board where bid=#{bid} and isDeleted=0")   
	Board getBoardByBid(int bid);   
	
	@Select("select * from board where isDeleted=0 and type=#{type} and iid=#{iid} order by regDate desc")
	List<Board> getBoardList(String type, int iid);

	@Insert("insert into  Board values (default, #{iid}, #{email}, #{type},"
			+ " #{typeQnA}, #{title}, default, #{content}, #{img}, default)")
	@SelectKey(statement="SELECT LAST_INSERT_ID()", keyProperty="bid", before=false, resultType=int.class)
	void insertBoard(Board board);
	
	@Update("update Board set iid=#{iid}, type=#{type}, typeQnA=#{typeQnA}, title=#{title},"
			+ " content=#{content}, img=#{img} where bid=#{bid}")  
	void updateBoard(Board board);
	
	@Update("update Board set isDeleted=1 where bid=#{bid}")
	void deleteBoard(int bid);
	
	@Select("select * from board where type='QnA' and isDeleted=0")
	List<Board> getQnAList();

	@Select("SELECT b.*, CASE WHEN r.bid IS NULL THEN '미답변' ELSE '답변완료' END AS replyStatus "
			+ "	FROM board b LEFT JOIN reply r ON b.bid = r.bid AND r.isDeleted = 0 WHERE b.type = 'QnA' AND b.isDeleted = 0")
	List<Board> adminGetQnAList();
}