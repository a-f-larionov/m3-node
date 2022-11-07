-- MySQL dump 10.13  Distrib 5.7.40, for Linux (x86_64)
--
-- Host: localhost    Database: tri_base
-- ------------------------------------------------------
-- Server version       5.7.40

--
-- Current Database: `database_example`
--

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `cache_top_score`
--

/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `cache_top_score` (
  `userId` int(11) unsigned NOT NULL DEFAULT '0',
  `pointId` int(11) unsigned NOT NULL DEFAULT '0',
  `place1Uid` int(11) unsigned NOT NULL DEFAULT '0',
  `place2Uid` int(11) unsigned NOT NULL DEFAULT '0',
  `place3Uid` int(11) unsigned NOT NULL DEFAULT '0',
  `pos` int(11) unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (`userId`,`pointId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `payments`
--

/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `payments` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `time` int(11) unsigned NOT NULL DEFAULT '0',
  `userId` int(11) unsigned NOT NULL DEFAULT '0',
  `orderId` int(11) unsigned NOT NULL DEFAULT '0',
  `itemPrice` int(11) unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `orderId` (`orderId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `statistic`
--

/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `statistic` (
  `uid` int(11) unsigned NOT NULL,
  `time` int(11) NOT NULL,
  `statId` int(11) NOT NULL,
  `paramA` int(11) DEFAULT NULL,
  `paramB` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `user_agents`
--

/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `user_agents` (
  `uid` int(11) NOT NULL,
  `agent` varchar(512) NOT NULL DEFAULT ''
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `users`
--

/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `users` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `socNetUserId` int(11) unsigned NOT NULL,
  `socNetTypeId` int(11) unsigned NOT NULL,
  `create_tm` int(11) unsigned DEFAULT NULL,
  `login_tm` int(11) unsigned DEFAULT NULL,
  `logout_tm` int(11) unsigned DEFAULT NULL,
  `nextPointId` int(11) unsigned NOT NULL DEFAULT '1',
  `fullRecoveryTime` int(11) unsigned DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `socNetUniqueKey` (`socNetUserId`,`socNetTypeId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `users_chests`
--

/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `users_chests` (
  `userId` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `chestId` int(11) unsigned NOT NULL,
  PRIMARY KEY (`userId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `users_points`
--

/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `users_points` (
  `userId` int(11) unsigned NOT NULL,
  `pointId` int(11) unsigned NOT NULL,
  `score` int(11) unsigned NOT NULL,
  PRIMARY KEY (`userId`,`pointId`),
  KEY `userId` (`userId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `users_stuff`
--

/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `users_stuff` (
  `userId` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `hummerQty` int(11) unsigned NOT NULL DEFAULT '0',
  `shuffleQty` int(11) unsigned NOT NULL DEFAULT '0',
  `goldQty` int(11) unsigned NOT NULL DEFAULT '0',
  `lightningQty` int(11) unsigned NOT NULL,
  PRIMARY KEY (`userId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2022-10-25 16:39:24