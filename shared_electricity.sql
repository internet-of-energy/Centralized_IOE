-- MySQL dump 10.13  Distrib 8.0.16, for osx10.14 (x86_64)
--
-- Host: localhost    Database: shared_electricity
-- ------------------------------------------------------
-- Server version	8.0.16

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
 SET NAMES utf8mb4 ;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `battery_info`
--

DROP TABLE IF EXISTS `battery_info`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `battery_info` (
  `battery_id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) DEFAULT NULL,
  `model_no` varchar(30) DEFAULT NULL,
  `manufacturing_company` varchar(100) DEFAULT NULL,
  `Storage` decimal(6,2) DEFAULT NULL,
  `Current_power` decimal(6,2) DEFAULT NULL,
  PRIMARY KEY (`battery_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `battery_info_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `battery_info`
--

LOCK TABLES `battery_info` WRITE;
/*!40000 ALTER TABLE `battery_info` DISABLE KEYS */;
INSERT INTO `battery_info` VALUES (1,2,'POWERWALL 1','Solar City',500.00,271.00),(2,3,'POWERWALL 1','Solar City',500.00,204.00),(5,2,'POWERWALL 2','Solar City',500.00,490.10);
/*!40000 ALTER TABLE `battery_info` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `bills`
--

DROP TABLE IF EXISTS `bills`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `bills` (
  `buyer_id` int(11) DEFAULT NULL,
  `seller_id` int(11) DEFAULT NULL,
  `No_of_KwH` decimal(6,2) DEFAULT NULL,
  `Cost_per_KwH` decimal(6,2) DEFAULT NULL,
  `bill_no` int(11) NOT NULL AUTO_INCREMENT,
  `b_date` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`bill_no`),
  KEY `buyer_id` (`buyer_id`),
  KEY `seller_id` (`seller_id`),
  CONSTRAINT `bills_ibfk_1` FOREIGN KEY (`buyer_id`) REFERENCES `users` (`user_id`),
  CONSTRAINT `bills_ibfk_2` FOREIGN KEY (`seller_id`) REFERENCES `users` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=140 DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `bills`
--

LOCK TABLES `bills` WRITE;
/*!40000 ALTER TABLE `bills` DISABLE KEYS */;
INSERT INTO `bills` VALUES (2,3,1.00,0.20,138,'2019-06-14 09:23:22'),(2,3,0.10,0.20,139,'2019-06-14 09:23:37');
/*!40000 ALTER TABLE `bills` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `current_transactions`
--

DROP TABLE IF EXISTS `current_transactions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `current_transactions` (
  `c_t_id` int(11) NOT NULL AUTO_INCREMENT,
  `bill_no` int(11) DEFAULT NULL,
  `start_time` time DEFAULT NULL,
  `end_time` time DEFAULT NULL,
  `KwH_transfer` decimal(6,2) DEFAULT NULL,
  PRIMARY KEY (`c_t_id`),
  KEY `bill_no` (`bill_no`),
  CONSTRAINT `current_transactions_ibfk_1` FOREIGN KEY (`bill_no`) REFERENCES `bills` (`bill_no`)
) ENGINE=InnoDB AUTO_INCREMENT=52 DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `current_transactions`
--

LOCK TABLES `current_transactions` WRITE;
/*!40000 ALTER TABLE `current_transactions` DISABLE KEYS */;
/*!40000 ALTER TABLE `current_transactions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sellers`
--

DROP TABLE IF EXISTS `sellers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `sellers` (
  `seller_id` int(11) DEFAULT NULL,
  `Total_KwH` decimal(6,2) DEFAULT NULL,
  `Cost_per_KwH` decimal(4,2) DEFAULT NULL,
  `sell_id` int(11) NOT NULL AUTO_INCREMENT,
  `battery_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`sell_id`),
  KEY `seller_id` (`seller_id`),
  CONSTRAINT `sellers_ibfk_1` FOREIGN KEY (`seller_id`) REFERENCES `users` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=27 DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sellers`
--

LOCK TABLES `sellers` WRITE;
/*!40000 ALTER TABLE `sellers` DISABLE KEYS */;
INSERT INTO `sellers` VALUES (NULL,20.00,0.10,23,2),(3,18.90,0.20,24,2),(2,30.00,0.10,25,1),(2,10.00,0.18,26,5);
/*!40000 ALTER TABLE `sellers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `users` (
  `user_id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(200) DEFAULT NULL,
  `username` varchar(100) DEFAULT NULL,
  `password` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (2,'Groot','root','toor'),(3,'Akilan Selvacoumar','Akilan','AKILAN1999');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2019-06-14 19:48:00
