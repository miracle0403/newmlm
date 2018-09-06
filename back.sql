CREATE TABLE pin( user_id INT( 11 ) UNIQUE, serial text NOT NULL, pin varchar( 255 ) NOT NULL, date DATETIME)	;

CREATE TABLE `feeder_tree` (
	`matrix_id` INT(11) UNIQUE PRIMARY KEY AUTO_INCREMENT NOT NULL,
	`sponsor` INT(11) NOT NULL,
	`user` INT(11) NOT NULL,
	`a` INT(11) NULL DEFAULT NULL,
	`b` INT(11) NULL DEFAULT NULL,
	`c` INT(11) NULL DEFAULT NULL,
	`d` INT(11) NULL DEFAULT NULL
)
COLLATE='latin1_swedish_ci'
ENGINE=InnoDB
;

CREATE TABLE `feeder` (
	`user` INT(11) NOT NULL,
	`amount` INT(11) NOT NULL,
	`lft` INT(11) NOT NULL,
	`rgt` INT(11) NOT NULL
);

DELIMITER //
CREATE PROCEDURE feedercall (user INT(11))
BEGIN

SELECT parent.user_id FROM user_tree AS node, user_tree AS parent WHERE parent.feeder is not null AND node.lft BETWEEN parent.lft AND parent.rgt AND node.user_id = user ORDER BY parent.lft;

END //
DELIMITER ;

CREATE TABLE `pin_entrance` (
	`user_id` INT(11) NOT NULL,
	`amount` INT(11) NOT NULL,
	`date` DATETIME NOT NULL
);

CREATE TABLE `earnings` (
	`user_id` INT(11) NOT NULL,
	`feeder` INT(11) UNSIGNED ZEROFILL NOT NULL,
	`stage1` INT(11) UNSIGNED ZEROFILL NOT NULL,
	`stage2` INT(11) UNSIGNED ZEROFILL NOT NULL,
	`stage3` INT(11) UNSIGNED ZEROFILL NOT NULL,
		`stage4` INT(11) UNSIGNED ZEROFILL NOT NULL,
	`powerbank` INT(11) UNSIGNED ZEROFILL NOT NULL,
	`phone` INT(11) UNSIGNED ZEROFILL NOT NULL,
	`laptop` INT(11) UNSIGNED ZEROFILL NOT NULL,
	`leadership` INT(11) UNSIGNED ZEROFILL NOT NULL,
	`empower` INT(11) UNSIGNED ZEROFILL NOT NULL,
	`salary` INT(11) UNSIGNED ZEROFILL NOT NULL
)
COLLATE='latin1_swedish_ci'
ENGINE=InnoDB
;

drop table user_tree;
CREATE TABLE user_tree( user_id int( 11 )NOT NULL, lft int( 11 ) not null, rgt int ( 11 ) NOT NULL, feeder text, stage1 text, stage2 text, stage3 text)	;
							

drop table user;
CREATE TABLE user( user_id INT( 11 ) UNIQUE PRIMARY KEY AUTO_INCREMENT NOT NULL, sponsor text,  username varchar( 255 ) UNIQUE NOT NULL, full_name varchar ( 255 ) NOT NULL, verification text, status text, email varchar ( 255 ) UNIQUE NOT NULL, phone VARCHAR(255) NOT NULL, code INT( 11 ) NOT NULL, password varchar( 255 ) NOT NULL, paid varchar( 255 ), feeder text, stage1 text, stage2 text, stage3 text, amount int( 11 ))	;

CREATE TABLE `profile` (
	`user_id` INT(11) NOT NULL,
	`bank` TEXT NOT NULL,
	`account_name` TEXT NOT NULL,
	`account_number` VARCHAR(255) NOT NULL
)
COLLATE='latin1_swedish_ci'
ENGINE=InnoDB
;

DELIMITER //
CREATE PROCEDURE `register`( sponsor TEXT, fullname VARCHAR( 255 ), phone VARCHAR( 255 ), code INT( 11 ), username VARCHAR( 255 ), email VARCHAR ( 255 ), password VARCHAR( 255 ), status VARCHAR( 255 ), verification TEXT)                                  BEGIN

INSERT INTO user (sponsor, full_name, phone, code, username, email, password, status, verification) VALUES ( sponsor, fullname, phone,code, username, email, password, 'active', 'no');

END//
DELIMITER ;

DELIMITER //

CREATE PROCEDURE `useradd`( mother int ( 11 ), child int( 11 ))                   Begin                                      SELECT @myLeft := lft FROM user_tree WHERE user_id = mother;

UPDATE user_tree SET rgt = rgt + 2 WHERE rgt > @myLeft;
UPDATE user_tree SET lft = lft + 2 WHERE lft > @myLeft;

INSERT INTO user_tree ( user_id, lft, rgt ) Values( child, @myLeft + 1, @myLeft + 2 );

END //
DELIMITER ;