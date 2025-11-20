package com.investmonitor.api.invest_monitor_api.dto;

import java.math.BigDecimal;
import java.util.Date;

import com.investmonitor.api.invest_monitor_api.models.Wallet;
import com.investmonitor.api.invest_monitor_api.models.enums.StatusCommodity;

public record WalletDto(
        String id,
        Date dtCreated,
        BigDecimal value,
        String code,
        Integer quantity,
        StatusCommodity status
) {
    public Wallet toEntity() {
        return Wallet.builder()
                .id(this.id)
                .dtCreated(this.dtCreated)
                .price(this.value)
                .code(this.code)
                .quantity(this.quantity)
                .status(this.status)
                .build();
    }

    public static WalletDto fromEntity(Wallet w) {
        if (w == null) return null;
        return new WalletDto(
                w.getId(),
                w.getDtCreated(),
                w.getPrice(),
                w.getCode(),
                w.getQuantity(),
                w.getStatus()
        );
    }
}

