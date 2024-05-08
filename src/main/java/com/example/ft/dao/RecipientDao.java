package com.example.ft.dao;

import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;

import com.example.ft.entity.Recipient;

@Mapper
public interface RecipientDao {
	
	@Insert("INSERT INTO `recipient` (name, postCode, addr, detailAddr, tel, req) VALUES (#{name}, #{postCode}, #{addr}, #{detailAddr}, #{tel}, #{req})")
	void insertRecipient(Recipient recipient);

}
