-- MySQL dump 10.13  Distrib 8.0.44, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: alinsa
-- ------------------------------------------------------
-- Server version	5.5.5-10.4.32-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `aulas`
--

DROP TABLE IF EXISTS `aulas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `aulas` (
  `id_aula` int(11) NOT NULL AUTO_INCREMENT,
  `grado` varchar(50) NOT NULL,
  `seccion` varchar(10) NOT NULL,
  `docente_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id_aula`),
  KEY `docente_id` (`docente_id`),
  CONSTRAINT `aulas_ibfk_1` FOREIGN KEY (`docente_id`) REFERENCES `usuarios` (`id_usuario`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `aulas`
--

LOCK TABLES `aulas` WRITE;
/*!40000 ALTER TABLE `aulas` DISABLE KEYS */;
INSERT INTO `aulas` VALUES (1,'1ro','A',2),(2,'2do','B',5),(3,'3ro','C',6);
/*!40000 ALTER TABLE `aulas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `chequeos_nutricionales`
--

DROP TABLE IF EXISTS `chequeos_nutricionales`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `chequeos_nutricionales` (
  `id_chequeo` int(11) NOT NULL AUTO_INCREMENT,
  `estudiante_id` int(11) NOT NULL,
  `salud_id` int(11) DEFAULT NULL,
  `fecha` date NOT NULL,
  `peso` decimal(5,2) DEFAULT NULL,
  `talla` decimal(5,2) DEFAULT NULL,
  `imc` decimal(5,2) DEFAULT NULL,
  `observaciones` text DEFAULT NULL,
  PRIMARY KEY (`id_chequeo`),
  KEY `estudiante_id` (`estudiante_id`),
  KEY `salud_id` (`salud_id`),
  CONSTRAINT `chequeos_nutricionales_ibfk_1` FOREIGN KEY (`estudiante_id`) REFERENCES `estudiantes` (`id_estudiante`) ON DELETE CASCADE,
  CONSTRAINT `chequeos_nutricionales_ibfk_2` FOREIGN KEY (`salud_id`) REFERENCES `usuarios` (`id_usuario`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `chequeos_nutricionales`
--

LOCK TABLES `chequeos_nutricionales` WRITE;
/*!40000 ALTER TABLE `chequeos_nutricionales` DISABLE KEYS */;
INSERT INTO `chequeos_nutricionales` VALUES (2,2,1,'2025-11-12',55.00,160.00,21.48,'Chequeo inicial, todo en rango normal'),(3,3,NULL,'2025-11-05',85.00,165.00,31.22,'IMC elevado, riesgo de sobrepeso. Recomendado seguimiento nutricional y actividad física regular.'),(4,4,NULL,'2025-11-12',70.00,180.00,21.60,'Chequeo inicial, todo en rango normal'),(5,1,NULL,'2025-11-12',60.00,170.00,20.76,'Chequeo inicial, todo en rango normal');
/*!40000 ALTER TABLE `chequeos_nutricionales` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `estudiantes`
--

DROP TABLE IF EXISTS `estudiantes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `estudiantes` (
  `id_estudiante` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) NOT NULL,
  `apellido` varchar(100) NOT NULL,
  `dni` varchar(20) DEFAULT NULL,
  `edad` int(11) DEFAULT NULL,
  `aula_id` int(11) DEFAULT NULL,
  `docente_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id_estudiante`),
  UNIQUE KEY `dni` (`dni`),
  KEY `aula_id` (`aula_id`),
  KEY `docente_id` (`docente_id`),
  CONSTRAINT `estudiantes_ibfk_1` FOREIGN KEY (`aula_id`) REFERENCES `aulas` (`id_aula`) ON DELETE SET NULL,
  CONSTRAINT `estudiantes_ibfk_2` FOREIGN KEY (`docente_id`) REFERENCES `usuarios` (`id_usuario`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `estudiantes`
--

LOCK TABLES `estudiantes` WRITE;
/*!40000 ALTER TABLE `estudiantes` DISABLE KEYS */;
INSERT INTO `estudiantes` VALUES (1,'Juan','Pérez','12345678',15,NULL,NULL),(2,'María','Gómez','87654321',16,NULL,NULL),(3,'Luis','Ramírez','11223344',14,NULL,NULL),(4,'Jaime','Huamán','29067843',NULL,NULL,NULL);
/*!40000 ALTER TABLE `estudiantes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `reportes`
--

DROP TABLE IF EXISTS `reportes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `reportes` (
  `id_reporte` int(11) NOT NULL AUTO_INCREMENT,
  `titulo` varchar(150) DEFAULT NULL,
  `descripcion` text DEFAULT NULL,
  `fecha_generacion` date DEFAULT curdate(),
  `generado_por` int(11) DEFAULT NULL,
  PRIMARY KEY (`id_reporte`),
  KEY `generado_por` (`generado_por`),
  CONSTRAINT `reportes_ibfk_1` FOREIGN KEY (`generado_por`) REFERENCES `usuarios` (`id_usuario`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reportes`
--

LOCK TABLES `reportes` WRITE;
/*!40000 ALTER TABLE `reportes` DISABLE KEYS */;
INSERT INTO `reportes` VALUES (1,'Reporte Nutricional Semanal','Este reporte contiene un resumen de los chequeos nutricionales realizados durante la semana, incluyendo IMC promedio, peso y observaciones.','2025-11-12',1);
/*!40000 ALTER TABLE `reportes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuarios`
--

DROP TABLE IF EXISTS `usuarios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuarios` (
  `id_usuario` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) NOT NULL,
  `apellido` varchar(100) NOT NULL,
  `correo` varchar(120) NOT NULL,
  `contrasena` varchar(255) NOT NULL,
  `rol` enum('administrador','salud','docente') NOT NULL,
  `estado` tinyint(1) DEFAULT 1,
  `fecha_creacion` datetime DEFAULT current_timestamp(),
  PRIMARY KEY (`id_usuario`),
  UNIQUE KEY `correo` (`correo`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuarios`
--

LOCK TABLES `usuarios` WRITE;
/*!40000 ALTER TABLE `usuarios` DISABLE KEYS */;
INSERT INTO `usuarios` VALUES (1,'Admin','Prueba','admin@colegio.com','1234','administrador',1,'2025-11-12 00:20:23'),(2,'Maria','Lopez','maria@colegio.com','1234','docente',1,'2025-11-12 00:20:23'),(3,'Carlos','Gomez','carlos@centrosalud.com','1234','salud',1,'2025-11-12 00:20:23'),(4,'Alejandro','Nuñez','anunezce@colegio.com','ucv000','administrador',1,'2025-11-12 10:27:25'),(5,'Darwin','Montero','dmonterol@colegio.com','ucv111','docente',1,'2025-11-12 11:13:36'),(6,'Axel','Navarro','anavarroc@colegio.com','ucv222','docente',1,'2025-11-12 11:14:23'),(7,'Araceli','Suarez','asuareza@colegio.com','ucv333','docente',1,'2025-11-12 11:15:02'),(8,'Michael','Rosales','mrosalesh@colegio.com','ucv444','salud',1,'2025-11-12 11:15:45'),(9,'Bruno','Villanzona','bvillanzonar@colegio.com','ucv555','salud',1,'2025-11-12 11:16:23');
/*!40000 ALTER TABLE `usuarios` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-11-12 15:47:45
