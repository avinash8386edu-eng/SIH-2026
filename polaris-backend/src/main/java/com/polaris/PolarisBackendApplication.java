package com.polaris;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class PolarisBackendApplication {

    public static void main(String[] args) {
        SpringApplication.run(PolarisBackendApplication.class, args);
    }

}
