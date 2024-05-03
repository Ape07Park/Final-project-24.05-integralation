package com.example.ft.entity;

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
public class ItemRequest {
	private int iid; // 상품 ID
    private Integer[] ioid; // 옵션 ID 배열
    private Integer[] itid; // 태그 ID 배열
    private String name; // 상품명
    private String category; // 가구 종류
    private String img1; // 이미지 URL 1
    private String img2; // 이미지 URL 2
    private String img3; // 이미지 URL 3
    private String content; // 내용
    private int price; // 가격
    private String[] option; // 옵션
    private int[] count; // 갯수
    private String[] tag; // 태그
    private String company;
	private int cost;
	private String email;
}