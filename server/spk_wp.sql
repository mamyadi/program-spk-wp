-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jun 30, 2025 at 04:18 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `spk_wp`
--
CREATE DATABASE IF NOT EXISTS `spk_wp` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `spk_wp`;

-- --------------------------------------------------------

--
-- Table structure for table `alternatives`
--

CREATE TABLE `alternatives` (
  `id` int(11) NOT NULL,
  `code` varchar(10) NOT NULL,
  `name` varchar(100) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `alternatives`
--

INSERT INTO `alternatives` (`id`, `code`, `name`, `created_at`, `updated_at`) VALUES
(1, 'A1', 'Eli', '2025-06-30 10:38:29', '2025-06-30 12:02:00'),
(2, 'A2', 'Apendi', '2025-06-30 10:38:29', '2025-06-30 12:02:19'),
(3, 'A3', 'Rohim', '2025-06-30 10:38:29', '2025-06-30 12:02:26'),
(4, 'A4', 'Aep', '2025-06-30 10:38:29', '2025-06-30 12:02:32'),
(5, 'A5', 'Wahid', '2025-06-30 10:38:29', '2025-06-30 12:02:39');

-- --------------------------------------------------------

--
-- Table structure for table `criteria`
--

CREATE TABLE `criteria` (
  `id` int(11) NOT NULL,
  `code` varchar(10) NOT NULL,
  `name` varchar(100) NOT NULL,
  `weight` decimal(10,2) NOT NULL,
  `type` enum('benefit','cost') NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `criteria`
--

INSERT INTO `criteria` (`id`, `code`, `name`, `weight`, `type`, `created_at`, `updated_at`) VALUES
(1, 'C1', 'Kualitas Jahitan', 5.00, 'benefit', '2025-06-30 10:38:29', '2025-06-30 11:59:27'),
(2, 'C2', 'Kerapihan Jahitan', 4.00, 'benefit', '2025-06-30 10:38:29', '2025-06-30 11:59:56'),
(3, 'C3', 'Kecepatan', 3.00, 'cost', '2025-06-30 10:38:29', '2025-06-30 12:00:18'),
(4, 'C4', 'Ketepatan Waktu', 4.00, 'benefit', '2025-06-30 10:38:29', '2025-06-30 12:00:38'),
(5, 'C5', 'Alamat', 4.00, 'cost', '2025-06-30 10:38:29', '2025-06-30 12:01:00');

-- --------------------------------------------------------

--
-- Table structure for table `scores`
--

CREATE TABLE `scores` (
  `id` int(11) NOT NULL,
  `alternative_id` int(11) NOT NULL,
  `criteria_id` int(11) NOT NULL,
  `value` decimal(10,2) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `scores`
--

INSERT INTO `scores` (`id`, `alternative_id`, `criteria_id`, `value`, `created_at`, `updated_at`) VALUES
(51, 1, 1, 5.00, '2025-06-30 12:02:00', '2025-06-30 12:02:00'),
(52, 1, 2, 4.00, '2025-06-30 12:02:00', '2025-06-30 12:02:00'),
(53, 1, 3, 3.00, '2025-06-30 12:02:00', '2025-06-30 12:02:00'),
(54, 1, 4, 4.00, '2025-06-30 12:02:00', '2025-06-30 12:02:00'),
(55, 1, 5, 5.00, '2025-06-30 12:02:00', '2025-06-30 12:02:00'),
(76, 2, 1, 4.00, '2025-06-30 12:03:19', '2025-06-30 12:03:19'),
(77, 2, 2, 5.00, '2025-06-30 12:03:19', '2025-06-30 12:03:19'),
(78, 2, 3, 4.00, '2025-06-30 12:03:19', '2025-06-30 12:03:19'),
(79, 2, 4, 5.00, '2025-06-30 12:03:19', '2025-06-30 12:03:19'),
(80, 2, 5, 3.00, '2025-06-30 12:03:19', '2025-06-30 12:03:19'),
(81, 3, 1, 3.00, '2025-06-30 12:03:35', '2025-06-30 12:03:35'),
(82, 3, 2, 3.00, '2025-06-30 12:03:35', '2025-06-30 12:03:35'),
(83, 3, 3, 5.00, '2025-06-30 12:03:35', '2025-06-30 12:03:35'),
(84, 3, 4, 2.00, '2025-06-30 12:03:35', '2025-06-30 12:03:35'),
(85, 3, 5, 4.00, '2025-06-30 12:03:35', '2025-06-30 12:03:35'),
(91, 4, 1, 5.00, '2025-06-30 12:03:59', '2025-06-30 12:03:59'),
(92, 4, 2, 4.00, '2025-06-30 12:03:59', '2025-06-30 12:03:59'),
(93, 4, 3, 4.00, '2025-06-30 12:03:59', '2025-06-30 12:03:59'),
(94, 4, 4, 1.00, '2025-06-30 12:03:59', '2025-06-30 12:03:59'),
(95, 4, 5, 5.00, '2025-06-30 12:03:59', '2025-06-30 12:03:59'),
(96, 5, 1, 5.00, '2025-06-30 12:04:15', '2025-06-30 12:04:15'),
(97, 5, 2, 5.00, '2025-06-30 12:04:15', '2025-06-30 12:04:15'),
(98, 5, 3, 3.00, '2025-06-30 12:04:15', '2025-06-30 12:04:15'),
(99, 5, 4, 4.00, '2025-06-30 12:04:15', '2025-06-30 12:04:15'),
(100, 5, 5, 2.00, '2025-06-30 12:04:15', '2025-06-30 12:04:15');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `username`, `password`, `created_at`) VALUES
(1, 'kelompok1', '$2b$10$5qW5UrKWeWO3lDZZzYxYnuN6B0KIqVEmSvk4Gi5fxgwX685J.KXNm', '2025-06-30 10:38:29');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `alternatives`
--
ALTER TABLE `alternatives`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `criteria`
--
ALTER TABLE `criteria`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `scores`
--
ALTER TABLE `scores`
  ADD PRIMARY KEY (`id`),
  ADD KEY `alternative_id` (`alternative_id`),
  ADD KEY `criteria_id` (`criteria_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `alternatives`
--
ALTER TABLE `alternatives`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `criteria`
--
ALTER TABLE `criteria`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `scores`
--
ALTER TABLE `scores`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=101;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `scores`
--
ALTER TABLE `scores`
  ADD CONSTRAINT `scores_ibfk_1` FOREIGN KEY (`alternative_id`) REFERENCES `alternatives` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `scores_ibfk_2` FOREIGN KEY (`criteria_id`) REFERENCES `criteria` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
