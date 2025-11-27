package com.investmonitor.api.invest_monitor_api.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.investmonitor.api.invest_monitor_api.dto.UserDto;
import com.investmonitor.api.invest_monitor_api.service.UserService;

@RestController
@RequestMapping("/user")
@CrossOrigin("*")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody UserDto dto) {
        return userService.register(dto);
    }

    @PostMapping("/login")
    public ResponseEntity<UserDto> login(@RequestBody LoginRequest request) {
        return userService.login(request.email(), request.password());
    }

    @GetMapping("/all")
    public ResponseEntity<List<UserDto>> getAll() {
        List<UserDto> users = userService.findAll();
        return ResponseEntity.ok(users);
    }

    public record LoginRequest(String email, String password) {}
}

// [
//     {
//         "id": "3c1283da-1284-4d6f-900f-ad78cabe8e35",
//         "email": "teste@gmail.com",
//         "password": "teste",
//         "name": "erick"
//     },
//     {
//         "id": "16c9214a-ba08-45bc-8c90-7bf0e8b3e4f9",
//         "email": "teste2@gmail.com",
//         "password": "teste",
//         "name": "erick"
//     }
// ]