package com.example.ft.config;

import java.util.Properties;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.PropertySource;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.JavaMailSenderImpl;

/*
 * 빈은 Spring IoC(Inversion of Control) 컨테이너에 의해 관리되는 객체를 의미합니다. 
 * Spring에서는 애플리케이션의 객체를 빈으로 등록하고, 빈 간의 의존성을 관리하며, 
 * 애플리케이션 실행 중에 빈을 생성, 설정, 주입 및 파괴
 */

@Configuration // 이 클래스가 Spring 설정 클래스임을 나타냄
@PropertySource("classpath:application.properties") // 어떤 파일에서 설정 값을 읽을지
public class EmailConfig {

	// application.properties 파일에서 해당 속성 값을 읽어와 필드에 주입
	@Value("${spring.mail.username}")
	private String id;
	@Value("${spring.mail.password}")
	private String password;
	@Value("${spring.mail.host}")
	private String host;
	@Value("${spring.mail.port}")
	private int port;

	@Bean // @Bean: 이 메서드가 반환하는 객체가 Spring 컨텍스트에 의해 관리되는 빈이 됨
	public JavaMailSender javaMailService() {
		JavaMailSenderImpl javaMailSender = new JavaMailSenderImpl(); // 객체를 생성하고 설정 값을 주입
		javaMailSender.setHost(host); // smtp 서버 주소
		javaMailSender.setUsername(id); // 설정(발신) 메일 아이디
		javaMailSender.setPassword(password); // 설정(발신) 메일 패스워드
		javaMailSender.setPort(port); // smtp port
		javaMailSender.setJavaMailProperties(getMailProperties()); // 메일 인증서버 정보 가져온다.
		javaMailSender.setDefaultEncoding("UTF-8");
		return javaMailSender;
	}

	private Properties getMailProperties() { // 메일 서버 속성 설정
		Properties properties = new Properties(); // Properties 객체를 생성하고 여러 속성을 설정
		properties.setProperty("mail.transport.protocol", "smtp"); // 프로토콜 설정
		properties.setProperty("mail.smtp.auth", "true"); // smtp 인증
		properties.setProperty("mail.smtp.starttls.enable", "true"); // smtp starttls 사용
		properties.setProperty("mail.debug", "true"); // 디버그 사용
		properties.setProperty("mail.smtp.ssl.trust", host); // ssl 인증 서버 주소
		properties.setProperty("mail.smtp.ssl.enable", "true"); // ssl 사용
		return properties;
	}

}
