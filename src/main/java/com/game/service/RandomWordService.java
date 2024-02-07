package com.game.service;

import java.net.URI;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.game.vo.WordsVO;

@Service
public class RandomWordService {
    @Autowired
    private ObjectMapper om;

    public WordsVO getRandomWords() throws JsonMappingException, JsonProcessingException{
        URI uri = UriComponentsBuilder.fromUriString("https://jungdolp.synology.me")
                    .path("/word/getdata.php")
                    .build()
                    .toUri();
        RestTemplate rt = new RestTemplate();
        ResponseEntity<String> res = rt.getForEntity(uri, String.class);
        String json = res.getBody();
        WordsVO words = om.readValue(json, WordsVO.class);
        return words;
    }
}
