package com.example.ft.dao;

import java.util.List;

import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Update;

import com.example.ft.entity.RealTime;
import com.example.ft.entity.Reply;

@Mapper
public interface RealTimeDao {
	
	@Select("SELECT `query`, COUNT(`QUERY`) AS counts FROM realtime "
			+ "	WHERE regDate > DATE_SUB(NOW(), INTERVAL 14 DAY) "
			+ "	GROUP BY `query` order BY counts DESC LIMIT 0, 10")
	List<RealTime> getRealTimeList();
	
	@Insert("insert into realtime values(default, #{query}, default)")
	void insertRealTime(String query);
	
}
