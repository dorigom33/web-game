package com.game.mapper;

import java.util.List;

import com.game.vo.PointInfoVO;

public interface PointInfoMapper {
    int insertPointInfo(PointInfoVO point);
    PointInfoVO selectMaxPoint(PointInfoVO point);
    List<PointInfoVO> selectPointRank(int giNum);
}
