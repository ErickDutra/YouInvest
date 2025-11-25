package com.investmonitor.api.invest_monitor_api.dto;

import com.investmonitor.api.invest_monitor_api.models.Acoes;

public record BuyAcoesDto(Acoes acoes, String  userId, Integer quantity) {
    
}
