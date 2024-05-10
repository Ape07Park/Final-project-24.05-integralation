package com.example.ft.entity;

import java.time.LocalDate; 
import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
@NoArgsConstructor
@AllArgsConstructor
@Builder   // 원하는 데이터만 골라서 처리 하겠다.

public class Order {
	private int oid;         
	private String email;    
	private String status;    
	private String name;   
	private String postCode;
	private String addr;    
	private String detailAddr;    
	private String tel;    
	private String req;    
	private String way;    
	private int totalPrice; 
	private LocalDateTime regDate;
	private int isDeleted;  
	private String orderId;  
}

