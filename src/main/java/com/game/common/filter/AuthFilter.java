package com.game.common.filter;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.springframework.web.filter.GenericFilterBean;

import com.game.vo.UserInfoVO;

public class AuthFilter extends GenericFilterBean{

	private List<String> execludeUrls = new ArrayList<>();
	{
		execludeUrls.add("join");
		execludeUrls.add("login");
	}

	@Override
	public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
			throws IOException, ServletException {
		if(request instanceof HttpServletRequest req && response instanceof HttpServletResponse res) {
			String uri = req.getRequestURI();
			if(!isMatch(uri)) {
				uri = uri.substring(1);
				int idx = uri.indexOf("/");
				if(idx>0) {
					uri = uri.substring(0,idx);
				}
				HttpSession session = req.getSession();
				UserInfoVO user = (UserInfoVO) session.getAttribute("user");
				if(user == null) {
					uri = "".equals(uri)?"team1":uri;
					res.sendRedirect("/" + uri + "/tmpl/user-info/login");
					return;
				}
			}
		}
		chain.doFilter(request, response);
	}

	private boolean isMatch(String uri) {
		for(String execludeUrl : execludeUrls) {
			if(uri.contains(execludeUrl)) {
				return true;
			}
		}
		return false;
	}

}
