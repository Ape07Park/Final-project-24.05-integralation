package com.example.ft.entity;

import java.time.LocalDateTime;
import java.util.List;

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
public class Item {
	private int iid;
	private String name;
	private String category;
	private String img1;
	private String img2;
	private String img3;
	private String content;
	private int price;
	private int salePrice;
	private LocalDateTime saleDate;
	private LocalDateTime regDate;
	private int isDeleted;
	private int totalSta;
	private String company;
	private int cost;
}