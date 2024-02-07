package com.game.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.game.service.GameInfoService;
import com.game.vo.GameInfoVO;

import lombok.extern.slf4j.Slf4j;

@RestController
@Slf4j
public class GameInfoController {
    @Autowired
    private GameInfoService gameInfoService;
    
    // select
	@GetMapping("/{team}/game-infos")
	public List<GameInfoVO> getGameInfos(@PathVariable("team") String team, GameInfoVO game){
		return gameInfoService.getGameInfos(game);
	}

    // select one
	@GetMapping("/{team}/game-infos/{uiNum}")
	public GameInfoVO getGameInfo(@PathVariable("team") String team, @PathVariable int uiNum) {
		log.info("uiNum=>{}", uiNum);
		return gameInfoService.getGameInfo(uiNum);
	}

    // insert
    @PostMapping("/{team}/game-infos")
    public int insertGameInfo(@PathVariable("team") String team, @RequestBody GameInfoVO game){
        log.info("game=>{}", game);
        return gameInfoService.insertGameInfo(game);
    }

    // update
    @PatchMapping("/{team}/game-infos")
    public int updateGameInfo(@PathVariable("team") String team, @RequestBody GameInfoVO game){
        log.info("game=>{}", game);
        return gameInfoService.updateGameInfo(game);
    }

    // delete
    @DeleteMapping("/{team}/game-infos/{uiNum}")
    public int deleteGameInfo(@PathVariable("team") String team, @PathVariable int uiNum){
        log.info("uiNum=>{}", uiNum);
        return gameInfoService.deleteGameInfo(uiNum);
    }
}