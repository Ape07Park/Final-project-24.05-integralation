package com.example.ft.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import com.example.ft.entity.Recipient;
import com.example.ft.service.RecipientService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Controller
@RequestMapping("/order")
@RequiredArgsConstructor
public class RecipientController {
    private final RecipientService recipientService;

    @PostMapping("/insertRecipient")
    @ResponseBody // 응답을 HTTP 응답 본문으로 직접 반환
    public String insertRecipient(@RequestBody Recipient recipient) {
        // 여기서 Recipient 객체를 사용하여 데이터베이스에 저장하면 됩니다.
        recipientService.insertRecipient(recipient);
        return "Success";
    }
    
    
}

//바인딩(binding)은 두 가지 사물을 서로 연결하는 과정이나 방법을 의미합니다. 스프링에서의 바인딩은 HTTP 요청의 데이터를 자바 객체에 매핑하는 과정을 가리킵니다.
//
//@ModelAttribute 어노테이션을 사용하여 요청 파라미터를 자바 객체에 바인딩할 수 있습니다. 이것은 주로 HTML 폼으로부터 입력된 데이터를 컨트롤러의 메서드로 전달하는 데 사용됩니다.
//
//예를 들어, HTML 폼으로부터 받은 데이터를 Recipient 객체로 바인딩하는 과정은 다음과 같습니다.
//
//클라이언트(브라우저)에서 HTML 폼을 통해 서버에 데이터를 전송합니다.
//스프링 MVC는 컨트롤러에서 @PostMapping("/insert")으로 지정된 엔드포인트를 찾습니다.
//해당 엔드포인트에 도달하면 스프링 MVC는 HTTP 요청의 바디(body)에서 데이터를 추출합니다.
//이때, @ModelAttribute 어노테이션이 붙은 파라미터인 Recipient recipient를 찾습니다.
//요청된 데이터를 자동으로 Recipient 객체에 매핑하여 바인딩합니다.
//바인딩된 객체는 메서드의 파라미터로 전달됩니다.
//메서드는 이를 사용하여 비즈니스 로직을 수행합니다.
//이 과정에서 스프링 MVC는 요청 파라미터의 이름과 자바 객체의 필드 이름을 매핑하여 값을 할당합니다. 이를 통해 HTML 폼에서 입력한 데이터를 쉽게 자바 객체로 변환할 수 있습니다. 이러한 바인딩은 프론트엔드와 백엔드 간의 데이터 전달을 효율적으로 처리하는 데 도움이 됩니다.






