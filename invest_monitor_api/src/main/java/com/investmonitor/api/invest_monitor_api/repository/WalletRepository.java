package com.investmonitor.api.invest_monitor_api.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.investmonitor.api.invest_monitor_api.models.Wallet;

@Repository
public interface WalletRepository extends JpaRepository<Wallet, String> {
    List<Wallet> findByUserIdAndCode(String userId, String code);
    List<Wallet> findByUserId(String userId);
}
