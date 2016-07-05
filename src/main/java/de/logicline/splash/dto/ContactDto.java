package de.logicline.splash.dto;

import de.logicline.splash.model.ContactEntity;
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
 * DTO used to transfer contact data to the frontend
 *
 */
public class ContactDto {

	private String userIdFk;
	private String email;
	private String mainName;
	private String mainSurname;
	private String mainCity;
	private String mainCountry;
	private String mainZipcode;
	private String mainStreet;
	private String mainPhone;

	public String getUserIdFk() {
		return userIdFk;
	}

	public void setUserIdFk(String userIdFk) {
		this.userIdFk = userIdFk;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getMainName() {
		return mainName;
	}

	public void setMainName(String mainName) {
		this.mainName = mainName;
	}

	public String getMainSurname() {
		return mainSurname;
	}

	public void setMainSurname(String mainSurname) {
		this.mainSurname = mainSurname;
	}

	public String getMainCity() {
		return mainCity;
	}

	public void setMainCity(String mainCity) {
		this.mainCity = mainCity;
	}

	public String getMainCountry() {
		return mainCountry;
	}

	public void setMainCountry(String mainCountry) {
		this.mainCountry = mainCountry;
	}

	public String getMainZipcode() {
		return mainZipcode;
	}

	public void setMainZipcode(String mainZipcode) {
		this.mainZipcode = mainZipcode;
	}

	public String getMainStreet() {
		return mainStreet;
	}

	public void setMainStreet(String mainStreet) {
		this.mainStreet = mainStreet;
	}

	public String getMainPhone() {
		return mainPhone;
	}

	public void setMainPhone(String mainPhone) {
		this.mainPhone = mainPhone;
	}

	public ContactEntity toEntity(ContactEntity contactEntity) {

		contactEntity.setEmail(getEmail());
		contactEntity.setFirstName(getMainName());
		contactEntity.setLastName(getMainSurname());
		contactEntity.setMailingCity(getMainCity());
		contactEntity.setMailingCountry(getMainCountry());
		contactEntity.setMailingPostalCode(getMainZipcode());
		contactEntity.setMailingStreet(getMainStreet());
		contactEntity.setPhone(getMainPhone());

		return contactEntity;
	}

}
