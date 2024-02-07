package com.game.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.game.mapper.PointInfoMapper;
import com.game.vo.PointInfoVO;

@Service
public class PointInfoService {
    
    @Autowired
    private PointInfoMapper piMapper;
    
    public int addPointInfo(PointInfoVO point){
        return piMapper.insertPointInfo(point);
    }

    public PointInfoVO selectMaxPoint(PointInfoVO point) {
        return piMapper.selectMaxPoint(point);
    }

    public List<PointInfoVO> selectPointRank(int giNum){
        return piMapper.selectPointRank(giNum);
    }
}
