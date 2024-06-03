package com.example.ft.controller;

import net.nurigo.sdk.NurigoApp;
import net.nurigo.sdk.message.model.Message;
import net.nurigo.sdk.message.request.SingleMessageSendingRequest;
import net.nurigo.sdk.message.response.SingleMessageSentResponse;
import net.nurigo.sdk.message.service.DefaultMessageService;

import org.json.simple.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.ft.entity.MakeRandomNum;

import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * MessageController는 단일 메시지를 발송하는 REST 컨트롤러입니다.
 */
@Slf4j
@RequiredArgsConstructor
@RestController

@RequestMapping("/sms")
public class MessageController {
	
	// coolsms API 키를 application.properties에서 주입받습니다.
	@Value("${coolsms.api.key}")
    private String apiKey;
    
	// coolsms API 비밀 키를 application.properties에서 주입받습니다.
    @Value("${coolsms.api.secret}")
    private String apiSecretKey;
    
    @Value("${coolsms.api.phoneNum}")
    private String phoneNum;
	
	// DefaultMessageService 인스턴스를 저장할 변수입니다.
	private DefaultMessageService messageService;
	
	private MakeRandomNum makeRandomNum = new MakeRandomNum();
	
	int verifyCode; 
	
	
	/**
	 * 객체 생성 후 초기화 메서드입니다. coolsms API를 초기화합니다.
	 */
	@PostConstruct
	private void init() {
	    // coolsms API를 초기화합니다. API 키와 비밀 키를 사용하여 인증합니다.
	    this.messageService = NurigoApp.INSTANCE.initialize(apiKey, apiSecretKey, "https://api.coolsms.co.kr");
	}
    
    /**
     * 단일 메시지를 발송하는 메서드입니다.
     * 
     */
	
	// axios를 이용해 받는 사람의 번호를 가져오고 코드와 메시지 발송
    @PostMapping("/sendsms")
    public SingleMessageSentResponse sendOne(@RequestBody String to) {
    	
    	verifyCode = Integer.parseInt(makeRandomNum.createRandomNumber());
    	
    	String recipient = to.replaceAll("[^0-9]", "");
    	
    	// Message 객체를 생성하고 발신번호와 수신번호를 설정합니다.
        Message message = new Message();
        
        // 발신번호는 반드시 01012345678 형태로 입력되어야 합니다.
        message.setFrom(phoneNum);
        
        // 수신번호를 설정합니다.
        message.setTo(recipient);
        
        // 메시지 내용을 설정합니다.
        message.setText("[Funiture] 아래의 인증번호를 입력해주세요\n" + verifyCode);

        // 메시지를 발송하고 발송 결과를 반환합니다.
        SingleMessageSentResponse response = this.messageService.sendOne(new SingleMessageSendingRequest(message));
        
        return response;
    }
    
    /**
     * 발송한 인증 코드를 리엑트로 보내는 메서드입니다. 
     * *서버에서 다 처리해서 true false만 보내자 userInput을 서버로 보내야함
     * 아니면 json으로 풋해서 보내볼까?
     * @return int 발송된 인증 코드를 반환합니다.
     */
    @GetMapping("/sendVerifyCode")
    public JSONObject sendVerifyCode() {
        // 발송된 인증 코드를 반환합니다.
    	JSONObject jCode = new JSONObject();
    	jCode.put("verifyCode", verifyCode);
    	
        return jCode;
    }
    
}
