DROP TABLE IF EXISTS `users`;

CREATE TABLE `users` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone` varchar(20) COLLATE utf8mb4_unicode_ci NULL,
  `date_of_birth` date NULL,
  `profile_photo` varchar(255) COLLATE utf8mb4_unicode_ci NULL,
  `bio` text COLLATE utf8mb4_unicode_ci NULL,
  `user_type` enum('user','admin') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'user',
  `is_verified` tinyint(1) NOT NULL DEFAULT 0 COMMENT 'Verified by admin/platform',
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `language_preference` varchar(10) COLLATE utf8mb4_unicode_ci DEFAULT 'en',
  `currency_preference` varchar(10) COLLATE utf8mb4_unicode_ci DEFAULT 'TND',
  `remember_token` varchar(100) COLLATE utf8mb4_unicode_ci NULL,
  `last_login_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_email_unique` (`email`),
  KEY `users_phone` (`phone`),
  KEY `users_user_type` (`user_type`),
  KEY `users_is_active` (`is_active`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
