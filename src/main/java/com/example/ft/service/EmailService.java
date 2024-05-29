package com.example.ft.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import java.io.UnsupportedEncodingException;

public interface EmailService {
	MimeMessage createMessage(String recipient) throws MessagingException, UnsupportedEncodingException;

	String sendSimpleMessage(String recipient) throws Exception;
	
	String sendEpwForCompare();
}
