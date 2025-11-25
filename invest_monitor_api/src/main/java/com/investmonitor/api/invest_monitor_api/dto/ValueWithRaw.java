package com.investmonitor.api.invest_monitor_api.dto;

import java.math.BigDecimal;

public record ValueWithRaw(String raw, BigDecimal value) {}