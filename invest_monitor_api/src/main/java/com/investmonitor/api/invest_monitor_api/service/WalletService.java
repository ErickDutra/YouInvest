package com.investmonitor.api.invest_monitor_api.service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.investmonitor.api.invest_monitor_api.dto.WalletDto;
import com.investmonitor.api.invest_monitor_api.dto.WalletItemDto;
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
    }public List<WalletItemDto> getUserPortfolio(String userId) {

    Map<String, WalletItemDto> map = new HashMap<>();

    for (Wallet item : repository.findByUserId(userId)) {

        WalletItemDto wallet = map.get(item.getCode());

        if (wallet == null) {
            wallet = new WalletItemDto();
            wallet.setCode(item.getCode());
            wallet.setQuantity(0);
            wallet.setPrice(BigDecimal.ZERO);
            wallet.setType(item.getType());
            map.put(item.getCode(), wallet);
        }

      
        if (item.getStatus() == StatusCommodity.BUY) {
            BigDecimal qtdAnterior = BigDecimal.valueOf(wallet.getQuantity());
            BigDecimal qtdNova = BigDecimal.valueOf(item.getQuantity());

            BigDecimal totalAnterior = wallet.getPrice().multiply(qtdAnterior);
            BigDecimal totalCompra = item.getPrice().multiply(qtdNova);

            int novaQuantidade = wallet.getQuantity() + item.getQuantity();

            BigDecimal novoPrecoMedio = BigDecimal.ZERO;

            if (novaQuantidade > 0) {
                novoPrecoMedio = totalAnterior.add(totalCompra)
                        .divide(BigDecimal.valueOf(novaQuantidade), RoundingMode.HALF_UP);
            }

            wallet.setPrice(novoPrecoMedio);
            wallet.setQuantity(novaQuantidade);
        }

        
        else if (item.getStatus() == StatusCommodity.SELL) {

            int novaQuantidade = wallet.getQuantity() - item.getQuantity();
            wallet.setQuantity(novaQuantidade);

            
            if (novaQuantidade <= 0) {
                wallet.setPrice(BigDecimal.ZERO); 
            }
        }
    }

    return map.values().stream()
        .filter(w -> w.getQuantity() > 0)
        .collect(Collectors.toList());
}

}
