CREATE TABLE `users` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `socNetUserId` int(11) unsigned NOT NULL,
  `socNetTypeId` int(11) unsigned NOT NULL,
  `createTimestamp` bigint(11) unsigned DEFAULT NULL,
  `lastLoginTimestamp` bigint(11) unsigned DEFAULT NULL,
  `lastLogoutTimestamp` bigint(11) unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `socNetUniqueKey` (`socNetUserId`,`socNetTypeId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8


CREATE TABLE `profiling` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `datetime` int(11) NOT NULL,
  `profileId` int(11) NOT NULL,
  `sumTime` int(11) NOT NULL,
  `count` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8