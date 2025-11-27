package com.investmonitor.api.invest_monitor_api.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.investmonitor.api.invest_monitor_api.dto.WalletItemDto;
import com.investmonitor.api.invest_monitor_api.service.WalletService;

@RestController
@RequestMapping("/wallet")
@CrossOrigin("*")
public class WalletController {

    private final WalletService walletService;

    public WalletController(WalletService walletService) {
        this.walletService = walletService;
    }

    @GetMapping("/portfolio/{userId}")
    public ResponseEntity< List<WalletItemDto>> getUserPortfolio(@PathVariable String userId) {
         List<WalletItemDto> portfolio = walletService.getUserPortfolio(userId);
        return ResponseEntity.ok(portfolio);
    }
}