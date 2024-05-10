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
public class Reply {
	private int rid;         // 게시물 고유 키(프라이 키)
	private String email;    // 작성자의 고유 키
	private int bid;         //상품 고유 키 (폴링킹)
	private String content;  // 게시글 내용
	private LocalDateTime regDate;   // 게시글  작성 시간
	private int isDeleted;   // 삭제 여부
	private int iid;    //아이템 고유키
}