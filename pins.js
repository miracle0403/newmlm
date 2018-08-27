// procedure for leafadd
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
							
							
							
							//reset post request
router.post('/passwordreset', function(req, res, next) {
	req.checkBody('username', 'Full Name must be between 8 to 25 characters').len(8,25);
	req.checkBody('email', 'Email must be between 8 to 25 characters').len(8,25);
	var errors = req.validationErrors();

  if (errors) { 
    console.log(JSON.stringify(errors));
    res.render('passwordreset', { title: 'FAILED', errors: errors});

  }
  else {
    var username = req.body.username;
    var email = req.body.email;
	db.query('SELECT username FROM user WHERE username = ?', [username], function(err, results, fields){
		if (err) throw err;
		if(results.length = 0){
			res.render('passwordreset', {title: 'FAILED', check: 'Username Does not exist!'});
		}else{
			db.query('SELECT email FROM user WHERE email = ?', [email], function(err, results, fields){
				if (err) throw err;
				if(results.length = 0){
					res.render('passwordreset', {title: 'FAILED', check: 'Username Does not exist!'});
				}else{
					res.render('passwordreset', {title: 'SUCCESS', check: 'Check your mail!'});
				}
			});
		}
	});
  }
});
//function for reset password
function timerreset(){
db.query( 'SELECT date FROM reset WHERE status = ?' ['active'], function ( err, results, fields ){
if ( err ) throw err;
var i = 0
while ( i> results.length  ){
var dt = results[i]date;
var min  = new Date().getMinutes();
var cal  = dt.setMinutes( dt.getMinutes() + 15)
if( cal >=  min){
	db.query( 'UPDATE reset SET status  = ? WHERE date = ?', ['expired', dt], function ( err, results, fields){
		if( err ) throw err;
	});
}
i++;
}
}
//function for verification code
function verify(){
db.query( 'SELECT date FROM verify WHERE status = ?' ['active'], function ( err, results, fields ){
if ( err ) throw err;
var i = 0
while ( i> results.length  ){
var dt = results[i]date;
var min  = new Date().getMinutes();
var cal  = dt.setMinutes( dt.getMinutes() + 15)
if( cal >=  min){
	db.query( 'UPDATE verify SET status  = ? WHERE date = ?', ['expired', dt], function ( err, results, fields){
		if( err ) throw err;
	});
}
i++;
}
}


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