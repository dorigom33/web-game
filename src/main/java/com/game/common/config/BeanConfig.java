package com.game.common.config;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.game.common.filter.AuthFilter;

@Configuration
public class BeanConfig {

    @Value("${auth.include.urls}")
    private List<String> urlPatterns = new ArrayList<>();
    
	  @Bean
	  FilterRegistrationBean<AuthFilter> loginRegistrationBean() {
	    FilterRegistrationBean<AuthFilter> filterRegistrationBean = new FilterRegistrationBean<AuthFilter>();
	    filterRegistrationBean.setFilter(new AuthFilter());
	    filterRegistrationBean.setUrlPatterns(urlPatterns);
	    //filterRegistrationBean.setUrlPatterns(Collections.singletonList("/team1/*"));
	    return filterRegistrationBean;
	  }
}
