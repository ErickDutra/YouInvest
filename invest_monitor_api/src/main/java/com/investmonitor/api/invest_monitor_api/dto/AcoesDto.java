package com.investmonitor.api.invest_monitor_api.dto;

import com.investmonitor.api.invest_monitor_api.models.Acoes;
import com.investmonitor.api.invest_monitor_api.models.enums.CommodityType;
import com.investmonitor.api.invest_monitor_api.models.enums.MarketType;


public record AcoesDto(String id, String code, CommodityType tipo, MarketType market) {
    public Acoes toEntity() {
        return Acoes.builder()
                .id(this.id)
                .code(this.code)
                .type(this.tipo)
                .market(market)
                .build();
    }

    public static AcoesDto fromEntity(Acoes a) {
        if (a == null) return null;
        return new AcoesDto(a.getId(), a.getCode(), a.getType(), a.getMarket());
    }
}