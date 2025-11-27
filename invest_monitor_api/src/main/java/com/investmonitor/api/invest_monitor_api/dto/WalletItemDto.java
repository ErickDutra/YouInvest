package com.investmonitor.api.invest_monitor_api.dto;

import java.math.BigDecimal;

import com.investmonitor.api.invest_monitor_api.models.enums.CommodityType;

public class WalletItemDto {
String code;
BigDecimal price;
Integer quantity;
CommodityType type;

public String getCode() {
    return code;
}
public void setCode(String code) {
    this.code = code;
}
public BigDecimal getPrice() {
    return price;
}
public void setPrice(BigDecimal price) {
    this.price = price;
}
public Integer getQuantity() {
    return quantity;
}
public void setQuantity(Integer quantity) {
    this.quantity = quantity;
}
public CommodityType getType() {
    return type;
}
public void setType(CommodityType type) {
    this.type = type;
}
}
