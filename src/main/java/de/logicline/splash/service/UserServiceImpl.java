package de.logicline.splash.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;

import org.apache.commons.codec.digest.DigestUtils;
import org.apache.log4j.Logger;
import org.mindrot.jbcrypt.BCrypt;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import de.logicline.splash.dao.ContactDao;
import de.logicline.splash.dao.UserDao;
import de.logicline.splash.dto.ContactDto;
import de.logicline.splash.model.ContactEntity;
import de.logicline.splash.model.UserEntity;
import de.logicline.splash.utils.Enums;
import de.logicline.splash.utils.PasswordGenerator;


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
 * @see UserService
 * 
 */
@Service
public class UserServiceImpl implements UserService {

	private Logger log = Logger.getLogger(this.getClass().getName());

	@PersistenceContext
	EntityManager em;

	@Autowired
	UserDao userDao;

	@Autowired
	ContactDao contactDao;

	public UserEntity getUserByName(String username) {
		return userDao.getUserByName(username);

	}

	public List<ContactEntity> getContactList() {
		List<ContactEntity> resultList = contactDao.findAll();
		return resultList;
	}

	public Map<String, String> getCustomerIdMap() {

		List<ContactEntity> resultList = contactDao.findAll();

		Map<String, String> customerIdMap = new HashMap<String, String>();

		for (ContactEntity uie : resultList) {
			customerIdMap.put(uie.getUserIdFk(), uie.getLastName());
		}

		return customerIdMap;

	}

	public ContactEntity getContact(String token) {

		String userId = userDao.getUserId(token);
		ContactEntity result = contactDao.getContactByUserId(userId);

		return result;
	}

	public ContactEntity getContactByUserId(String userId) {
		ContactEntity result = contactDao.getContactByUserId(userId);

		return result;
	};

	@Transactional
	public void updateUserInfoByUserId(String userId, ContactDto contactDto) {
		ContactEntity contactOld = contactDao.getContactByUserId(userId);

		ContactEntity contactUpdated = contactDto.toEntity(contactOld);
		contactDao.edit(contactUpdated);

	}

	public Map<String, String> searchUserByName(String name) {

		List<ContactEntity> resultList = contactDao.findByName(name);

		Map<String, String> customerIdMap = new HashMap<String, String>();

		for (ContactEntity contact : resultList) {
			customerIdMap.put(contact.getUserIdFk(), contact.getLastName());
		}

		return customerIdMap;

	}

	@Transactional
	public String updatePassword(String userId) {
		String passwordClearText = new PasswordGenerator().generatePswd(10, 10, 2, 2, 2);
		String password = BCrypt.hashpw(passwordClearText, BCrypt.gensalt(12));
		
		UserEntity userForUpdate = userDao.find(userId);
		userForUpdate.setPassword(password);
		userDao.edit(userForUpdate);
		return passwordClearText;
	}

	@Transactional
	public UserEntity createWebAccount(String userId) {

		ContactEntity ce = contactDao.getContactByUserId(userId);

		String clearTextPassword = new PasswordGenerator().generatePswd(10, 10, 2, 2, 2);
		String password = BCrypt.hashpw(clearTextPassword, BCrypt.gensalt(12));

		UserEntity ue = userDao.find(userId);
		if (ue == null) {
			ue = new UserEntity();
			ue.setUserId(ce.getUserIdFk());
			ue.setUsername(ce.getLastName());
			ue.setPassword(password);
			ue.setClearTextPasswd(clearTextPassword);
			String token = DigestUtils.md5Hex(password + ce.getLastName());
			ue.setToken(token);
			ue.setRole(Enums.UserRole.ROLE_CUSTOMER.name());
			userDao.create(ue);

		}

		ue.setPassword(password);
		ue.setClearTextPasswd(clearTextPassword);
		userDao.edit(ue);

		return ue;

	}
}
