package com.investmonitor.api.invest_monitor_api.dto;

public record ActionSendDto(
    ValueWithRaw cotacao,
    ValueWithRaw pvp,
    ValueWithRaw variacao_12m,
    ValueWithRaw pl,
    ValueWithRaw dy,
    String url
) {
    
}
