-- Attention IF EXISTS is Postgres specific
DROP TABLE IF EXISTS ContactEntity;
DROP TABLE IF EXISTS UserEntity;
DROP sequence hibernate_sequence;

CREATE TABLE UserEntity(
	userId varchar(64) NOT NULL,
  	username varchar(255),	
	password varchar(255),
	token varchar(255),
  	role varchar(255),
  	PRIMARY KEY (userid)
);




