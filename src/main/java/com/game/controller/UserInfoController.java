package com.game.controller;

import java.util.List;

import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.game.service.UserInfoService;
import com.game.vo.MsgVO;
import com.game.vo.UserInfoVO;

import lombok.extern.slf4j.Slf4j;

@RestController
@Slf4j
public class UserInfoController {
    @Autowired
    private UserInfoService userInfoService;

    // select
	@GetMapping("/{team}/user-infos")
	public List<UserInfoVO> getUserInfos(@PathVariable("team") String team,UserInfoVO user){
		return userInfoService.getUserInfos(user);
	}

    // select one
	@GetMapping("/{team}/user-infos/{uiNum}")
	public UserInfoVO getUserInfo(@PathVariable("team") String team, @PathVariable("uiNum") int uiNum) {
		log.info("uiNum=>{}", uiNum);
		return userInfoService.getUserInfo(uiNum);
	}

    // login
    @PostMapping("/{team}/login")
    public MsgVO login(@PathVariable("team") String team,@RequestBody UserInfoVO user, MsgVO msg, HttpSession session){
        log.info("user=>{}", user);
        UserInfoVO loginUser = userInfoService.login(user);
        // 실패를 가정
        msg.setMsg("아이디나 비밀번호를 확인하세요");
        // 로그인이 된 경우
        if(loginUser!=null){
            session.setAttribute("user", loginUser);
            msg.setMsg("로그인 성공");
//            msg.setUrl("/team1/");
//            msg.setUrl("/"+team+"/"); // 2023.12.21 최재환 수정
            msg.setUrl("/"); // 2023.12.22 최재환 수정, 통합게임 INDEX로 가도록
            msg.setSuccess(true);
        }
        log.info("msg=>{}", msg);
        return msg;
    }

    // logout
    @PostMapping("/{team}/logout")
    public MsgVO logout(@PathVariable("team") String team,MsgVO msg, HttpSession session){
        session.removeAttribute("user"); // 세션에서 사용자 정보 제거
        msg.setMsg("로그아웃 되었습니다");
//        msg.setUrl("/team1/");
        msg.setUrl("/"+team+"/"); // 2023.12.21 최재환 수정
        msg.setSuccess(true);
        log.info("msg=>{}", msg);
        return msg;
    }

    // insert
    @PostMapping("/{team}/join")
    public MsgVO insertUserInfo(@PathVariable("team") String team, @RequestBody UserInfoVO user, MsgVO msg) {
        log.info("user=>{}", user);
        int result = userInfoService.insertUserInfo(user);
        msg.setMsg("사용자 등록에 실패했습니다");

        if(result == 1){
            msg.setMsg("사용자가 등록되었습니다");
//            msg.setUrl("/team1/tmpl/user-info/list");
            msg.setUrl("/"+team+"/tmpl/user-info/list"); // 2023.12.21 최재환 수정
            msg.setSuccess(true);
        }
        log.info("msg=>{}", msg);
        return msg;
    }

    // update
    @PatchMapping("/{team}/user-infos/{uiNum}")
    public MsgVO updateUserInfo(@PathVariable("team") String team,@PathVariable("uiNum") int uiNum, @RequestBody UserInfoVO user, MsgVO msg){
        user.setUiNum(uiNum);
        log.info("user=>", user);
        int result = userInfoService.updateUserInfo(user);
        msg.setMsg("사용자 정보 수정에 실패했습니다");
        if(result == 1){
            msg.setMsg("사용자 정보가 수정되었습니다");
//            msg.setUrl("/team1/tmpl/user-info/list");
            msg.setUrl("/"+team+"/tmpl/user-info/list"); // 2023.12.21 최재환 수정
            msg.setSuccess(true);
        }
        log.info("msg=>{}", msg);
        return msg;
        // public int updateUserInfo(@PathVariable int uiNum, UserInfoVO user) {
        // user.setUiNum(uiNum);
        // log.info("user=>{}", user);
        // return userInfoService.updateUserInfo(user);
    }

    // delete
    @DeleteMapping("/{team}/user-infos/{uiNum}")
    public int deleteUserInfo(@PathVariable("team") String team,@PathVariable int uiNum){
        log.info("uiNum=>{}", uiNum);
        return userInfoService.deleteUserInfo(uiNum);
    }
}