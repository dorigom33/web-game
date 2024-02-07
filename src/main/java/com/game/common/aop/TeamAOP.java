package com.game.common.aop;

import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Pointcut;
import org.aspectj.lang.reflect.CodeSignature;
import org.springframework.stereotype.Component;

import com.game.vo.GameInfoVO;
import com.game.vo.PointInfoVO;
import com.game.vo.UserInfoVO;

import lombok.extern.slf4j.Slf4j;

@Aspect
@Component
@Slf4j
public class TeamAOP {

	@Pointcut("execution(* com.shop.controller..*.*(com.game.vo.GameInfoVO,..)) "
			+ "|| execution(* com.shop.controller..*.*(..,com.game.vo.GameInfoVO))")
	public void gameVOMapping() {
	}

	@Pointcut("execution(* com.shop.controller..*.*(com.game.vo.UserInfoVO,..)) "
			+ "|| execution(* com.shop.controller..*.*(..,com.game.vo.UserInfoVO))")
	public void userVOMapping() {
	}

	@Pointcut("execution(* com.shop.controller..*.*(com.game.vo.PointInfoVO,..)) "
			+ "|| execution(* com.shop.controller..*.*(..,com.game.vo.PointInfoVO))")
	public void pointVOMapping() {
	}

	@Pointcut("execution(* *(.., @org.springframework.web.bind.annotation.PathVariable (String), ..))")
	public void pathCut() {
	}

	private String getTeam(Object[] params, String[] paramNames, Class<?>[] clazzs) {
		for (int i = 0; i < params.length; i++) {
			String paramName = paramNames[i];
			Class<?> clazz = clazzs[i];
			Object param = params[i];
			if ("team".equals(paramName) && clazz == String.class && param.toString().length() == 5) {
				return param.toString().replace("team", "");
			}
		}
		return null;
	}

	@Around("pathCut()")
	public Object insertTeamToVO(ProceedingJoinPoint pjp) throws Throwable {

		CodeSignature codeSignature = (CodeSignature) pjp.getSignature();
		Object[] params = pjp.getArgs();
		String[] paramNames = codeSignature.getParameterNames();
		Class<?>[] clazzs = codeSignature.getParameterTypes();
		String team = getTeam(params, paramNames, clazzs);

		if (team != null && team.length() == 1) {
			for (int i = 0; i < params.length; i++) {
				Class<?> clazz = clazzs[i];
				Object param = params[i];
				if (clazz == GameInfoVO.class) {
					GameInfoVO gi = (GameInfoVO) param;
					gi.setTeam(team);
				}
			}
		}

		Object obj = pjp.proceed();
		return obj;

	}
}
