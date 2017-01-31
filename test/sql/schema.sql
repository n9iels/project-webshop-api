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
(3307215785867, 'PS4', '2014-09-11', 18, 559, 32.99, 'https://s.s-bol.com/imgbase0/imagebase3/large/FC/7/3/4/6/9200000038446437.jpg', 1),
(3307215732953, 'PS4', '2014-05-16', 18, 265, 29.99, 'https://s.s-bol.com/imgbase0/imagebase3/large/FC/3/1/9/6/1004004013556913.jpg', 2),
(5030930113759, 'PC', '2016-10-21', 18, 1520, 49.99, 'https://s.s-bol.com/imgbase0/imagebase3/large/FC/7/8/4/3/9200000058463487.jpg', 3),
(5030941112437, 'XBOX ONE', '2015-03-19', 18, 657, 17.99, 'https://s.s-bol.com/imgbase0/imagebase3/large/FC/1/3/4/0/9200000028780431.jpg', 4),
(5035223116370, 'PS4', '2016-09-29', 18, 359, 57.99, 'https://s.s-bol.com/imgbase0/imagebase3/large/FC/6/2/7/7/9200000059237726.jpg', 5),
(606060606, 'NES', '2001-01-01', 3, 0, 299.99, 'https://www.mariowiki.com/images/thumb/d/d2/SMB3_Boxart.PNG/250px-SMB3_Boxart.PNG', 6),
(48949865, 'NES', '1993-01-01', 3, 0, 19, 'https://upload.wikimedia.org/wikipedia/en/a/ae/Kirby''s_Adventure_Coverart.png', 7),
(2750073662947, 'Nintendo Switch', '2017-03-02', 12, 0, 58.99, 'https://s.s-bol.com/imgbase0/imagebase3/large/FC/5/5/9/2/9200000073662955.jpg', 8),
(123456789027328, 'PS1', '1997-03-20', 12, 1, 29.99, 'https://upload.wikimedia.org/wikipedia/en/c/cf/Castlevania_SOTN_PAL.jpg', 9),
(5615656566, 'N64', '2000-10-01', 3, 3, 39.99, 'https://www.mariowiki.com/images/thumb/b/b2/Papermario.PNG/450px-Papermario.PNG', 10),
(711719158363, 'PS3', '2013-08-01', 18, 248, 16.95, 'https://s.s-bol.com/imgbase0/imagebase3/large/FC/1/7/7/6/1004004011326771.jpg', 11),
(45665465, 'PS2', '2002-10-27', 18, 50, 54.99, 'https://upload.wikimedia.org/wikipedia/en/c/ce/Vice-city-cover.jpg', 12);

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
(1, 'Ubisoft', 'Assassin''s Creed: Unity', NULL, 'Actie', NULL, 'Parijs. Het jaar 1789. De Franse Revolutie verandert een prachtige stad in een plaats van terreur en chaos. De geplaveide straten worden overspoeld door het bloed van iedereen die durft op te staan tegen de onderdrukkende elite. Toch, terwijl Frankrijk lijdt, staat een jongeman genaamd Arno op om de ware krachten achter de Revolutie te onthullen. Deze achtervolging plaatst hem in het midden van een meedogenloze strijd en verandert hem in een echte Master Assassin.Dit is Assassin’s Creed® Unity, de next-gen evolutie van de blockbuster franchise, gevoed door de nieuwe Anvil Engine, opnieuw gemaakt voor een nieuwe generatie gaming. Van de bestorming van de Bastille tot de executie van koning Louis XVI. Ervaar de Franse Revolutie als nooit tevoren en help de inwoners van Frankrijk hun eigen lot te bepalen.'),
(2, 'Ubisoft', 'Watch Dogs', NULL, 'Actie', NULL, 'Watch Dogs is een futuristische actiegame waarin de speler het opneemt tegen de regering. Alsof het Big Brother is, houdt de stad de hoofdpersoon in de gaten. Hij vindt daarop een antwoord door technologie met technologie te bestreden. Watch Dogs draait om digitale terrorisme, privacy, connectiviteit, veiligheid en andere belangrijke onderwerpen die door de komst van draadloze technologie aan de kaak gesteld worden.'),
(3, 'Electronic Arts', 'Battlefield 1', NULL, 'Actie', NULL, 'Ervaar het begin van totale oorlog in Battlefield™ 1. Baan je een weg door epische gevechten, variërend van krappe belegerde Franse steden tot zwaar verdedigde bergforten in de Italiaanse Alpen, en aanschouw waanzinnige veldslagen in de woestijn van Arabië. Ontdek een nieuwe wereld in oorlog via een avontuurlijke campagne, of doe mee aan epische multiplayer gevechten met maximaal 64 spelers. Stem je tactiek af op de adembenemende omgevingen en totale verwoesting. Strijd als infanterie of bestuur ongelooflijke voertuigen te land, ter zee en in de lucht (variërend van tanks en motoren op de grond tot dubbeldekkers en gigantische oorlogsschepen), en stem je speelstijl af op de meest dynamische gevechten in de geschiedenis van Battlefield. '),
(4, 'Electronic Arts', 'Battlefield: Hardline', NULL, 'Actie', NULL, 'Zoek de strijd op tussen politie en criminelen in Battlefield Hardline. Deze geweldige actiegame combineert het intense, karakteristieke multiplayer-gedeelte van Battlefield met een door emoties gedreven verhaallijn. De uitvoering doet denken aan een moderne misdaadserie op tv. In een meeslepende singleplayer-campagne speel je de rol van Nick Mendoza, een jonge rechercheur die het land doorkruist om wraak te nemen op collega''s die hij ooit vertrouwde. In de multiplayer jaag je op criminelen, plunder je bankkluizen en red je gijzelaars in nieuwe speltypen zoals Heist en Rescue. Welcome to your new playground. '),
(5, 'Electronic Arts', 'FIFA 17', NULL, 'Actie', NULL, 'Heb de totale controle. FIFA17 bevat totale vernieuwingen waardoor spelers anders denken, bewegen, op een andere manier fysieke interacties hebben met tegenstanders en andere speelstijlen uitvoeren. Jij hebt dit als speler zelf in de hand.'),
(6, 'Nintendo', 'Super Mario Bros. 3', 'Super Mario 3', 'Avontuur', 'Super Mario', 'De 3e lancering van Super Mario'),
(7, 'Nintendo', 'Kirby''s Adventure', 'Join Kirby on his adventure', 'Avontuur', 'Kirby', 'Kirby ventures on a new adventure.'),
(8, 'Nintendo', 'The Legend of Zelda: Breath of the Wild', 'Breath of the Wild', 'Avontuur', 'Zelda', 'BETREED EEN WERELD VOL AVONTUUR\nVergeet alles wat je ooit hebt geleerd over The Legend of Zelda-games. Maak een ontdekkingsreis in een wereld vol avontuur in The Legend of Zelda: Breath of the Wild, een grensverleggende, nieuwe game in de bekroonde serie.\n\nVerken de wildernis van Hyrule in alle vrijheid\nBeklim torens en bergtoppen om nieuwe bestemmingen te zien. Stippel vervolgens je koers uit en waag je in de wildernis. Onderweg zul je het moeten opnemen tegen reusachtige vijanden. Ook moet je jacht maken op wilde dieren en ingrediënten verzamelen voor het voedsel en de drankjes die je nodig hebt tijdens je avontuur.\n\nOntdek en verken meer dan 100 tempels\nOveral in het rijk vind je tempels, die je in een willekeurige volgorde kunt ontdekken. Probeer alle heiligdommen te vinden en los de puzzels op die deze tempels herbergen. Baan je een weg langs de valstrikken en mechanismes in deze geheimzinnige bouwwerken om bijzondere voorwerpen en beloningen te ontdekken die je op je avontuur nodig hebt.\n\nWees overal op voorbereid\nVoor je ligt een gigantische wereld die erom smeekt om ontdekt te worden. Om iedere uithoek te kunnen verkennen heb je verschillende outfits en uitrustingen nodig. Misschien moet je op zoek gaan naar warme kleding of juist naar kleren waarmee je de hitte in de woestijn kunt trotseren. Sommige kledingstukken hebben speciale effecten waardoor je bijvoorbeeld sneller wordt en minder snel te zien bent.\n\nVijanden verslaan vergt strategisch inzicht\nDe wereld wordt bewoond door vijanden in alle soorten en maten. Iedere tegenstander beschikt over unieke aanvallen en wapens. Je zult daarom razendsnel moeten nadenken en de juiste strategieën moeten bedenken om ze te verslaan.'),
(9, 'Konami', 'Castlevania: Symphony of the Night', 'Symphony of the Night', 'RPG', 'Castlevania', 'Castlevania: Symphony of the Night begins during the ending of the previous game in the series, Castlevania: Rondo of Blood, where Richter Belmont (Scott McCulloch; David Vincent in the redub) confronts and defeats Count Dracula (Michael G; Patrick Seitz in the redub).[12] Four years later, in 1796, Alucard (Robert Belgrade; Yuri Lowenthal in the redub) arrives at the castle. Inside, he meets Dracula''s servant Death (Dennis Falt; Travis Willingham in the redub), who warns him to stop his quest to destroy the castle and strips him of his equipment. He also meets Maria Renard (Kimberly Forsythe; Michelle Ruff in the redub), a seventeen-year-old vampire hunter who fought alongside Richter and is now searching for him, and the castle''s librarian, who sells items and equipment to Alucard. Periodically encountering Maria throughout the castle, Alucard also meets Richter, who claims to be the new lord of the castle and forces him to battle with two monsters.\r\n\r\nAlucard defeats the monsters, finds Maria again, and tells her about Richter. Upset, she leaves Alucard to confirm it for herself. Convinced that Richter is under somebody else''s control, Maria meets Alucard again; she urges him not to hurt Richter and gives him an item that allows him to see past illusions. In the castle''s keep, Alucard confronts Richter and learns that he plans to resurrect Dracula so he may battle the vampire for eternity. Alucard breaks the spell controlling Richter. Dracula''s servant Shaft (Jeff Manning; Tony Oliver in the redub) appears and reveals that despite the spell being broken, Dracula will be resurrected soon. Shaft summons an inverted version of the castle.\r\n\r\nAlucard leaves Richter to Maria''s care and enters the inverted castle to find and destroy Shaft. Along the way, he defeats Death and eventually finds Shaft. Shaft admits he planned to end the threat of the Belmont clan by controlling one as the master of the castle and forcing them to fight each other. Alucard defeats Shaft, who reveals that Dracula''s resurrection is complete. Alucard faces his own father, who vows to destroy humankind because Alucard''s mother Lisa was executed as a witch. Alucard refuses to join his father in his revenge and the two battle. Alucard defeats his father and suggests he lost the battle because he lost his ability to love after Lisa''s death. Dracula quotes the biblical verse Matthew 16:26 (in the dub) and learns that Lisa''s final words were of eternal love for him and a plea not to hate – or at least harm – humanity.\r\n\r\nAs Dracula vanishes, he asks for Lisa''s forgiveness and bids his son farewell. Escaping the crumbling castle, Alucard rejoins Maria and Richter. Maria expresses relief that he escaped while Richter blames himself as the reason for Alucard''s fight with his father. Alucard tells Richter, "the only thing necessary for evil to triumph is for good men to do nothing," (an attributed quote from Edmund Burke) and resolves to disappear from the world because of his cursed bloodline. Depending on how much of the castle the player has explored, Maria either chases Alucard in the hope of changing his mind, or resigns herself to Alucard''s fate and leaves with Richter.'),
(10, 'Nintendo', 'Paper Mario', 'Paper Mario', 'RPG', 'Paper Mario', 'Thinner Mario, Bigger Adventure!'),
(11, 'Sony', 'God of War 3 - Essentials Edition', 'Essentials Edition', 'Avontuur', 'God of War', 'God Of War III vertelt het verhaal van een getergde Kratos die wraak wil voor alles wat hem is aangedaan. Hij mengt zich in een oorlog met de Goden van de Griekse oudheid en komt in epische gevechten terecht waarbij iedereen die op zijn pad komt het onderspit moet delven!\n\nIn God Of War III wordt de PS3 tot het uiterste gedreven. De vijanden komen in ongekende aantallen op je afgestormd, terwijl de camera regelmatig naar duizelingwekkende hoogte klimt. De epische schaal van God Of War III wordt pas echt duidelijk als je op een Titan zit die complete steden met zijn handen kan vermorzelen!\n\nDe mythologische wezens zijn niet langer enkel voer voor de gewelddadige uitspattingen van Kratos, maar ook handige hulpmiddelen. Door wezens als de Cycloop te berijden, kun je bepaalde verborgen plekken bereiken of vijanden snel aan stukken scheuren!\n\nKratos heeft in God Of War III een stuk meer wapens tot zijn beschikking. Zo heeft hij een ijzeren klauw met de naam Cestus waarmee hij er flink op los kan beuken. Daarnaast leer je constant nieuwe bewegingen, zoals de mogelijkheid om met een vijand als een heuse stormram door grote groepen heen te beuken!\n\nGewapend met je trouwe kettingzwaarden slacht je duistere mythologische wezens af en los je puzzels op om uiteindelijk Olympus en de machtige Zeus te vernietigen. Speel het prachtige sluitstuk van de God of War-serie en geef Kratos zijn welverdiende wraak!'),
(12, 'Rockstar', 'Grand Theft Auto: Vice City', 'Vice City', 'Actie', 'Grand Theft Auto', 'Grand Theft Auto - Vice City speelt zich zo''n twintig jaar eerder af dan GRAND THEFT AUTO III en voert je terug naar de tachtiger jaren van de vorige eeuw die de wereld meer geld, meer glamour, meer grote auto''s, maar ook meer drugs, criminaliteit, en decadentie brachten.Maak kennis met Tommy Vercetti, een gangster uit Liberty City die al een behoorlijke tijd meedraait in het misdaadwereldje en die net een gevangenisstraf van 15 jaar heeft uitgezeten. Noodgedwongen heeft Tommy Liberty City achter zich gelaten en is hij uitgeweken naar Vice City waar hij het criminele koninkrijk van de Forelli''s in opdracht van ene Sonny Forelli stevig moet gaan uitbreiden. Hij krijgt hiervoor een flinke som geld tot zijn beschikking die hij echter al tijdens zijn eerste opdracht verliest waardoor hij zich de woede van Sonny Forelli op de hals haalt. Dankzij zijn connecties met de onderwereld weet Tommy zich te redden..Maak in de eerste missie kennis met de advocaat van de Forelli-familie. Hij nodigt je uit op een bootfeestje waar alle hoofdrolspelers van de misdaadwereld van Vice City aanwezig zijn; hier start je nieuwe misdaadcarriere.');