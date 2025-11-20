package com.investmonitor.api.invest_monitor_api.service;

import java.util.List;

import com.investmonitor.api.invest_monitor_api.dto.AcoesDto;
import com.investmonitor.api.invest_monitor_api.dto.ActionDto;

import java.util.Optional;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.interceptor.TransactionAspectSupport;

import com.investmonitor.api.invest_monitor_api.models.Acoes;
import com.investmonitor.api.invest_monitor_api.repository.AcoesRepository;

@Service
public class AcoesService {

    private static final Logger log = LoggerFactory.getLogger(AcoesService.class);

    private final AcoesRepository repository;

    public AcoesService(AcoesRepository repository) {
        this.repository = repository;
    }

    public List<ActionDto> findAll() {
        return repository.findAll().stream().map(ActionDto::fromEntity).collect(Collectors.toList());
    }

    public AcoesDto findById(String id) {
        Optional<Acoes> opt = repository.findById(id);
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
                if (repository.findByCode(acao.code()) != null) {
                    continue;
                }
                Acoes entity = acao.toEntity();
                repository.save(entity);
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
            if (repository.findByCode(dto.code()) != null) {
                return ResponseEntity.badRequest().body("Ja existe na base!");
            }
            Acoes entity = dto.toEntity();
            repository.save(entity);
            return ResponseEntity.ok("cadastrado com sucesso");
        } catch (Exception e) {
            log.error("Erro em create", e);
            TransactionAspectSupport.currentTransactionStatus().setRollbackOnly();
            return ResponseEntity.badRequest().body("Erro ao cadastrar: " + e.getMessage());
        }
    }

    public AcoesDto update(String id, AcoesDto dto) {
        Acoes existing = repository.findById(id).orElseThrow(() -> new RuntimeException("Acoes not found: " + id));
        existing.setCode(dto.code());
        Acoes saved = repository.save(existing);
        return AcoesDto.fromEntity(saved);
    }

    public void delete(String id) {
        repository.deleteById(id);
    }

}