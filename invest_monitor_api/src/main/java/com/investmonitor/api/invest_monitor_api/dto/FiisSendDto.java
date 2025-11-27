package com.investmonitor.api.invest_monitor_api.dto;

public record FiisSendDto(
  String code,
    ValueWithRaw cotacao,
    ValueWithRaw pvp,
    ValueWithRaw variacao_12m,
    ValueWithRaw dy,
    ValueWithRaw liquidez,
    String url
) {

}
