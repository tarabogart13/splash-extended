package de.logicline.splash.controller;

import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.log4j.Logger;
import org.mindrot.jbcrypt.BCrypt;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import de.logicline.splash.dto.ContactDto;
import de.logicline.splash.model.ContactEntity;
import de.logicline.splash.model.UserEntity;
import de.logicline.splash.service.UserService;
import net.tanesha.recaptcha.ReCaptchaImpl;
import net.tanesha.recaptcha.ReCaptchaResponse;


/**
 * The MIT License (MIT)
 *
 * Copyright (c) 2015  logicline GmbH
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * 
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 * 
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.  IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 * 
 */

/**
 * 
 * MVC Controller handling pretty all controller logic of the web application
 * - login user
 * - update user
 * - create new user
 * - ...
 * 
 *
 */
@Controller
public class UserController {

	private static final Logger LOGGER = Logger.getLogger(UserController.class);
	
	@Autowired
	private UserService userService;

	@Autowired
	private ReCaptchaImpl reCaptcha;

	/**
	 * user login without captcha verification
	 * needs configured heroku connector add on
	 * returns specific error if auth failed or config not done
	 * 
	 * @param userEntity credentials from the web client
	 * @param response
	 * 
	 * @return
	 */
	@RequestMapping(value = "/user/login", method = RequestMethod.POST)
	public @ResponseBody Map<String, String> userLogin(
			@RequestBody final UserEntity userEntity,
			HttpServletResponse response) {
		UserEntity userEntityTmp = userService.getUserByName(
				userEntity.getUsername());
		
		if (userEntityTmp == null || !BCrypt.checkpw(userEntity.getPassword(), userEntityTmp.getPassword())) {
			response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
			return null;
		}

		Map<String, String> responseMap = new HashMap<String, String>();
		String token = userEntityTmp.getToken();
		responseMap.put("token", token);
		responseMap.put("userId", String.valueOf(userEntityTmp.getUserId()));
		responseMap.put("role", userEntityTmp.getRole());

		try {
			ContactEntity contactEntity = userService.getContact(token);
			if (contactEntity != null) {
				responseMap.put("firstName", contactEntity.getFirstName());
				responseMap.put("lastName", contactEntity.getLastName());
			}
		} catch (Exception e) {
			LOGGER.error("Exception during getContact()", e);
			response.setStatus(HttpServletResponse.SC_SERVICE_UNAVAILABLE);
			return null;
		}

		return responseMap;
	}

	/**
	 * user login with captcha verification
	 * needs configured heroku connector add on
	 * returns specific error if auth failed or config not don
	 * 
	 * @param userInput
	 * @param request
	 * @param response
	 * @return
	 */
	@RequestMapping(value = "/user/clogin", method = RequestMethod.POST)
	public @ResponseBody Map<String, String> userLoginWithCaptcha(
			@RequestBody Map<String, String> userInput,
			HttpServletRequest request, HttpServletResponse response) {

		String username = userInput.get("username");
		String password = userInput.get("password");
		String challenge = userInput.get("recaptcha_challenge_field");
		String uresponse = userInput.get("recaptcha_response_field");

		ReCaptchaResponse reCaptchaResponse = reCaptcha.checkAnswer(
				request.getRemoteAddr(), challenge, uresponse);

		if (reCaptchaResponse.isValid()) {
			response.setStatus(HttpServletResponse.SC_PRECONDITION_FAILED);
			return null;
		}

		UserEntity userEntityTmp = userService.getUserByName(
				username);
		
		if (userEntityTmp == null || BCrypt.checkpw(password, userEntityTmp.getPassword())) {
			response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
			return null;
		}

		// TODO merge with normal login
		Map<String, String> responseMap = new HashMap<String, String>();
		String token = userEntityTmp.getToken();
		responseMap.put("token", token);
		responseMap.put("userId", String.valueOf(userEntityTmp.getUserId()));
		responseMap.put("role", userEntityTmp.getRole());

		ContactEntity contactEntity = userService.getContact(token);
		if (contactEntity != null) {
			responseMap.put("firstName", contactEntity.getFirstName());
			responseMap.put("lastName", contactEntity.getLastName());
		}

		return responseMap;
	}

	/**
	 * Creates a new Account for the heroku app
	 * The created user and password will be shown on the website
	 * 
	 * @param userId
	 * @param request
	 * @param response
	 * @return
	 */
	@RequestMapping(value = "/user/edit/password/{userId}", method = RequestMethod.POST)
	public @ResponseBody Map<String, String> createWebAccount(
			@PathVariable("userId") String userId, HttpServletRequest request,
			HttpServletResponse response) {

		Map<String, String> responseMap = new HashMap<String, String>();
		UserEntity newUserEntity = userService.createWebAccount(userId);
		responseMap.put("username", newUserEntity.getUsername());
		responseMap.put("password", newUserEntity.getClearTextPasswd());
		return responseMap;
	}

	/**
	 * loads data of the user and the assoc. salesforce contact
	 * 
	 * @param userId
	 * @param request
	 * @param response
	 * @return
	 */
	@RequestMapping(value = "/user/edit/{userId}", method = RequestMethod.GET)
	public @ResponseBody ContactDto getUserInfoByUserId(
			@PathVariable("userId") String userId, HttpServletRequest request,
			HttpServletResponse response) {

		ContactEntity contactEntity = userService.getContactByUserId(userId);
		if (contactEntity == null) {
			response.setStatus(HttpServletResponse.SC_NO_CONTENT);
			return null;
		}

		return contactEntity.toDto();
	}

	/**
	 * searches for customerIds (salesforce contacts)
	 * 
	 * @param request
	 * @param response
	 * @return
	 */
	@RequestMapping(value = "/user/search", method = RequestMethod.GET)
	public @ResponseBody Map<String, String> getAllCustomer(
			HttpServletRequest request, HttpServletResponse response) {

		Map<String, String> customerIdMap = userService.getCustomerIdMap();

		return customerIdMap;
	}

	/**
	 * searches for user names (heroku users)
	 * 
	 * @param name
	 * @param request
	 * @param response
	 * @return
	 */
	@RequestMapping(value = "/user/search/{name}", method = RequestMethod.GET)
	public @ResponseBody Map<String, String> searchUserByName(
			@PathVariable("name") String name, HttpServletRequest request,
			HttpServletResponse response) {

		Map<String, String> nameMap = userService.searchUserByName(name);

		return nameMap;
	}

	/**
	 * updates the heroku userinfo and assoc. salesforce contact
	 * 
	 * @param userId
	 * @param contactDto
	 * @param request
	 * @param response
	 */
	@RequestMapping(value = "/user/edit/{userId}", method = RequestMethod.PUT)
	public void updateUserInfoById(@PathVariable("userId") String userId,
			@RequestBody final ContactDto contactDto,
			HttpServletRequest request, HttpServletResponse response) {

		userService.updateUserInfoByUserId(userId, contactDto);
		return;
	}

}
