CREATE DATABASE does_it_work_together;
USE does_it_work_together;

CREATE TABLE `programs` (
    `program_id` INT(10) AUTO_INCREMENT,
    `program_name` VARCHAR(30) NOT NULL UNIQUE,
    `program_description` VARCHAR(1000) DEFAULT "",
    PRIMARY KEY (`program_id`)
);

CREATE TABLE `versions` (
    `version_id` INT(10) AUTO_INCREMENT,
    `program_id` INT(10) NOT NULL,
    `version` VARCHAR(30) NOT NULL,
    `version_description` VARCHAR(1000) DEFAULT "",
    FOREIGN KEY (`program_id`) REFERENCES `programs`(`program_id`) ON DELETE CASCADE ON UPDATE CASCADE,
    PRIMARY KEY (`version_id`),
    UNIQUE (`program_id`, `version`)
);

CREATE TABLE `groups` (
    `group_id` INT(10) AUTO_INCREMENT,
    `group_name` VARCHAR(20) NOT NULL,
    `group_description` VARCHAR(1000) DEFAULT "",
    `works_vote` INT(10) DEFAULT 0,
    `fails_vote` INT(10) DEFAULT 0,
    PRIMARY KEY (`group_id`)
);

CREATE TABLE `group_memberships` (
    `group_id` INT(10) NOT NULL,
    `version_id` INT(10) NOT NULL,
    FOREIGN KEY (`group_id`) REFERENCES `groups`(`group_id`),
    FOREIGN KEY (`version_id`) REFERENCES `versions`(`version_id`),
    PRIMARY KEY (`group_id`, `version_id`)
);
