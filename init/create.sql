SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for device
-- ----------------------------
DROP TABLE IF EXISTS `plus_device`;
CREATE TABLE `plus_device` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `createdAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `name` varchar(255) DEFAULT NULL,
  `groupId` int(11) DEFAULT NULL,
  `firebaseId` varchar(255) NOT NULL,
  `appVersion` int(11) DEFAULT NULL,
  `device` varchar(128) DEFAULT NULL,
  `lastOnline` bigint(20) DEFAULT NULL,
  `osVersion` int(11) DEFAULT NULL,
  `status` varchar(255) DEFAULT NULL,
  `ownerId` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `firebaseId` (`firebaseId`),
  KEY `Device - Group` (`groupId`),
  KEY `Device - Owner` (`ownerId`),
  CONSTRAINT `Device - Group` FOREIGN KEY (`groupId`) REFERENCES `plus_group` (`id`) ON DELETE SET NULL ON UPDATE NO ACTION,
  CONSTRAINT `Device - Owner` FOREIGN KEY (`ownerId`) REFERENCES `plus_owner` (`id`) ON DELETE SET NULL ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for group
-- ----------------------------
DROP TABLE IF EXISTS `plus_group`;
CREATE TABLE `plus_group` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `createdAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `name` varchar(255) DEFAULT NULL,
  `ownerId` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `Group - Owner` (`ownerId`),
  CONSTRAINT `Group - Owner` FOREIGN KEY (`ownerId`) REFERENCES `plus_owner` (`id`) ON DELETE SET NULL ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for media
-- ----------------------------
DROP TABLE IF EXISTS `plus_media`;
CREATE TABLE `plus_media` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `createdAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `name` varchar(255) DEFAULT NULL,
  `mimeType` varchar(60) DEFAULT NULL,
  `duration` int(11) DEFAULT NULL,
  `path` varchar(255) DEFAULT NULL,
  `url` varchar(255) DEFAULT NULL,
  `magnet` varchar(255) DEFAULT NULL,
  `ownerId` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `Media - Owner` (`ownerId`),
  CONSTRAINT `Media - Owner` FOREIGN KEY (`ownerId`) REFERENCES `plus_owner` (`id`) ON DELETE SET NULL ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for owner
-- ----------------------------
DROP TABLE IF EXISTS `plus_owner`;
CREATE TABLE `plus_owner` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 ROW_FORMAT=DYNAMIC;

-- ----------------------------
-- Table structure for playlist
-- ----------------------------
DROP TABLE IF EXISTS `plus_playlist`;
CREATE TABLE `plus_playlist` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `createdAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `name` varchar(255) DEFAULT NULL,
  `groupId` int(11) DEFAULT NULL,
  `repeated` tinyint(4) DEFAULT NULL,
  `startDate` datetime DEFAULT NULL,
  `endDate` datetime DEFAULT NULL,
  `startBlock` int(11) DEFAULT NULL,
  `endBlock` int(11) DEFAULT NULL,
  `ownerId` int(11) DEFAULT NULL,
  `itemOrder` text CHARACTER SET utf8 COLLATE utf8_general_ci,
  PRIMARY KEY (`id`),
  KEY `Playlist - Group` (`groupId`),
  KEY `Playlist - Owner` (`ownerId`),
  CONSTRAINT `Playlist - Group` FOREIGN KEY (`groupId`) REFERENCES `plus_group` (`id`) ON DELETE SET NULL ON UPDATE NO ACTION,
  CONSTRAINT `Playlist - Owner` FOREIGN KEY (`ownerId`) REFERENCES `plus_owner` (`id`) ON DELETE SET NULL ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for playlistMedia
-- ----------------------------
DROP TABLE IF EXISTS `plus_playlistMedia`;
CREATE TABLE `plus_playlistMedia` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `playlistId` int(11) DEFAULT NULL,
  `mediaId` int(11) DEFAULT NULL,
  `ownerId` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `PlaylistId` (`playlistId`),
  KEY `MediaId` (`mediaId`),
  KEY `PlaylistMedia - OwnerId` (`ownerId`),
  CONSTRAINT `MediaId` FOREIGN KEY (`mediaId`) REFERENCES `plus_media` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION,
  CONSTRAINT `PlaylistId` FOREIGN KEY (`playlistId`) REFERENCES `plus_playlist` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION,
  CONSTRAINT `PlaylistMedia - OwnerId` FOREIGN KEY (`ownerId`) REFERENCES `plus_owner` (`id`) ON DELETE SET NULL ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


-- ----------------------------
-- Table structure for ticker
-- ----------------------------
DROP TABLE IF EXISTS `plus_ticker`;
CREATE TABLE `plus_ticker` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `createdAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `name` varchar(255) DEFAULT NULL,
  `content` varchar(255) DEFAULT NULL,
  `type` enum('TEXT','RSS') DEFAULT NULL,
  `tickerlistId` int(11) DEFAULT NULL,
  `ownerId` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `Ticker - Owner` (`ownerId`),
  KEY `Ticker - TickerList` (`tickerlistId`),
  CONSTRAINT `Ticker - Owner` FOREIGN KEY (`ownerId`) REFERENCES `plus_owner` (`id`) ON DELETE SET NULL,
  CONSTRAINT `Ticker - TickerList` FOREIGN KEY (`tickerlistId`) REFERENCES `plus_tickerlist` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for tickerlist
-- ----------------------------
DROP TABLE IF EXISTS `plus_tickerlist`;
CREATE TABLE `plus_tickerlist` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `createdAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `name` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  `groupId` int(11) DEFAULT NULL,
  `repeated` tinyint(255) DEFAULT NULL,
  `startDate` datetime DEFAULT NULL,
  `endDate` datetime DEFAULT NULL,
  `startBlock` int(255) DEFAULT NULL,
  `endBlock` varchar(255) DEFAULT NULL,
  `ownerId` int(11) DEFAULT NULL,
  `itemOrder` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `GroupId` (`groupId`),
  CONSTRAINT `GroupId` FOREIGN KEY (`groupId`) REFERENCES `plus_group` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


-- ----------------------------
-- Table structure for user
-- ----------------------------
DROP TABLE IF EXISTS `plus_user`;
CREATE TABLE `plus_user` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `createdAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `name` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for userOwner
-- ----------------------------
DROP TABLE IF EXISTS `plus_userOwner`;
CREATE TABLE `plus_userOwner` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `userId` int(11) DEFAULT NULL,
  `ownerId` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `UserOwner - Owner` (`ownerId`),
  KEY `UserOwner - User` (`userId`),
  CONSTRAINT `UserOwner - Owner` FOREIGN KEY (`ownerId`) REFERENCES `plus_owner` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION,
  CONSTRAINT `UserOwner - User` FOREIGN KEY (`userId`) REFERENCES `plus_user` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- View structure for deviceWithMedia
-- ----------------------------
DROP VIEW IF EXISTS `plus_deviceWithMedia`;
CREATE ALGORITHM=UNDEFINED DEFINER=`plusboard`@`%` SQL SECURITY DEFINER VIEW `plus_deviceWithMedia`
AS select
`plus_device`.`id` AS `deviceId`,
`plus_device`.`firebaseId` AS `firebaseId`,
`plus_group`.`id` AS `groupId`,
`plus_playlistMedia`.`id` AS `playlistMediaId`,
`plus_playlistMedia`.`mediaId` AS `mediaId`,
`plus_playlistMedia`.`playlistId` AS `playlistId`,
`plus_media`.`name` AS `mediaName`,
`plus_media`.`mimeType` AS `mimeType`,
`plus_media`.`duration` AS `mediaDuration`,
`plus_media`.`path` AS `path`,
`plus_media`.`url` AS `url`,
`plus_media`.`magnet` AS `magnet`,
`plus_playlist`.`repeated` AS `repeated`,
`plus_playlist`.`startDate` AS `startDate`,
`plus_playlist`.`endDate` AS `endDate`,
`plus_playlist`.`startBlock` AS `startBlock`,
`plus_playlist`.`endBlock` AS `endBlock`,
`plus_playlist`.`itemOrder` AS `mediaOrder`,
`plus_ticker`.`id` AS `tickerId`,
`plus_ticker`.`name` AS `tickerName`,
`plus_ticker`.`content` AS `tickerContent`,
`plus_ticker`.`type` AS `tickerType`,
`plus_ticker`.`tickerlistId` AS `tickerlistId`,
`plus_tickerlist`.`name` AS `tickerlistName`,
`plus_tickerlist`.`startBlock` AS `tickerlistStartBlock`,
`plus_tickerlist`.`endBlock` AS `tickerlistEndBlock`,
`plus_tickerlist`.`endDate` AS `tickerlistEndDate`,
`plus_tickerlist`.`startDate` AS `tickerlistStartDate`,
`plus_tickerlist`.`repeated` AS `tickerlistRepeated`,
`plus_tickerlist`.`itemOrder` AS `tickerlistOrder`
from ((((((`plus_device` left join `group` on((`plus_device`.`groupId` = `plus_group`.`id`))) left join `plus_playlist` on((`plus_playlist`.`groupId` = `plus_group`.`id`))) left join `plus_playlistMedia` on((`plus_playlistMedia`.`playlistId` = `plus_playlist`.`id`))) left join `plus_media` on((`plus_playlistMedia`.`mediaId` = `plus_media`.`id`))) join `plus_tickerlist` on((`plus_tickerlist`.`groupId` = `plus_group`.`id`))) join `plus_ticker` on((`plus_ticker`.`tickerlistId` = `plus_tickerlist`.`id`))) order by `plus_device`.`id` asc, `plus_device`.`id` asc, `plus_playlistMedia`.`playlistId` asc, `plus_playlistMedia`.`mediaId` asc;
-- ----------------------------
-- Procedure structure for OwnersByUser
-- ----------------------------
DELIMITER ;;
DROP PROCEDURE IF EXISTS `plus_OwnersByUser`;;
CREATE DEFINER=`plusboard`@`%` PROCEDURE `plus_OwnersByUser`(IN `userId` int)
BEGIN
	#Routine body goes here...
SELECT DISTINCT
        `plus_owner`.id,
        `plus_owner`.`name`
        FROM
        `plus_owner`
        INNER JOIN `plus_userOwner` ON `plus_userOwner`.ownerId = `plus_owner`.id
        INNER JOIN `plus_user` ON `plus_userOwner`.userId = userId ;
END;;
DELIMITER ;

-- ----------------------------
-- Default values
-- ----------------------------
INSERT INTO `plus_owner` (`id`, `name`)
VALUES
	(1, 'Default');
