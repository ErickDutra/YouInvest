package com.investmonitor.api.invest_monitor_api.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.investmonitor.api.invest_monitor_api.dto.UserDto;
import com.investmonitor.api.invest_monitor_api.models.Users;
import com.investmonitor.api.invest_monitor_api.repository.UserRepository;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Transactional
    public ResponseEntity<String> register(UserDto dto) {
        if (dto.email() == null || dto.email().isBlank()) {
            return ResponseEntity.badRequest().body("Email inválido");
        }
        if (dto.password() == null || dto.password().isBlank()) {
            return ResponseEntity.badRequest().body("Password inválida");
        }
        if (dto.name() == null || dto.name().isBlank()) {
            return ResponseEntity.badRequest().body("Nome inválido");
        }
        if (userRepository.findByEmail(dto.email()) != null) {
            return ResponseEntity.badRequest().body("Email já cadastrado");
        }
        Users entity = dto.toEntity();
        userRepository.save(entity);
        return ResponseEntity.ok("Usuário registrado com sucesso");
    }

    public ResponseEntity<UserDto> login(String email, String password) {
        if (email == null || email.isBlank() || password == null || password.isBlank()) {
            return ResponseEntity.badRequest().body(null);
        }
        Users user = userRepository.findByEmail(email);
        if (user == null || !user.getPassword().equals(password)) {
            return ResponseEntity.badRequest().body(null);
        }
        return ResponseEntity.ok(UserDto.fromEntity(user));
    }

    public List<UserDto> findAll() {
        return userRepository.findAll().stream().map(UserDto::fromEntity).collect(Collectors.toList());
    }

}