insert into UserEntity(userId, username, password, token, role) values (1,'admin', '$2a$12$2KcCE9/7tE2SlqPBaa4pue5sisVJWr07YwI1PFXGZd1fps.a5OzEC', 'f6fdffe48c908deb0f4c3bd36c032e72','ROLE_ADMIN');
insert into UserEntity(userId, username, password, token, role) values (2,'user1', '$2a$12$X2EQsGYBoIsV9fTuv3tFlO1vU5uLxfBA5VZacCxT6o59/LIN33nPG', '332bc0ddba3c4bc792c4829ff3834ca9','ROLE_CUSTOMER');
insert into UserEntity(userId, username, password, token, role) values (3,'user2', '$2a$12$4vTiDnQsY3.r0/MEWPKRWO603sZzjaOrS3cwvcv/eNcltu6GCFHQW', '2c7f98ea10b9c780bb2b05602ad29268','ROLE_CUSTOMER');


insert into ContactEntity(id, userIdFk, email, firstname, lastname, mailingcity, mailingcountry, mailingpostalcode, mailingstreet, phone ) values (1, 1,  'admin@admin.de', 'Admin', 'Admin', '', '', '', '', '');
insert into ContactEntity(id, userIdFk, email, firstname, lastname, mailingcity, mailingcountry, mailingpostalcode, mailingstreet, phone ) values (2, 2,  'max@gmx.de', 'Max', 'Bauer', 'Sindelfingen', 'Germany', '71063', 'Planiestr. 10', '0703112345');
insert into ContactEntity(id, userIdFk, email, firstname, lastname, mailingcity, mailingcountry, mailingpostalcode, mailingstreet, phone ) values (3, 3,  'peter@gmx.de', 'Peter', 'Metzger', 'Stuttgart', 'Germany', '70376', 'Naststr. 27', '071112345');