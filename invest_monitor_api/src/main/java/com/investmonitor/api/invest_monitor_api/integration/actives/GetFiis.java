package com.investmonitor.api.invest_monitor_api.integration.actives;

import org.springframework.cloud.openfeign.FeignClient;


import com.investmonitor.api.invest_monitor_api.dto.FiisSendDto;

import feign.Param;
import feign.RequestLine;


@FeignClient(name = "fiis", url = "http://localhost:3333")
public interface GetFiis {

        @RequestLine("GET /fiis/{code}")
        FiisSendDto getFiisByCode(@Param("code") String code);

}
