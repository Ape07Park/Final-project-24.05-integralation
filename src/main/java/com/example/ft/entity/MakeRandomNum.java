package com.example.ft.entity;

import java.util.Random;
import lombok.NoArgsConstructor;

@NoArgsConstructor
public class MakeRandomNum {

    public String createRandomNumber() {
        Random rand = new Random();
        rand.setSeed(System.currentTimeMillis()); // 시드값 설정

        StringBuilder randomNum = new StringBuilder();
        for (int i = 0; i < 6; i++) {
            String random = Integer.toString(rand.nextInt(10));
            randomNum.append(random);
        }

        return randomNum.toString();
    }
}
