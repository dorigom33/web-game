package com.game.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.game.service.RandomWordService;
import com.game.vo.WordsVO;

@RestController
public class RandomWordController {

    @Autowired
    private RandomWordService randomWordService;
    @GetMapping("/team2/random-words")
    public WordsVO getRandomWords() throws JsonMappingException, JsonProcessingException{
        return randomWordService.getRandomWords();
    }
}
