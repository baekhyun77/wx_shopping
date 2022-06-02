package com;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration;

@MapperScan("com.mapper")

@SpringBootApplication(scanBasePackages = "",exclude= {SecurityAutoConfiguration.class })

public class WxShoppingApplication {

    public static void main(String[] args) {
        SpringApplication.run(WxShoppingApplication.class, args);
    }

}

