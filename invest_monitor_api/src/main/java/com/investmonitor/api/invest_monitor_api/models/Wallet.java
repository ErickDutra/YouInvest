package com.investmonitor.api.invest_monitor_api.models;

import java.math.BigDecimal;
import java.util.Date;

import com.investmonitor.api.invest_monitor_api.models.enums.CommodityType;
import com.investmonitor.api.invest_monitor_api.models.enums.StatusCommodity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "wallet")
public class Wallet {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    String id;
    Date dtCreated;
    BigDecimal price;
    String code;
    Integer quantity;
    StatusCommodity status;
    CommodityType type;
}
