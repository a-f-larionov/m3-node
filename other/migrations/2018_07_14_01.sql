CREATE TABLE `users_points` (
userId INT(11) NOT NULL,
pointId INT(11) NOT NULL,
score INT(11) DEFAULT 0,
PRIMARY KEY( `userId`, `pointId`),
KEY `userId` (`userId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8