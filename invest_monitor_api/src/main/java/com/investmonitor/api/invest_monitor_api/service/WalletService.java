package com.investmonitor.api.invest_monitor_api.service;

import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.investmonitor.api.invest_monitor_api.dto.WalletDto;
import com.investmonitor.api.invest_monitor_api.models.Wallet;
import com.investmonitor.api.invest_monitor_api.models.enums.StatusCommodity;
import com.investmonitor.api.invest_monitor_api.repository.WalletRepository;

@Service
public class WalletService {
     private final WalletRepository repository;

    public WalletService(WalletRepository repository) {
        this.repository = repository;
    }

    public List<WalletDto> findAll() {
        return repository.findAll().stream().map(WalletDto::fromEntity).collect(Collectors.toList());
    }

  
    public WalletDto findById(String id) {
        Optional<Wallet> opt = repository.findById(id);
        return opt.map(WalletDto::fromEntity).orElseThrow(() -> new RuntimeException("Wallet not found: " + id));
    }

  
    public WalletDto create(WalletDto dto) {
        Wallet entity = dto.toEntity();
        if (entity.getDtCreated() == null) {
            entity.setDtCreated(new Date());
        }
        Wallet saved = repository.save(entity);
        return WalletDto.fromEntity(saved);
    }

  
    public WalletDto update(String id, WalletDto dto) {
     Wallet existing = repository.findById(id).orElseThrow(() -> new RuntimeException("Wallet not found: " + id));
    
    existing.setCode(dto.code());
    existing.setQuantity(dto.quantity());
    existing.setPrice(dto.value());
    existing.setStatus(dto.status());
        Wallet saved = repository.save(existing);
        return WalletDto.fromEntity(saved);
    }

  
    public void delete(String id) {
        repository.deleteById(id);
    }

    public Map<String, Integer> getUserPortfolio(String userId) {
        return repository.findByUserId(userId).stream()
            .collect(Collectors.groupingBy(
                Wallet::getCode,
                Collectors.summingInt(w -> w.getStatus() ==StatusCommodity.BUY ? w.getQuantity() : -w.getQuantity())
            ));
    }
}
