package com.investmonitor.api.invest_monitor_api.integration;

import org.springframework.stereotype.Service;

import com.investmonitor.api.invest_monitor_api.dto.ActionSendDto;
import com.investmonitor.api.invest_monitor_api.dto.FiisSendDto;
import com.investmonitor.api.invest_monitor_api.integration.actives.GetAction;
import com.investmonitor.api.invest_monitor_api.integration.actives.GetFiis;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ActivesIntegrationService {

    private final GetAction getAction;
    private final GetFiis getFiis;


    public ActionSendDto getAction(String code){
        return getAction.getActionByCode(code);
    }

    public FiisSendDto getFiis(String code){
        return getFiis.getFiisByCode(code);
    }
}
