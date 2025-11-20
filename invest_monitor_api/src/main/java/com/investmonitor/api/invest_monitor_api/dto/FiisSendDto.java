package com.investmonitor.api.invest_monitor_api.dto;

public record FiisSendDto(
 String cotacao,
  String pvp,
  String variacao_12m,
  String dy,
  String liquidez,
  String url
) {
    
}
