package com.sky.entity;

import lombok.Data;

@Data
public class User {
    private int id;                   // 用户ID
    private String username;           // 用户名
    private String password;           // 密码
    private String signature;          // 个人签名
    private double cet4Score;          // 四级成绩
    private double cet6Score;          // 六级成绩
    private double ieltsScore;         // 雅思成绩
    private double toeflScore;         // 托福成绩
    private int vocabularySize;        // 词汇量
}
