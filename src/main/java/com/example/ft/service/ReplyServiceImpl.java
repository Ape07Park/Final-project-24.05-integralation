package com.example.ft.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.ft.dao.ReplyDao;
import com.example.ft.entity.Reply;

@Service
public class ReplyServiceImpl implements ReplyService{
	@Autowired private ReplyDao replyDao;

	@Override
	public List<Reply> getReplyList(int bid) {
		return replyDao.getReplyList(bid);
	}

	@Override
	public void insertReply(Reply reply) {
		replyDao.insertReply(reply);
	}

	@Override
	public void deleteReply(int rid) {
		replyDao.deleteReply(rid);
	}

	@Override
	public void updateReply(Reply reply) {
		replyDao.updateReply(reply);
	}
	
	

}
