package com.example.ft.service;

import java.util.List;

import com.example.ft.entity.Reply;

public interface ReplyService {
	
	List<Reply> getReplyList(int bid);
	
	void insertReply(Reply reply);
	
	void deleteReply(int rid);
	
	void updateReply(Reply reply);
}
