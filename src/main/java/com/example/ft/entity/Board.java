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
public class Board {
	private int bid;         // 게시물 고유 키(프라이 키)
	private int iid;         //상품 고유 키 (폴링킹)
	private String email;    // 작성자의 고유 키
	private String type;    // 게시글 종류
	private String typeQnA;    // 게시글 종류에 하위 종류?(배송문의, 상품문의, 입금문의,...)
	private String title;    // 게시글 타이틀 제목
	private LocalDateTime regDate;   // 게시글  작성 시간
	private String content;  // 게시글 내용
	private String img;      // 게시글 첨부 이미지
	private int isDeleted;   // 삭제 여부
	private int sta;   // 리뷰 게시물 한번에 처리 가능
	private int vid;
	private String replyStatus;
	private int oiid; // 오더 아이템 고유키
	private int secretMsg;
}