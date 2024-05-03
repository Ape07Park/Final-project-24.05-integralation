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
	Board getBoardByBid(int bid);    // 돌려받는 값 
	// 테이블이름이 뭐냐?,board에서 조건where bid에서 가져오는데 그리고 삭제된거는 가져오지마
	
	@Select("select * from board where isDeleted=0 and type=#{type} and iid=#{iid} order by regDate desc")
	List<Board> getBoardList(String type, int iid);

	@Insert("insert into  Board values (default, #{iid}, #{email}, #{type},"
			+ " #{typeQnA}, #{title}, default, #{content}, #{img}, default)")
	@SelectKey(statement="SELECT LAST_INSERT_ID()", keyProperty="bid", before=false, resultType=int.class)
	void insertBoard(Board board);
	
	@Update("update Board set iid=#{iid}, type=#{type}, typeQnA=#{typeQnA}, title=#{title},"
			+ " content=#{content}, img=#{img} where bid=#{bid}")  // 변경할 수 있는것들
	void updateBoard(Board board);
	
	@Update("update Board set isDeleted=1 where bid=#{bid}")
	void deleteBoard(int bid);

}