package com.example.ft.entity;

import java.util.Random;

import lombok.NoArgsConstructor;

@NoArgsConstructor
public class MakeRandomNum {
	
	public String createRandomNumber() {
        Random rand = new Random();
        String randomNum = "";
        for (int i = 0; i < 6; i++) {
            String random = Integer.toString(rand.nextInt(10));
            randomNum += random;
        }

        return randomNum;
    }
}
