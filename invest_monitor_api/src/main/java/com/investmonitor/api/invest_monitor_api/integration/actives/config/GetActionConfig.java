package com.investmonitor.api.invest_monitor_api.integration.actives.config;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Lazy;

import com.investmonitor.api.invest_monitor_api.integration.actives.GetAction;

import feign.Feign;
import feign.slf4j.Slf4jLogger;

@Configuration
public class GetActionConfig {
    @Bean
    @Lazy
    public  GetAction GetAction(){
        return Feign.builder()
                .decoder(new feign.jackson.JacksonDecoder())
                .encoder(new feign.jackson.JacksonEncoder())
                .logger(new Slf4jLogger(GetAction.class))
                .logLevel(feign.Logger.Level.FULL)
                .target(GetAction.class, "http://localhost:3333");

    }
}
