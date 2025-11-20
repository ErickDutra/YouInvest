package com.investmonitor.api.invest_monitor_api.integration.actives;

import org.springframework.cloud.openfeign.FeignClient;

import com.investmonitor.api.invest_monitor_api.dto.ActionSendDto;

import feign.Param;
import feign.RequestLine;


@FeignClient(name = "actions", url = "http://localhost:3333")
public interface GetAction {

    @RequestLine("GET /acoes/{code}")
    ActionSendDto getActionByCode(@Param("code") String code);
}
