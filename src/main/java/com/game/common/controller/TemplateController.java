package com.game.common.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@Controller
public class TemplateController {
    @GetMapping(value={"/team1/tmpl/**","/team2/tmpl/**","/team3/tmpl/**","/team4/tmpl/**","/team5/tmpl/**"})
    public void goPage(){
    }

    @GetMapping("/{team}")
    public String teamHome(@PathVariable("team") String team){
    	if("team1".equals(team) ||
        		"team2".equals(team) ||
        		"team3".equals(team) ||
        		"team4".equals(team) ||
        		"team5".equals(team))
        return team + "/tmpl/index";

    	return "index";
    }
    @GetMapping("/")
    public String home() {
    	return "index";
    }
}
