package com.example.ft.service;

import java.io.UnsupportedEncodingException;
import java.util.Random;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.PropertySource;
import org.springframework.mail.MailException;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.InternetAddress;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/*
 * 전체적인 동작 흐름
이메일 메시지를 생성(createMessage).
생성한 메시지를 전송(sendSimpleMessage).
인증번호를 생성(createKey)하여 이메일 내용에 포함하고, 전송 후 반환합니다.
 */

@PropertySource("classpath:application.properties")
@Slf4j // @Slf4j: Lombok의 어노테이션으로, 로그 기록을 위한 로거(Logger)를 자동으로 생성
@RequiredArgsConstructor
@Service
public class EmailServiceImpl implements EmailService {
	private final JavaMailSender javaMailSender;

	// 인증번호 생성
	private final String ePw = createKey(); // 인증번호를 저장합니다. createKey() 메서드를 호출하여 생성된 값을 초기값으로 가집니다.

	@Value("${spring.mail.username}")
	private String id; // application.properties 파일에서 spring.mail.username 값을 읽어와 저장합니다. 이는 이메일 발신자의
						// 주소로 사용

	@Override
	public MimeMessage createMessage(String recipient) throws MessagingException, UnsupportedEncodingException {
		MimeMessage message = javaMailSender.createMimeMessage();
		
		message.addRecipients(MimeMessage.RecipientType.TO, recipient); // to 보내는 대상
		message.setSubject("Funiture 회원가입 인증 코드: "); // 메일 제목

		// 메일 내용 메일의 subtype을 html로 지정하여 html 문법 사용 가능
		String msg = "";
		msg += "<h1 style=\"font-size: 30px; padding-right: 30px; padding-left: 30px;\">이메일 주소 확인</h1>";
		msg += "<p style=\"font-size: 17px; padding-right: 30px; padding-left: 30px;\">아래 확인 코드를 회원가입 화면에서 입력해주세요.</p>";
		msg += "<div style=\"padding-right: 30px; padding-left: 30px; margin: 32px 0 40px;\"><table style=\"border-collapse: collapse; border: 0; background-color: #F4F4F4; height: 70px; table-layout: fixed; word-wrap: break-word; border-radius: 6px;\"><tbody><tr><td style=\"text-align: center; vertical-align: middle; font-size: 30px;\">";
		msg += ePw;
		msg += "</td></tr></tbody></table></div>";

		message.setText(msg, "utf-8", "html"); // 내용, charset 타입, subtype
		message.setFrom(new InternetAddress(id, "Funiture")); // 보내는 사람의 메일 주소, 보내는 사람 이름
		
		return message;
	}

	// 인증코드 만들기
	public static String createKey() {
		StringBuffer key = new StringBuffer();
		Random rnd = new Random();

		for (int i = 0; i < 6; i++) { // 인증코드 6자리
			key.append((rnd.nextInt(10)));
		}
		return key.toString();
	}
	
	/*
	 * 메일 발송 sendSimpleMessage의 매개변수로 들어온 to는 인증번호를 받을 메일주소 MimeMessage 객체 안에 내가 전송할
	 * 메일의 내용을 담아준다. bean으로 등록해둔 javaMailSender 객체를 사용하여 이메일 send
	 */
	@Override
	public String sendSimpleMessage(String recipient) throws Exception {
		MimeMessage message = createMessage(recipient);
		
		try {
			// 메일 발송에서 터짐 - 
			javaMailSender.send(message); // 메일 발송
			
		} catch (MailException es) {
			es.printStackTrace();
			throw new IllegalArgumentException();
		}
		return ePw; // 메일로 보냈던 인증 코드를 서버로 리턴
	}
	
	// ePw 받기 위함
	@Override
	public String sendEpwForCompare() {
		
		return ePw;
	}
	
	
	
	
}
