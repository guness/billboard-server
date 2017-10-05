SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for device
-- ----------------------------
DROP TABLE IF EXISTS `device`;
CREATE TABLE `device` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `createdAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `name` varchar(255) DEFAULT NULL,
  `groupId` int(11) DEFAULT NULL,
  `firebaseId` varchar(24) NOT NULL,
  `appVersion` int(11) DEFAULT NULL,
  `device` varchar(128) DEFAULT NULL,
  `lastOnline` bigint(20) DEFAULT NULL,
  `osVersion` int(11) DEFAULT NULL,
  `status` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `firebaseId` (`firebaseId`),
  KEY `Device - Group` (`groupId`),
  CONSTRAINT `Device - Group` FOREIGN KEY (`groupId`) REFERENCES `group` (`id`) ON DELETE SET NULL ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for group
-- ----------------------------
DROP TABLE IF EXISTS `group`;
CREATE TABLE `group` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `createdAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `name` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for media
-- ----------------------------
DROP TABLE IF EXISTS `media`;
CREATE TABLE `media` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `createdAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `name` varchar(255) DEFAULT NULL,
  `mimeType` varchar(60) DEFAULT NULL,
  `duration` int(11) DEFAULT NULL,
  `path` varchar(255) DEFAULT NULL,
  `url` varchar(255) DEFAULT NULL,
  `magnet` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for playlist
-- ----------------------------
DROP TABLE IF EXISTS `playlist`;
CREATE TABLE `playlist` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `createdAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `name` varchar(255) DEFAULT NULL,
  `groupId` int(11) DEFAULT NULL,
  `repeated` tinyint(4) DEFAULT NULL,
  `startDate` date DEFAULT NULL,
  `endDate` date DEFAULT NULL,
  `startBlock` int(11) DEFAULT NULL,
  `endBlock` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `Playlist - Group` (`groupId`),
  CONSTRAINT `Playlist - Group` FOREIGN KEY (`groupId`) REFERENCES `group` (`id`) ON DELETE SET NULL ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for playlistMedia
-- ----------------------------
DROP TABLE IF EXISTS `playlistMedia`;
CREATE TABLE `playlistMedia` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `playlistId` int(11) DEFAULT NULL,
  `mediaId` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `PlaylistId` (`playlistId`),
  KEY `MediaId` (`mediaId`),
  CONSTRAINT `MediaId` FOREIGN KEY (`mediaId`) REFERENCES `media` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION,
  CONSTRAINT `PlaylistId` FOREIGN KEY (`playlistId`) REFERENCES `playlist` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- View structure for playlistMedia
-- ----------------------------
DROP VIEW IF EXISTS `deviceWithMedia`;
CREATE ALGORITHM=UNDEFINED DEFINER=`Billboard`@`%` SQL SECURITY DEFINER VIEW `deviceWithMedia`
AS SELECT
   `device`.`id` AS `deviceId`,
   `device`.`firebaseId` AS `firebaseId`,
   `group`.`id` AS `groupId`,
   `playlistMedia`.`id` AS `playlistMediaId`,
   `playlistMedia`.`mediaId` AS `mediaId`,
   `playlistMedia`.`playlistId` AS `playlistId`,
   `media`.`name` AS `mediaName`,
   `media`.`mimeType` AS `mimeType`,
   `media`.`duration` AS `mediaDuration`,
   `media`.`path` AS `path`,
   `media`.`url` AS `url`,
   `media`.`magnet` AS `magnet`,
   `playlist`.`repeated` AS `repeated`,
   `playlist`.`startDate` AS `startDate`,
   `playlist`.`endDate` AS `endDate`,
   `playlist`.`startBlock` AS `startBlock`,
   `playlist`.`endBlock` AS `endBlock`
FROM ((((`device` join `group` on((`device`.`groupId` = `group`.`id`))) join `playlist` on((`playlist`.`groupId` = `group`.`id`))) join `playlistMedia` on((`playlistMedia`.`playlistId` = `playlist`.`id`))) join `media` on((`playlistMedia`.`mediaId` = `media`.`id`))) order by `device`.`id`,`group`.`id`,`playlistMedia`.`playlistId`,`playlistMedia`.`mediaId`;