# SPLASH-Extended 

## A simple Template to get your Salesforce Contacts online.


__Login as an Administrator:__
username: admin
password: admin



[![Deploy](https://www.herokucdn.com/deploy/button.png)](https://heroku.com/deploy)


After configuring the Heroku Connect Addon, please import the contacts-mapping.json into Heroku Connect.


## REST API Specification v2 (for calling the Java Backend) 

###Login and get a User Token back 
- Request: http://localhost:8080/splash-extended/user/login
- Method Type: POST
- Header Values: Content-Type: application/json;
Example: 
- Request Data: {"username":"user1","password":"user1"} 
- Response Data: {
    "firstName": "Max",
    "lastName": "Bauer",
    "role": "ROLE_CUSTOMER",
    "userId": "2",
    "token": "332bc0ddba3c4bc792c4829ff3834ca9"
}

###Login with CAPTCHA and get a User Token back 
- Request: http://localhost:8080/splash-extended/user/login
- Method Type: POST
- Header Values: Content-Type: application/json;
Example: 
- Request Data: {"username":"user1","password":"user1", "recaptcha_challenge_field":"xxxx", "recaptcha_response_field":"yyyy"}
- Response Data: 
ResponseCode: 200
Response Data: {
    "firstName": "Max",
    "lastName": "Bauer",
    "role": "ROLE_CUSTOMER",
    "userId": "2",
    "token": "332bc0ddba3c4bc792c4829ff3834ca9"
}
ResponseCode: 412 (captcha failed)
null
ResponseCode: 401 (login failed)
null			

###Create New User 
- Request: http://localhost:8080/splash-extended/user/create
- Method Type: POST
- Header Values: Content-Type: application/json; token: 16b63e94679ec680d1395b541ba7b2ad

Example: 
- Request Data:
{  
    "email": "max@gmx.de",
    "mainName": "Max",
  	"mainSurname": "Bauerfeld", 
   	"mainCity": "Sindelfingen",
  	"mainCountry": "Deutschland",
   	"mainZipcode": "71063",
    "mainStreet": "Sindelfingen",
  	"mainPhone": "071122872" 
}

- Response Data: 
	password of the new generated user

###Create new Password 
- Request: http://localhost:8080/splash-extended/user/edit/password/:userIdFk
- Method Type: POST 
- Header Values: Content-Type: application/json; token: 16b63e94679ec680d1395b541ba7b2ad
Example:  
- Request Data: 
		 http://localhost:8080/splash-extended/user/edit/password/2			
- Response Data:
		/!o8COfz8h
		

###Contact Object
- Request: http://localhost:8080/splash-extended/user/edit/:userIdFk
- Method Type: GET
- Header Values: Content-Type: application/json; token: 332bc0ddba3c4bc792c4829ff3834ca9
Updated URL to retrieve UserInfo by User ID field 
Example: 
- Request URL: http://localhost:8080/splash-extended/user/edit/2
- Request Data:
- Response Data: 
{
    "email": "max@gmx.de",
    "mainName": "Max",
    "mainSurname": "Bauerfeld",
    "mainCity": "Hockenheim",
    "mainCountry": "Deutschland",
    "mainZipcode": "71063",
    "mainStreet": "Sindelfingen",
    "mainPhone": "071122872"
}


###Get all Contacts
- Request: http://localhost:8080/splash-extended/user/search
- Method Type: GET
- Header Values: Content-Type: application/json; token: xyz
Example: 
- Request Data: 
- Response Data:
{
    "2": "Bauerfeld",
    "3": "Metzger"
} 

### Search Contacts by last name - or a part of it
- Request: http://localhost:8080/splash-extended/user/search/:customerId
- Method Type: GET
- Header Values: Content-Type: application/json; token: xyz
Example: 
- Request Data: http://localhost:8080/splash-extended/user/search/Bauerf
- Response Data:
{
    "2": "Bauerfeld"
} 


###Update Contact Object
- Request: http://localhost:8080/splash-extended/user/edit/:userIdFk
- Method Type: PUT
- Header Values: Content-Type: application/json; token: 332bc0ddba3c4bc792c4829ff3834ca9
Updated URL to update UserInfo by User ID field 
Example: 
- Request URL: http://localhost:8080/splash-extended/user/edit/2
- Request Data: 
{
    "email": "max@gmx.de",
    "mainName": "Max",
    "mainSurname": "Bauerfeld",
    "mainCity": "Hockenheim",
    "mainCountry": "Deutschland",
    "mainZipcode": "71063",
    "mainStreet": "Sindelfingen",
    "mainPhone": "071122872"
}
- Response Data:

