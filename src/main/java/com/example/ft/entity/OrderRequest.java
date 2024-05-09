package com.example.ft.entity;


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

/* 
 * * 한 번의 요청에서 두 가지 종류의 객체를 전달하기 위해 하나의 컨테이너 객체를 사용
 */
public class OrderRequest {
    private Order order;
    private List<OrderItem> orderItems;

   
}
