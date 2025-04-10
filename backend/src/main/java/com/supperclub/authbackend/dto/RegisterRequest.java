package com.supperclub.authbackend.dto;

import lombok.Data;

@Data
public class RegisterRequest {
    private String firstName;
    private String surname;
    private int age;
    private String gender;
    private String city;
    private String state;
    private String username;
    private String email;
    private String password;
    private String confirmPassword;
}
