DELETE from pin WHERE user_id = 30;
DELETE from prestarter_tree WHERE user = 30;
DELETE from incentives WHERE user = 30;
UPDATE prestarter_tree set a = NULL WHERE a = 30;


UPDATE prestarter set rgt = 5 WHERE user = 29;
UPDATE prestarter set rgt = 6 WHERE user = 24;
UPDATE prestarter set rgt = 7 WHERE user = 23;
UPDATE prestarter set rgt = 8 WHERE user = 1;

DELIMITER //
CREATE PROCEDURE leafadd(mother INT(11), child INT(11))
BEGIN

SELECT @myLeft := lft FROM feeder WHERE user = mother;
UPDATE prestarter SET rgt = rgt + 2 WHERE rgt > @myLeft;
UPDATE prestarter SET lft = lft + 2 WHERE lft > @myLeft;

INSERT INTO prestarter(user,lft,rgt) VALUES(child, @myLeft + 1, @myLeft + 2);

END //
DELIMITER ;


//tree retrieval
SELECT node.user FROM prestarter AS node, prestarter AS parent WHERE node.lft BETWEEN parent.lft AND parent.rgt AND parent.user = 2 ORDER BY node.lft;
SELECT * FROM prestarter AS node, prestarter AS parent, prestarter_tree AS main WHERE (a IS null or b is null or c is null) AND node.lft BETWEEN parent.lft AND parent.rgt AND parent.user = 24 ORDER BY node.lft

SELECT @user := user FROM prestarter AS node, prestarter AS parent, prestarter_tree AS main WHERE (a IS null or b is null or c is null) AND node.lft BETWEEN parent.lft AND parent.rgt AND parent.user = 24 ORDER BY node.lft