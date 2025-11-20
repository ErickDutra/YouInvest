package com.investmonitor.api.invest_monitor_api.models;

import com.investmonitor.api.invest_monitor_api.models.enums.CommodityType;
import com.investmonitor.api.invest_monitor_api.models.enums.MarketType;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.Check;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "acoes")
public class Acoes {
    

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    String id;
    String code;
    CommodityType type;
    @Check(constraints = "market >= 0 AND market <= 37")
    MarketType market;
}
