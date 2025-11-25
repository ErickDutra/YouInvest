package com.investmonitor.api.invest_monitor_api.controller;



import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import com.investmonitor.api.invest_monitor_api.dto.AcoesDto;
import com.investmonitor.api.invest_monitor_api.dto.ActionDto;
import com.investmonitor.api.invest_monitor_api.dto.ActionSendDto;
import com.investmonitor.api.invest_monitor_api.dto.FiisSendDto;
import com.investmonitor.api.invest_monitor_api.service.AcoesService;
import com.investmonitor.api.invest_monitor_api.service.ActionServiceIntegration;




@Controller
@CrossOrigin("*")
public class AcoesController {
    

    AcoesService acoesService;
    ActionServiceIntegration actionIntegration;
    public  AcoesController(AcoesService acoesService, ActionServiceIntegration actionIntegration){
        this.acoesService = acoesService;
        this.actionIntegration = actionIntegration;    }

    @PostMapping("/cadastrar/list")
    public ResponseEntity<String> cadastrarList(@RequestBody List<AcoesDto> entity) {
        acoesService.createList(entity);
        return ResponseEntity.ok("Cadastrado com sucesso");
    }

    @GetMapping("/getMarketActions")
    public ResponseEntity<List<ActionSendDto>> getMarketActions(){
        return ResponseEntity.ok(actionIntegration.getAllMarketActions());
    }

     @GetMapping("/getMarketFiis")
    public ResponseEntity<List<FiisSendDto>> getMarketFiis(){
        return ResponseEntity.ok(actionIntegration.getAllMarketFiis());
    }


      @GetMapping("/getall")
    public ResponseEntity<List<ActionDto>> getAll(){
        return ResponseEntity.ok(acoesService.findAll());
    }

    @GetMapping("/get/{code}")
    public ResponseEntity<ActionSendDto> getAction(@PathVariable String code){
        return ResponseEntity.ok(actionIntegration.getAction(code));
    }

}
