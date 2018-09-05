//procedure for register
DELIMITER //
CREATE PROCEDURE register(sponsor int( 11 ), fullname varchar( 255 ), phone varchar( 255 ), code int( 11 ), username VARCHAR( 255 ), email varchar( 255 ), password varcyar( 255 ), status varchar( 255 ), verification text)

BEGIN

INSERT INTO user ( sponsor, full_name, phone, code, username, email, password, status, verification) VALUES( sponsor, fullname, phone,code, username, email, password, 'active', 'no');

SELECT @myLeft := lft FROM user_tree WHERE user_id = LAST_INSERT_ID();

UPDATE user_tree SET rgt = rgt + 2 WHERE rgt > @myLeft;
UPDATE user_tree SET lft = lft + 2 WHERE lft > @myLeft;

INSERT INTO user_tree(user,lft,rgt) VALUES(@myLeft, @myLeft + 1, @myLeft + 2);

END //
DELIMITER ;

// procedure for leafadd
drop procedure leafadd
DELIMITER //
CREATE PROCEDURE leafadd(sponsor INT(11), mother INT(11), child INT(11))
BEGIN

SELECT @myLeft := lft FROM feeder WHERE user = mother;
INSERT INTO feeder_tree (sponsor, user) VALUES (sponsor, child);

UPDATE feeder SET rgt = rgt + 2 WHERE rgt > @myLeft;
UPDATE feeder SET lft = lft + 2 WHERE lft > @myLeft;
UPDATE feeder SET amount = amount + 1 WHERE user = mother;
INSERT INTO feeder(user,lft,rgt) VALUES(child, @myLeft + 1, @myLeft + 2);

END //
DELIMITER ;

// add the amount in feeders completion
DELIMITER //
CREATE PROCEDURE feederAmount (usere INT(11))
BEGIN
INSERT INTO earnings (user, amount) VALUES (usere, 6000);

END //
DELIMITER ;

//get into the stage 1
DELIMITER //
CREATE PROCEDURE stage1in(sponsor INT(11), mother INT(11), child INT(11))
BEGIN
SELECT @myLeft := lft FROM stage1 WHERE user = mother;
INSERT INTO stage1_tree (sponsor, user) VALUES (sponsor, child);
UPDATE sttage1 SET rgt = rgt + 2 WHERE rgt > @myLeft;
UPDATE stage1 SET lft = lft + 2 WHERE lft > @myLeft;
UPDATE stage1 SET amount = amount + 1 WHERE user = mother;

INSERT INTO stage1(user, lft, rgt) VALUES(child, @myLeft + 1, @myLeft + 2);

END //
DELIMITER ;
 
// add the amount in stage1 completion
DELIMITER //
CREATE PROCEDURE stage1Amount (usere INT(11))
BEGIN
UPDATE earnings SET powerbank = 4000, amount = amount + 50000 WHERE user = usere;

END //
DELIMITER ;
 
//stage 2 procedure
DELIMITER //
CREATE PROCEDURE stage2try(sponsor INT(11), mother INT(11), child INT(11))
BEGIN
SELECT @myLeft := lft FROM stage2 WHERE user = mother;
INSERT INTO stage2_tree (sponsor, user) VALUES (sponsor, child);
UPDATE sttage2 SET rgt = rgt + 2 WHERE rgt > @myLeft;
UPDATE stage2 SET lft = lft + 2 WHERE lft > @myLeft;
UPDATE stage2 SET amount = amount + 1 WHERE user = mother;

INSERT INTO stage2(user, lft, rgt) VALUES(child, @myLeft + 1, @myLeft + 2);

END //
DELIMITER ;

// add the amount in stage2 completion
DELIMITER //
CREATE PROCEDURE stage2Amount (usere INT(11))
BEGIN
UPDATE earnings SET phone = 30000, amount = amount + 100000 WHERE user = usere;

END //
DELIMITER ;

//stage 3 procedure
DELIMITER //
CREATE PROCEDURE stage3try(sponsor INT(11), mother INT(11), child INT(11))
BEGIN
SELECT @myLeft := lft FROM stage3 WHERE user = mother;
INSERT INTO stage3_tree (sponsor, user) VALUES (sponsor, child);
UPDATE sttage3 SET rgt = rgt + 2 WHERE rgt > @myLeft;
UPDATE stage3 SET lft = lft + 2 WHERE lft > @myLeft;
UPDATE stage3 SET amount = amount + 1 WHERE user = mother;

INSERT INTO stage3(user, lft, rgt) VALUES(child, @myLeft + 1, @myLeft + 2);

END //
DELIMITER ;

// add the amount in stage3 completion
DELIMITER //
CREATE PROCEDURE stage3Amount (usere INT(11))
BEGIN
UPDATE earnings SET amount = amount + 15000 WHERE user = usere;

END //
DELIMITER ;

// call procedure to get the depth of the feeder
DELIMITER //
CREATE PROCEDURE getdepth(child INT(11))
BEGIN
SELECT node.user, (COUNT(parent.user) - (sub_tree.depth + 1)) AS depth
FROM feeder AS node,
        feeder AS parent,
        feeder AS sub_parent,
        (
                SELECT node.user, (COUNT(parent.user) - 1) AS depth
                FROM feeder AS node,
                feeder AS parent
                WHERE node.lft BETWEEN parent.lft AND parent.rgt
                AND node.user = child
                GROUP BY node.user
                ORDER BY node.lft
        )AS sub_tree
WHERE node.amount < 4 AND node.lft BETWEEN parent.lft AND parent.rgt
        AND node.lft BETWEEN sub_parent.lft AND sub_parent.rgt
        AND sub_parent.user = sub_tree.user
GROUP BY node.user
HAVING depth > 0
ORDER BY depth;
END //
DELIMITER ;

//call b for feeder// call procedure to get the depth of the feeder
DELIMITER //
CREATE PROCEDURE getdepth1(child INT(11))
BEGIN
SELECT node.user, (COUNT(parent.user) - (sub_tree.depth + 1)) AS depth
FROM feeder AS node,
        feeder AS parent,
        feeder AS sub_parent,
        (
                SELECT node.user, (COUNT(parent.user) - 1) AS depth
                FROM feeder AS node,
                feeder AS parent
                WHERE node.lft BETWEEN parent.lft AND parent.rgt
                AND node.user = child
                GROUP BY node.user
                ORDER BY node.lft
        )AS sub_tree
WHERE node.amount = 0 AND node.lft BETWEEN parent.lft AND parent.rgt
        AND node.lft BETWEEN sub_parent.lft AND sub_parent.rgt
        AND sub_parent.user = sub_tree.user
GROUP BY node.user
HAVING depth > 0
ORDER BY depth;
END //
DELIMITER ;

//call the <2
// call procedure to get the depth of the feeder
DELIMITER //
CREATE PROCEDURE getdepth2(child INT(11))
BEGIN
SELECT node.user, (COUNT(parent.user) - (sub_tree.depth + 1)) AS depth
FROM feeder AS node,
        feeder AS parent,
        feeder AS sub_parent,
        (
                SELECT node.user, (COUNT(parent.user) - 1) AS depth
                FROM feeder AS node,
                feeder AS parent
                WHERE node.lft BETWEEN parent.lft AND parent.rgt
                AND node.user = child
                GROUP BY node.user
                ORDER BY node.lft
        )AS sub_tree
WHERE node.amount = 1 AND node.lft BETWEEN parent.lft AND parent.rgt
        AND node.lft BETWEEN sub_parent.lft AND sub_parent.rgt
        AND sub_parent.user = sub_tree.user
GROUP BY node.user
HAVING depth > 0
ORDER BY depth;
END //
DELIMITER ;

// call the  = 2
// call procedure to get the depth of the feeder
DELIMITER //
CREATE PROCEDURE getdepth3(child INT(11))
BEGIN
SELECT node.user, (COUNT(parent.user) - (sub_tree.depth + 1)) AS depth
FROM feeder AS node,
        feeder AS parent,
        feeder AS sub_parent,
        (
                SELECT node.user, (COUNT(parent.user) - 1) AS depth
                FROM feeder AS node,
                feeder AS parent
                WHERE node.lft BETWEEN parent.lft AND parent.rgt
                AND node.user = child
                GROUP BY node.user
                ORDER BY node.lft
        )AS sub_tree
WHERE node.amount 2 AND node.lft BETWEEN parent.lft AND parent.rgt
        AND node.lft BETWEEN sub_parent.lft AND sub_parent.rgt
        AND sub_parent.user = sub_tree.user
GROUP BY node.user
HAVING depth > 0
ORDER BY depth;
END //
DELIMITER ;

//call feeder for = 3
// call the  = 2
// call procedure to get the depth of the feeder
DELIMITER //
CREATE PROCEDURE getdepth4(child INT(11))
BEGIN
SELECT node.user, (COUNT(parent.user) - (sub_tree.depth + 1)) AS depth
FROM feeder AS node,
        feeder AS parent,
        feeder AS sub_parent,
        (
                SELECT node.user, (COUNT(parent.user) - 1) AS depth
                FROM feeder AS node,
                feeder AS parent
                WHERE node.lft BETWEEN parent.lft AND parent.rgt
                AND node.user = child
                GROUP BY node.user
                ORDER BY node.lft
        )AS sub_tree
WHERE node.amount 3 AND node.lft BETWEEN parent.lft AND parent.rgt
        AND node.lft BETWEEN sub_parent.lft AND sub_parent.rgt
        AND sub_parent.user = sub_tree.user
GROUP BY node.user
HAVING depth > 0
ORDER BY depth;
END //
DELIMITER ;

// call procedure to get the depth of the stage 1   
DELIMITER //
CREATE PROCEDURE getdepth1(child INT(11))
BEGIN
SELECT node.user, (COUNT(parent.user) - (sub_tree.depth + 1)) AS depth
FROM stage1 AS node,
        stage1 AS parent,
        stage1 AS sub_parent,
        (
                SELECT node.user, (COUNT(parent.user) - 1) AS depth
                FROM stage1 AS node,
                stage1 AS parent
                WHERE node.lft BETWEEN parent.lft AND parent.rgt
                AND node.user = child
                GROUP BY node.user
                ORDER BY node.lft
        )AS sub_tree
WHERE node.amount < 1 AND node.lft BETWEEN parent.lft AND parent.rgt
        AND node.lft BETWEEN sub_parent.lft AND sub_parent.rgt
        AND sub_parent.user = sub_tree.user
GROUP BY node.user
HAVING depth > 0
ORDER BY depth;
END //
DELIMITER ;
							
//create pins table
CREATE TABLE pin( user_id INT( 11 ) UNIQUE, serial text NOT NULL, pin varchar( 255 ) NOT NULL, date DATETIME)	;

//user tree table
drop table user_tree;
CREATE TABLE user_tree( user_id INT( 11 ) UNIQUE AUTO_INCREMENT, lft int( 11 ) not null, rgt int ( 11 ) NOT NULL, feeder text, stage1 text, stage2 text, stage3 text)	;
							
//user table
drop table user;
CREATE TABLE user( user_id INT( 11 ) UNIQUE AUTO_INCREMENT PRIMARY KEY, sponsor text,  username varchar( 255 ) UNIQUE NOT NULL, full_name varchar ( 255 ) NOT NULL, verification text, status text, email varchar ( 255 ) UNIQUE NOT NULL, phone INT( 11 ) NOT NULL, code INT( 11 ) NOT NULL, password varchar( 255 ) NOT NULL)	;

//create verify table
CREATE TABLE verify( user_id INT( 11 ) NOT NULL, status text, code int( 11 ) not null, date DATETIME)	;
							
CREATE TABLE reset( user_id INT( 11 ) NOT NULL, status text, code int( 11 ) not null, date DATETIME)	;
							
function fillup(x, ){
	db.query( 'SELECT a, b, user from feeder_tree WHERE user  = ?',[x], function ( err, results, fields ){
	if( err ) throw err;
	var firstfillup = {
		a: results[0].a,
		b: results[0].b
		user: results[0].user
	}
	db.query( 'SELECT a, b, user from feeder_tree WHERE user  = ?',[firstfillup.a], function ( err, results, fields ){
	if( err ) throw err;
	var afill = {
		a: results[0].a,
		b: results[0].b
	}
	db.query( 'UPDATE feeder_tree SET aa  = ?, ab = ? WHERE user  = ?', [afill.a, afill.b, x], function ( err, results, fields ){
		if ( err ) throw err;
		db.query( 'SELECT a, b, user from feeder_tree WHERE user  = ?',[firstfillup.b], function ( err, results, fields ){
	if( err ) throw err;
	var bfill = {
		a: results[0].a,
		b: results[0].b
	}
	db.query( 'UPDATE feeder_tree SET ba  = ?, bb = ? WHERE user  = ?', [bfill.a, bfill.b, x], function ( err, results, fields ){
		if ( err ) throw err;
		});
	});
	});
	});
	});
}