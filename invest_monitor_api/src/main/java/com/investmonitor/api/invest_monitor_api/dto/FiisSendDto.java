package com.investmonitor.api.invest_monitor_api.dto;

import java.math.BigDecimal;

public record FiisSendDto(
 BigDecimal cotacao,
  String pvp,
  String variacao_12m,
  String dy,
  String liquidez,
  String url
) {
    
}
