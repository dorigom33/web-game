package com.game.controller;

import java.util.List;

import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.game.service.PointInfoService;
import com.game.vo.MsgVO;
import com.game.vo.PointInfoVO;
import com.game.vo.UserInfoVO;

@RestController
public class PointInfoController {
    @Autowired
    private PointInfoService piService;
    @PostMapping("/{team}/point-infos")
    public MsgVO addPointInfo(@PathVariable("team") String team,@RequestBody PointInfoVO point, MsgVO msg){
        msg.setMsg("점수 저장에 실패했습니다.");
        if(piService.addPointInfo(point)==1){
           msg.setMsg("점수 저장에 성공했습니다."); 
           msg.setSuccess(true);
        }
        return msg;
    }

    @GetMapping("/{team}/point-infos/max")
    public PointInfoVO getMaxPointInfo(@PathVariable("team") String team,PointInfoVO point, HttpSession session) {
        UserInfoVO user = (UserInfoVO) session.getAttribute("user");
        point.setUiNum(user.getUiNum());
        return piService.selectMaxPoint(point);
    }

    @GetMapping("/{team}/point-infos/rank")
    public List<PointInfoVO> getPointInfoRank(@PathVariable("team") String team,PointInfoVO point){
        return piService.selectPointRank(point.getGiNum());
    }
}