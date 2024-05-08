package com.example.ft.service;

import org.springframework.stereotype.Service;

import com.example.ft.dao.RecipientDao;
import com.example.ft.entity.Recipient;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class RecipientServiceImpl implements RecipientService {
	private final RecipientDao recipientDao;

	@Override
	public void insertRecipient(Recipient recipient) {
		recipientDao.insertRecipient(recipient);
	}
	
	
}
