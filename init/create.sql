SET FOREIGN_KEY_CHECKS=0;

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
  PRIMARY KEY (`id`),
  KEY `Playlist - Group` (`groupId`),
  CONSTRAINT `Playlist - Group` FOREIGN KEY (`groupId`) REFERENCES `group` (`id`) ON DELETE SET NULL ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;

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
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;

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
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for media
-- ----------------------------
DROP TABLE IF EXISTS `media`;
CREATE TABLE `media` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `createdAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `name` varchar(255) DEFAULT NULL,
  `mediaType` enum('IMAGE','VIDEO') DEFAULT NULL,
  `duration` int(11) DEFAULT NULL,
  `playlistId` int(11) DEFAULT NULL,
  `path` varchar(255) DEFAULT NULL,
  `url` varchar(255) DEFAULT NULL,
  `magnet` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `Media - Playlist` (`playlistId`),
  CONSTRAINT `Media - Playlist` FOREIGN KEY (`playlistId`) REFERENCES `playlist` (`id`) ON DELETE SET NULL ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;
