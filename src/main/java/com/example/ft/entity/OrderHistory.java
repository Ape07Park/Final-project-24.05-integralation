package com.example.ft.entity;

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
@Builder  
public class OrderHistory {
	private int iid;
	private int oid; 
	private String email;
	private String status;   
	private int totalPrice; 
	private int count;
	private int price;
	private String name;   
	private String img1;
	private String option;
	private LocalDateTime regDate;
	private String way;
	private int isDeleted;
	private int review;
	private int oiid;
	private String postCode;
	private String addr;
	private String detailAddr;
	private String tel;
}