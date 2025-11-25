package com.investmonitor.api.invest_monitor_api.service;

import java.util.Date;
import java.util.List;

import com.investmonitor.api.invest_monitor_api.dto.AcoesDto;
import com.investmonitor.api.invest_monitor_api.dto.ActionDto;
import com.investmonitor.api.invest_monitor_api.dto.ActionSendDto;
import com.investmonitor.api.invest_monitor_api.dto.BuyAcoesDto;
import com.investmonitor.api.invest_monitor_api.dto.FiisSendDto;
import com.investmonitor.api.invest_monitor_api.integration.ActivesIntegrationService;

import java.util.Optional;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.interceptor.TransactionAspectSupport;

import com.investmonitor.api.invest_monitor_api.models.Acoes;
import com.investmonitor.api.invest_monitor_api.models.Wallet;
import com.investmonitor.api.invest_monitor_api.models.enums.CommodityType;
import com.investmonitor.api.invest_monitor_api.models.enums.StatusCommodity;
import com.investmonitor.api.invest_monitor_api.repository.AcoesRepository;
import com.investmonitor.api.invest_monitor_api.repository.WalletRepository;

@Service
public class AcoesService {

    private static final Logger log = LoggerFactory.getLogger(AcoesService.class);

    private final AcoesRepository acoesRepository;
    private final WalletRepository walletRepository;
  private final ActivesIntegrationService actionIntegration; 

    public AcoesService(AcoesRepository acoesRepository, WalletRepository walletRepository,ActivesIntegrationService actionIntegration) {
        this.acoesRepository = acoesRepository;
        this.walletRepository = walletRepository; 
        this.actionIntegration =actionIntegration;
    }

    public List<ActionDto> findAll() {
        return acoesRepository.findAll().stream().map(ActionDto::fromEntity).collect(Collectors.toList());
    }

    public AcoesDto findById(String id) {
        Optional<Acoes> opt = acoesRepository.findById(id);
        return opt.map(AcoesDto::fromEntity).orElseThrow(() -> new RuntimeException("Acoes not found: " + id));
    }

    @Transactional
    public ResponseEntity<String> createList(List<AcoesDto> dto) {
        if (dto == null || dto.isEmpty()) {
            return ResponseEntity.badRequest().body("Lista vazia ou nula");
        }
        try {
            log.info("createList size={}", dto.size());
            for (AcoesDto acao : dto) {
                if (acao == null) continue;
                if (acao.code() == null || acao.code().isBlank()) {
                    log.warn("dto com code inválido: {}", acao);
                    continue;
                }
                if (acoesRepository.findByCode(acao.code()) != null) {
                    continue;
                }
                Acoes entity = acao.toEntity();
                acoesRepository.save(entity);
            }
            return ResponseEntity.ok("lista cadastrada com sucesso");
        } catch (Exception e) {
            log.error("Erro em createList", e);
            TransactionAspectSupport.currentTransactionStatus().setRollbackOnly();
            return ResponseEntity.badRequest().body("Erro ao cadastrar lista: " + e.getMessage());
        }
    }

    @Transactional
    public ResponseEntity<String> create(AcoesDto dto) {
        if (dto == null) return ResponseEntity.badRequest().body("DTO nulo");
        try {
            if (dto.code() == null || dto.code().isBlank()) {
                return ResponseEntity.badRequest().body("code inválido");
            }
            if (acoesRepository.findByCode(dto.code()) != null) {
                return ResponseEntity.badRequest().body("Ja existe na base!");
            }
            Acoes entity = dto.toEntity();
            acoesRepository.save(entity);
            return ResponseEntity.ok("cadastrado com sucesso");
        } catch (Exception e) {
            log.error("Erro em create", e);
            TransactionAspectSupport.currentTransactionStatus().setRollbackOnly();
            return ResponseEntity.badRequest().body("Erro ao cadastrar: " + e.getMessage());
        }
    }

    public AcoesDto update(String id, AcoesDto dto) {
        Acoes existing = acoesRepository.findById(id).orElseThrow(() -> new RuntimeException("Acoes not found: " + id));
        existing.setCode(dto.code());
        Acoes saved = acoesRepository.save(existing);
        return AcoesDto.fromEntity(saved);
    }

    public void delete(String id) {
        acoesRepository.deleteById(id);
    }

    @Transactional
    public ResponseEntity<String> buyAction(BuyAcoesDto buy){
        Wallet wallet = new Wallet();
        Acoes acao = acoesRepository.findByCode(buy.acoes().getCode());
        if(acao.getType().equals(CommodityType.FIIS)
        ){
        FiisSendDto fiis = actionIntegration.getFiis(acao.getCode());
        wallet.setPrice(fiis.cotacao()); 
        wallet.setType(CommodityType.FIIS);
    }else{
        ActionSendDto action = actionIntegration.getAction(acao.getCode());
        wallet.setPrice(action.cotacao().value()); 
        wallet.setType(CommodityType.ACOES);
    }
    wallet.setCode(acao.getCode());
    wallet.setDtCreated(new Date());
    wallet.setQuantity(buy.quantity());
    wallet.setUserId(buy.userId());
    wallet.setStatus(StatusCommodity.BUY);
    walletRepository.save(wallet);
    return ResponseEntity.ok("Compra realizada com sucesso!");
    }   


    @Transactional
    public ResponseEntity<String> sellAction(BuyAcoesDto buy){
        Acoes acao = acoesRepository.findByCode(buy.acoes().getCode());
        if (acao == null) {
            return ResponseEntity.badRequest().body("Ação não encontrada");
        }

  
        List<Wallet> wallets = walletRepository.findByUserIdAndCode(buy.userId(), buy.acoes().getCode());
        int saldo = wallets.stream()
            .mapToInt(w -> w.getStatus() == StatusCommodity.BUY ? w.getQuantity() : -w.getQuantity())
            .sum();
        if (saldo < buy.quantity()) {
            return ResponseEntity.badRequest().body("Saldo insuficiente para venda");
        }

        Wallet wallet = new Wallet();
        if(acao.getType().equals(CommodityType.FIIS)){
            FiisSendDto fiis = actionIntegration.getFiis(acao.getCode());
            wallet.setPrice(fiis.cotacao()); 
            wallet.setType(CommodityType.FIIS);
        }else{
            ActionSendDto action = actionIntegration.getAction(acao.getCode());
            wallet.setPrice(action.cotacao().value()); 
            wallet.setType(CommodityType.ACOES);
        }
        wallet.setCode(acao.getCode());
        wallet.setDtCreated(new Date());
        wallet.setQuantity(buy.quantity());
        wallet.setUserId(buy.userId());
        wallet.setStatus(StatusCommodity.SELL);
        walletRepository.save(wallet);
        return ResponseEntity.ok("Venda realizada com sucesso!");
    } 
}