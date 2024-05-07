package com.example.ft.entity;

import org.apache.ibatis.annotations.Select;

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


public class OrderItem {
	private int oiid;
	private int oid;
	private int lid;
	private int ioid;
	private int count;
	private int price;
	private int isDeleted;
}


