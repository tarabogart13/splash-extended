package de.logicline.splash.service;

import java.util.List;
import java.util.Map;

import de.logicline.splash.dto.ContactDto;
import de.logicline.splash.model.ContactEntity;
import de.logicline.splash.model.UserEntity;

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
 * UserService is part of the model in the MVC pattern
 * It is handling the business logic, is between controller and Persistence layer
 * 
 */
public interface UserService {

	/**
	 * loads user by name
	 * 
	 * @param username
	 * @return
	 */
	public UserEntity getUserByName(String username);

	/**
	 * retrieves all contacts
	 * 
	 * @return
	 */
	public List<ContactEntity> getContactList();

	/**
	 * loads a contact associated with the user identified by his token
	 * 
	 * @param token
	 * @return
	 */
	public ContactEntity getContact(String token);

	/**
	 * loads the contact of the user identified with its userid
	 * 
	 * @param userId
	 * @return
	 */
	public ContactEntity getContactByUserId(String userId);

	/**
	 * changes the contact entity identified by the users userid
	 *  
	 * @param userId
	 * @param contactDto
	 */
	public void updateUserInfoByUserId(String userId, ContactDto contactDto);

	/**
	 * regenerates the password for the user with userId
	 * 
	 * @param userId
	 * @return
	 */
	public String updatePassword(String userId);

	/**
	 * creates a new web account (user entity) without any contact (salesforce)
	 * User entity with password is returned, only password hash is stored in db
	 * 
	 * @param userId
	 * @return
	 */
	public UserEntity createWebAccount(String userId);

	/**
	 * loads a map with Map<userid,Contact Lastname>
	 * 
	 * @return
	 */
	public Map<String, String> getCustomerIdMap();

	/**
	 * searches for contacts with a specified last name
	 * returns a map with Map<userid,Contact Lastname>
	 * 
	 * @param name
	 * @return
	 */
	public Map<String, String> searchUserByName(String name);

}
