package com.investmonitor.api.invest_monitor_api.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.investmonitor.api.invest_monitor_api.models.Acoes;


@Repository
public interface AcoesRepository extends JpaRepository<Acoes, String> {
    Acoes findByCode(String code);
    boolean existsByCode(String code);
}
