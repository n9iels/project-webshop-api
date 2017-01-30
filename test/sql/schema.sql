DROP TABLE IF EXISTS `wishlist`;
DROP table IF EXISTS `address`;
DROP TABLE IF EXISTS `orders_contain_games`;
DROP TABLE IF EXISTS `order`;
DROP TABLE IF EXISTS `user`;
DROP TABLE IF EXISTS `game`;
DROP TABLE IF EXISTS `platform_independent_info`;

/* Create `user` table */
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
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=latin1;

INSERT INTO `user` (`user_id`, `user_type`, `email`, `password`, `first_name`, `insertion`, `surname`, `gender`, `date_of_birth`, `phone_number`, `is_active`, `secret_question`, `secret_question_answer`) VALUES
(1, 'customer', 'customer@customer.nl', '$2a$10$r8nfO01Lu2V2kCFw1SuCeO.4/RPBOaqSbP1fyYHCCrIzyklnBDbFm', 'customer', '', 'customer', 'male', '2000-01-01', 0, 1, '1', 'customer'),
(2, 'admin', 'admin@admin.nl', '$2a$10$uLFOC9mls7yAAhSKko.ehe3q3P7guBgDgtzfolt9Ydx3p.GQs29Qi', 'admin', '', 'admin', 'male', '2000-01-01', 0, 1, '1', 'admin'),
(3, 'customer', 'blocked@blocked.nl', '$2a$10$r8nfO01Lu2V2kCFw1SuCeO.4/RPBOaqSbP1fyYHCCrIzyklnBDbFm', 'blocked', '', 'blocked', 'male', '2000-01-01', 0, 0, '1', 'blocked');

/* Create `address` table */
CREATE TABLE IF NOT EXISTS `address` (
  `postal_code` varchar(10) NOT NULL,
  `house_number` varchar(10) NOT NULL,
  `user_id` int(11) NOT NULL DEFAULT '0',
  `street` varchar(100) NOT NULL,
  `city` varchar(100) NOT NULL,
  PRIMARY KEY (`postal_code`,`house_number`,`user_id`),
  KEY `user_id` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

/* Create `wishlist` table */
CREATE TABLE IF NOT EXISTS `wishlist` (
  `wishlist_id` int(11) NOT NULL AUTO_INCREMENT,
  `is_public` int(11) NOT NULL DEFAULT '0',
  `user_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`wishlist_id`),
  KEY `user_id` (`user_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1;

/* Create `order` table */
CREATE TABLE IF NOT EXISTS `order` (
  `order_number` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) DEFAULT NULL,
  `status` varchar(20) NOT NULL DEFAULT 'cart',
  `order_date` date NOT NULL DEFAULT '0000-00-00',
  `payment_method` varchar(20) NOT NULL,
  `shipping_method` varchar(20) NOT NULL,
  `btw_percentage` int(11) NOT NULL,
  `total_order_price` double NOT NULL DEFAULT '0',
  `delivery_costs` double NOT NULL DEFAULT '0',
  PRIMARY KEY (`order_number`),
  KEY `user_id` (`user_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1;

/* Create `order_contain_games` table */
CREATE TABLE IF NOT EXISTS `orders_contain_games` (
  `order_number` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `ean_number` bigint(20) NOT NULL,
  `amount` int(11) NOT NULL DEFAULT '1',
  PRIMARY KEY (`order_number`,`ean_number`),
  KEY `user_id` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

/* Create game table */
CREATE TABLE IF NOT EXISTS `game` (
  `ean_number` bigint(20) NOT NULL,
  `platform` varchar(30) NOT NULL,
  `release_date` date NOT NULL,
  `pegi_age` int(11) NOT NULL,
  `stock` int(11) NOT NULL DEFAULT '0',
  `price` double NOT NULL,
  `image` varchar(255) DEFAULT NULL,
  `pi_id` int(11) NOT NULL,
  PRIMARY KEY (`ean_number`),
  KEY `pi_id` (`pi_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

INSERT INTO `game` (`ean_number`, `platform`, `release_date`, `pegi_age`, `stock`, `price`, `image`, `pi_id`) VALUES
(45665465, 'PS2', '2002-10-27', 18, 50, 54.99, 'https://upload.wikimedia.org/wikipedia/en/c/ce/Vice-city-cover.jpg', 1),
(9006113007210, 'PC', '2014-06-20', 7, 445, 36.99, 'https://s.s-bol.com/imgbase0/imagebase3/large/FC/7/0/0/0/9200000027120007.jpg', 2);

/* Create `platform_indipendent_info` table */
CREATE TABLE IF NOT EXISTS `platform_independent_info` (
  `pi_id` int(11) NOT NULL AUTO_INCREMENT,
  `publisher` varchar(50) NOT NULL,
  `title` varchar(100) NOT NULL,
  `subtitle` varchar(50) DEFAULT NULL,
  `genre` varchar(50) NOT NULL,
  `franchise` varchar(50) DEFAULT NULL,
  `description` text NOT NULL,
  PRIMARY KEY (`pi_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1;

INSERT INTO `platform_independent_info` (`pi_id`, `publisher`, `title`, `subtitle`, `genre`, `franchise`, `description`) VALUES
(1, 'Rockstar', 'Grand Theft Auto: Vice City', 'Vice City', 'Actie', 'Grand Theft Auto', 'Grand Theft Auto - Vice City speelt zich zo''n twintig jaar eerder af dan GRAND THEFT AUTO III en voert je terug naar de tachtiger jaren van de vorige eeuw die de wereld meer geld, meer glamour, meer grote auto''s, maar ook meer drugs, criminaliteit, en decadentie brachten.Maak kennis met Tommy Vercetti, een gangster uit Liberty City die al een behoorlijke tijd meedraait in het misdaadwereldje en die net een gevangenisstraf van 15 jaar heeft uitgezeten. Noodgedwongen heeft Tommy Liberty City achter zich gelaten en is hij uitgeweken naar Vice City waar hij het criminele koninkrijk van de Forelli''s in opdracht van ene Sonny Forelli stevig moet gaan uitbreiden. Hij krijgt hiervoor een flinke som geld tot zijn beschikking die hij echter al tijdens zijn eerste opdracht verliest waardoor hij zich de woede van Sonny Forelli op de hals haalt. Dankzij zijn connecties met de onderwereld weet Tommy zich te redden..Maak in de eerste missie kennis met de advocaat van de Forelli-familie. Hij nodigt je uit op een bootfeestje waar alle hoofdrolspelers van de misdaadwereld van Vice City aanwezig zijn; hier start je nieuwe misdaadcarriere.'),
(2, 'Nordic Games', 'Planetary Annihilation', NULL, 'Real Time', NULL, '\r\nKoloniseer zonnestelsels, vermorzel hele werelden en vernietig je tegenstanders in epische gevechten met meerdere spelers en duizenden eenheden. Planetary Annihilation tilt real-time strategy naar planetaire hoogten. Bestuur ronkende, krachtige oorlogstanks, enorme bommenwerpers en een arsenaal van onderzeeers, bots, orbitale eenheden en oorlogsschepen. Gebruik hele planeten als basis en stuur je oorlogsmachine naar andere hemellichamen. Speel met maximaal 40 spelers in epische free-for-alls of vecht tegen de AI. Voorzie asteroiden van raketten en laat ze inslaan op planeten van tegenstanders om ze in kraters te veranderen. Winnen is niet genoeg. Alles moet kapot.');