package com.game.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.game.mapper.GameInfoMapper;
import com.game.vo.GameInfoVO;

@Service
public class GameInfoService {
    @Autowired
    private GameInfoMapper gameMapper;

	public List<GameInfoVO> getGameInfos(GameInfoVO Game){
		return gameMapper.selectGameInfos(Game);
	}

	public GameInfoVO getGameInfo(int uiNum) {
		return gameMapper.selectGameInfo(uiNum);
	}

    public GameInfoVO login(GameInfoVO Game){
        return gameMapper.selectGameInfoByIdAndPwd(Game);
    }
	public int insertGameInfo( GameInfoVO Game) {
		return gameMapper.insertGameInfo(Game);
	}
	public int updateGameInfo( GameInfoVO Game) {
		return gameMapper.updateGameInfo(Game);
	}
	public int deleteGameInfo( int uiNum) {
		return gameMapper.deleteGameInfo(uiNum);
	}

}