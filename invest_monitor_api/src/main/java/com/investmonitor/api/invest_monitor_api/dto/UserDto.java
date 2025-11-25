package com.investmonitor.api.invest_monitor_api.dto;

public record UserDto(String id, String email, String password, String name) {

    public static UserDto fromEntity(com.investmonitor.api.invest_monitor_api.models.Users user) {
        return new UserDto(user.getId(), user.getEmail(), user.getPassword(), user.getName());
    }

    public com.investmonitor.api.invest_monitor_api.models.Users toEntity() {
        return com.investmonitor.api.invest_monitor_api.models.Users.builder()
            .id(id)
            .email(email)
            .password(password)
            .name(name)
            .build();
    }
}