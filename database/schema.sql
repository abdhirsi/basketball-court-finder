-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Nov 27, 2026 at 05:34 AM
-- Server version: 10.4.28-MariaDB
-- PHP Version: 8.0.28

CREATE DATABASE IF NOT EXISTS twin_cities_hoops
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

USE twin_cities_hoops;

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `twin_cities_hoops`
--

-- --------------------------------------------------------

--
-- Table structure for table `courts`
--
-- Error reading structure for table twin_cities_hoops.courts: #1142 - SHOW command denied to user ''@'localhost' for table `twin_cities_hoops`.`courts`
-- Error reading data for table twin_cities_hoops.courts: #1064 - You have an error in your SQL syntax; check the manual that corresponds to your MariaDB server version for the right syntax to use near 'FROM `twin_cities_hoops`.`courts`' at line 1

-- --------------------------------------------------------

--
-- Table structure for table `court_issues`
--
-- Error reading structure for table twin_cities_hoops.court_issues: #1142 - SHOW command denied to user ''@'localhost' for table `twin_cities_hoops`.`court_issues`
-- Error reading data for table twin_cities_hoops.court_issues: #1064 - You have an error in your SQL syntax; check the manual that corresponds to your MariaDB server version for the right syntax to use near 'FROM `twin_cities_hoops`.`court_issues`' at line 1

-- --------------------------------------------------------

--
-- Table structure for table `court_submissions`
--
-- Error reading structure for table twin_cities_hoops.court_submissions: #1142 - SHOW command denied to user ''@'localhost' for table `twin_cities_hoops`.`court_submissions`
-- Error reading data for table twin_cities_hoops.court_submissions: #1064 - You have an error in your SQL syntax; check the manual that corresponds to your MariaDB server version for the right syntax to use near 'FROM `twin_cities_hoops`.`court_submissions`' at line 1

-- --------------------------------------------------------

--
-- Table structure for table `crowd_reports`
--
-- Error reading structure for table twin_cities_hoops.crowd_reports: #1142 - SHOW command denied to user ''@'localhost' for table `twin_cities_hoops`.`crowd_reports`
-- Error reading data for table twin_cities_hoops.crowd_reports: #1064 - You have an error in your SQL syntax; check the manual that corresponds to your MariaDB server version for the right syntax to use near 'FROM `twin_cities_hoops`.`crowd_reports`' at line 1

-- --------------------------------------------------------

--
-- Table structure for table `favorites`
--
-- Error reading structure for table twin_cities_hoops.favorites: #1142 - SHOW command denied to user ''@'localhost' for table `twin_cities_hoops`.`favorites`
-- Error reading data for table twin_cities_hoops.favorites: #1064 - You have an error in your SQL syntax; check the manual that corresponds to your MariaDB server version for the right syntax to use near 'FROM `twin_cities_hoops`.`favorites`' at line 1

-- --------------------------------------------------------

--
-- Table structure for table `ratings`
--
-- Error reading structure for table twin_cities_hoops.ratings: #1142 - SHOW command denied to user ''@'localhost' for table `twin_cities_hoops`.`ratings`
-- Error reading data for table twin_cities_hoops.ratings: #1064 - You have an error in your SQL syntax; check the manual that corresponds to your MariaDB server version for the right syntax to use near 'FROM `twin_cities_hoops`.`ratings`' at line 1

-- --------------------------------------------------------

--
-- Table structure for table `users`
--
-- Error reading structure for table twin_cities_hoops.users: #1142 - SHOW command denied to user ''@'localhost' for table `twin_cities_hoops`.`users`
-- Error reading data for table twin_cities_hoops.users: #1064 - You have an error in your SQL syntax; check the manual that corresponds to your MariaDB server version for the right syntax to use near 'FROM `twin_cities_hoops`.`users`' at line 1
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
