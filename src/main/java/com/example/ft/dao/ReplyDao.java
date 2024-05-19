package com.example.ft.dao;

import java.util.List;

import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Update;

import com.example.ft.entity.Reply;

@Mapper
public interface ReplyDao {
	
	@Select("select * from reply where bid=#{bid} and isDeleted=0")
	List<Reply> getReplyList(int bid);
	
	@Insert("insert into reply values(default, #{email}, #{bid}, #{content}, default, default)")
	void insertReply(Reply reply);
	
	@Update("update reply set isDeleted=1 where rid=#{rid}")
	void deleteReply(int rid);
	
	@Update("update reply set content=#{content}, regDate=now() where rid=#{rid}")
	void updateReply(Reply reply);
}
