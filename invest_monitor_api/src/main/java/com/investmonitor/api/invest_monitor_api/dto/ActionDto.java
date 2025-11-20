package com.investmonitor.api.invest_monitor_api.dto;

import com.investmonitor.api.invest_monitor_api.models.Acoes;
import com.investmonitor.api.invest_monitor_api.models.enums.CommodityType;

public record ActionDto(String code, CommodityType type) {
       public Acoes toEntity() {
        return Acoes.builder()
                .code(this.code)
                .type(type)
                .build();
    }

    public static ActionDto fromEntity(Acoes a) {
        if (a == null) return null;
        return new ActionDto(a.getCode(), a.getType());
    }
}
