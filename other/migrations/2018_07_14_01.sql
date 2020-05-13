CREATE TABLE `users_levels` (
userId INT(11) NOT NULL,
levelId INT(11) NOT NULL,
score INT(11) DEFAULT 0,
PRIMARY KEY( `userId`, `levelId`),
KEY `userId` (`userId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8