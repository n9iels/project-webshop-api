DROP TABLE IF EXISTS `user`;
DROP table IF EXISTS `address`;
DROP TABLE IF EXISTS `wishlist`;
CREATE TABLE IF NOT EXISTS `user` (
  `user_id` int(11) NOT NULL AUTO_INCREMENT,
  `user_type` varchar(10) NOT NULL DEFAULT 'customer',
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `first_name` varchar(100) NOT NULL,
  `insertion` varchar(100) DEFAULT NULL,
  `surname` varchar(100) NOT NULL,
  `gender` varchar(10) NOT NULL,
  `date_of_birth` date NOT NULL,
  `phone_number` int(11) NOT NULL,
  `is_active` int(11) NOT NULL DEFAULT '1',
  `secret_question` text,
  `secret_question_answer` text,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=latin1;
INSERT INTO `user` (`user_id`, `user_type`, `email`, `password`, `first_name`, `insertion`, `surname`, `gender`, `date_of_birth`, `phone_number`, `is_active`, `secret_question`, `secret_question_answer`) VALUES
(1, 'customer', 'customer@customer.nl', '$2a$10$r8nfO01Lu2V2kCFw1SuCeO.4/RPBOaqSbP1fyYHCCrIzyklnBDbFm', 'customer', '', 'customer', 'male', '2000-01-01', 0, 1, '1', 'customer'),
(2, 'admin', 'admin@admin.nl', '$2a$10$uLFOC9mls7yAAhSKko.ehe3q3P7guBgDgtzfolt9Ydx3p.GQs29Qi', 'admin', '', 'admin', 'male', '2000-01-01', 0, 1, '1', 'admin');
CREATE TABLE IF NOT EXISTS `address` (
  `postal_code` varchar(10) NOT NULL,
  `house_number` varchar(10) NOT NULL,
  `user_id` int(11) NOT NULL DEFAULT '0',
  `street` varchar(100) NOT NULL,
  `city` varchar(100) NOT NULL,
  PRIMARY KEY (`postal_code`,`house_number`,`user_id`),
  KEY `user_id` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
CREATE TABLE IF NOT EXISTS `wishlist` (
  `wishlist_id` int(11) NOT NULL AUTO_INCREMENT,
  `is_public` int(11) NOT NULL DEFAULT '0',
  `user_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`wishlist_id`),
  KEY `user_id` (`user_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1;