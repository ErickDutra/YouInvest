package com.investmonitor.api.invest_monitor_api.service;

import java.util.ArrayList;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import com.investmonitor.api.invest_monitor_api.dto.ActionDto;
import com.investmonitor.api.invest_monitor_api.dto.ActionSendDto;
import com.investmonitor.api.invest_monitor_api.dto.FiisSendDto;
import com.investmonitor.api.invest_monitor_api.integration.ActivesIntegrationService;
import com.investmonitor.api.invest_monitor_api.models.enums.CommodityType;

@Service 
public class ActionServiceIntegration {

    private static final Logger log = LoggerFactory.getLogger(ActionServiceIntegration.class);

    private final AcoesService acoesService;
    private final ActivesIntegrationService actionIntegration; 

    public ActionServiceIntegration(AcoesService acoesService, ActivesIntegrationService actionIntegration){
        this.acoesService = acoesService;
        this.actionIntegration = actionIntegration;
    }

    public List<ActionSendDto> getAllMarketActions(){
        List<ActionSendDto> list= new ArrayList<>();
        try{
            List<ActionDto> items = acoesService.findAll();
            log.info("Encontrados {} itens no banco", items.size());
            for(ActionDto item : items){
                log.debug("Processando item: {}", item);
                if(item.type().equals(CommodityType.ACOES)){
                    String code = item.code();
                    if (code != null) {
                        log.info("Fazendo requisição para código: {}", code.toLowerCase());
                        ActionSendDto action = actionIntegration.getAction(code.toLowerCase());
                        list.add(action);
                    } else {
                        log.info("Código nulo para item: {}", item);
                    }
                } else {
                    log.info("Item ignorado, tipo não é ACOES: {}", item.type());
                }
            }
        } catch (Exception e) {
            log.error("Erro em getAllMarketActions", e);
        }
        log.info("Retornando {} ações", list.size());
        return list;
    } 

     public List<FiisSendDto> getAllMarketFiis(){
        List<FiisSendDto> list= new ArrayList<>();
        try{
            List<ActionDto> items = acoesService.findAll();
            log.info("Encontrados {} itens no banco", items.size());
            for(ActionDto item : items){
                log.debug("Processando item: {}", item);
                if(item.type().equals(CommodityType.FIIS)){
                    String code = item.code();
                    if (code != null) {
                        log.info("Fazendo requisição para código: {}", code.toLowerCase());
                        FiisSendDto action = actionIntegration.getFiis(code.toLowerCase());
                        list.add(action);
                    } else {
                        log.info("Código nulo para item: {}", item);
                    }
                } else {
                    log.info("Item ignorado, tipo não é ACOES: {}", item.type());
                }
            }
        } catch (Exception e) {
            log.error("Erro em getAllMarketActions", e);
        }
        log.info("Retornando {} ações", list.size());
        return list;
    } 




    public ActionSendDto getAction(String code){
        ActionSendDto action = actionIntegration.getAction(code.toLowerCase());
        return action;
    }
}
