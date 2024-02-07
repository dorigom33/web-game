package com.game.mapper;

import java.util.List;

import com.game.vo.GameInfoVO;


public interface GameInfoMapper {

	List<GameInfoVO> selectGameInfos(GameInfoVO Game);
	GameInfoVO selectGameInfo(int uiNum);
	GameInfoVO selectGameInfoByIdAndPwd(GameInfoVO Game);
	int insertGameInfo(GameInfoVO Game);
	int updateGameInfo(GameInfoVO Game);
	int deleteGameInfo(int uiNum);
}