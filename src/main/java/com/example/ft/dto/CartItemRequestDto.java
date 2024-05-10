package com.example.ft.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class CartItemRequestDto {

    private int cid;
    private int iid;  // 아이템 아이디
    private String email;   // 유저의 이메일
    private int count;
    private int ioid;

    @Builder.Default
    List<ItemOptionV2> optionList = new ArrayList<>();

    @Data
    public static class ItemOptionV2 {
        private int ioid;    // 아이템 옵션 아이디
        private int count;  //  저장하고자 하는 수량
    }
}

