package com.example.ft.controller;

import org.json.simple.JSONObject;
import org.springframework.http.HttpStatus; 
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;
import com.example.ft.service.EmailService;

import lombok.RequiredArgsConstructor;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@RequiredArgsConstructor
@RestController
@RequestMapping("/email")
public class EmailConfigController {
	private final EmailService emailService;

	@PostMapping("/message")
	@ResponseBody
    public String mailConfirm(@RequestParam String email) throws Exception {
        String code = emailService.sendSimpleMessage(email);
        return code;
    }
	
	// ePw 전송하기
	@GetMapping("/getEpw")
    public JSONObject getEpw() {
        String ePw = emailService.sendEpwForCompare();
    	JSONObject jCode = new JSONObject();
    	jCode.put("ePw", ePw);
        return jCode;
    }
}