-- MySQL dump 10.13  Distrib 5.7.29, for Linux (x86_64)
--
-- Host: localhost    Database: tri_base
-- ------------------------------------------------------
-- Server version	5.7.29-0ubuntu0.18.04.1

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
-- Table structure for table `payments`
--

DROP TABLE IF EXISTS `payments`;
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
-- Dumping data for table `payments`
--

LOCK TABLES `payments` WRITE;
/*!40000 ALTER TABLE `payments` DISABLE KEYS */;
/*!40000 ALTER TABLE `payments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `profiling`
--

DROP TABLE IF EXISTS `profiling`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `profiling` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `datetime` int(11) NOT NULL,
  `profileId` int(11) NOT NULL,
  `sumTime` int(11) NOT NULL,
  `count` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `profiling`
--

LOCK TABLES `profiling` WRITE;
/*!40000 ALTER TABLE `profiling` DISABLE KEYS */;
/*!40000 ALTER TABLE `profiling` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `users` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `socNetUserId` int(11) unsigned NOT NULL,
  `socNetTypeId` int(11) unsigned NOT NULL,
  `create_tm` int(11) unsigned DEFAULT NULL,
  `login_tm` int(11) unsigned DEFAULT NULL,
  `logout_tm` int(11) unsigned NOT NULL DEFAULT '0',
  `nextPointId` int(11) NOT NULL DEFAULT '1',
  `fullRecoveryTime` bigint(11) unsigned DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `socNetUniqueKey` (`socNetUserId`,`socNetTypeId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users_chests`
--

DROP TABLE IF EXISTS `users_chests`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `users_chests` (
  `userId` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `chestId` int(11) unsigned NOT NULL,
  PRIMARY KEY (`userId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users_chests`
--

LOCK TABLES `users_chests` WRITE;
/*!40000 ALTER TABLE `users_chests` DISABLE KEYS */;
/*!40000 ALTER TABLE `users_chests` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users_points`
--

DROP TABLE IF EXISTS `users_points`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `users_points` (
  `userId` int(11) NOT NULL,
  `pointId` int(11) NOT NULL,
  `score` int(11) DEFAULT '0',
  PRIMARY KEY (`userId`,`pointId`),
  KEY `userId` (`userId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users_points`
--

LOCK TABLES `users_points` WRITE;
/*!40000 ALTER TABLE `users_points` DISABLE KEYS */;
/*!40000 ALTER TABLE `users_points` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users_stuff`
--

DROP TABLE IF EXISTS `users_stuff`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `users_stuff` (
  `userId` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `hummerQty` int(11) unsigned NOT NULL DEFAULT '0',
  `shuffleQty` int(11) unsigned NOT NULL DEFAULT '0',
  `lightningQty` int(11) unsigned NOT NULL DEFAULT '0',
  `goldQty` int(11) unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (`userId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users_stuff`
--

LOCK TABLES `users_stuff` WRITE;
/*!40000 ALTER TABLE `users_stuff` DISABLE KEYS */;
/*!40000 ALTER TABLE `users_stuff` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2020-04-03 22:35:04
