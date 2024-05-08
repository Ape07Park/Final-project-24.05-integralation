package com.example.ft.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder

public class Recipient {
	
	private String name;   
	private String postCode;
	private String addr;    
	private String detailAddr;    
	private String tel;    
	private String req;    

}
