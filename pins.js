// procedure for leafadd
DELIMITER //
CREATE PROCEDURE leafadd(sponsor INT(11), mother INT(11), child INT(11))
BEGIN

SELECT @myLeft := lft FROM feeder WHERE user = mother;
INSERT INTO feeder_tree (sponsor, user) VALUES (sponsor, child);
UPDATE feeder SET rgt = rgt + 2 WHERE rgt > @myLeft;
UPDATE feeder SET lft = lft + 2 WHERE lft > @myLeft;

INSERT INTO feeder(user,lft,rgt) VALUES(child, @myLeft + 1, @myLeft + 2);

END //
DELIMITER ;

//get into the stage 1
DELIMITER //
CREATE PROCEDURE stage1in(sponsor INT(11), mother INT(11), child INT(11))
BEGIN
INSERT INTO earnings(user, amount) VALUES(child, 6000);
SELECT @myLeft := lft FROM stage1 WHERE user = mother;
INSERT INTO stage1_tree (sponsor, user) VALUES (sponsor, child);
UPDATE sttage1 SET rgt = rgt + 2 WHERE rgt > @myLeft;
UPDATE stage1 SET lft = lft + 2 WHERE lft > @myLeft;

INSERT INTO stage1(user, lft, rgt) VALUES(child, @myLeft + 1, @myLeft + 2);

END //
DELIMITER ;



//tree retrieval
SELECT node.user FROM prestarter AS node, prestarter AS parent WHERE node.lft BETWEEN parent.lft AND parent.rgt AND parent.user = 2 ORDER BY node.lft;
SELECT * FROM prestarter AS node, prestarter AS parent, prestarter_tree AS main WHERE (a IS null or b is null or c is null) AND node.lft BETWEEN parent.lft AND parent.rgt AND parent.user = 24 ORDER BY node.lft

SELECT @user := user FROM prestarter AS node, prestarter AS parent, prestarter_tree AS main WHERE (a IS null or b is null or c is null) AND node.lft BETWEEN parent.lft AND parent.rgt AND parent.user = 24 ORDER BY node.lft

SELECT parent.user, count(user) 
FROM prestarter AS node join
  prestarter AS parent
  on parent.lft < node.lft AND parent.rgt > node.rgt
GROUP BY parent.user;

SELECT @user := node.user, (COUNT(parent.user) - (sub_tree.depth + 1)) AS depth FROM prestarter AS node,
prestarter AS parent,
prestarter AS sub_parent, 
  (SELECT node.user, (COUNT(parent.user) - 1) AS depth FROM prestarter AS node, prestarter AS parent
   WHERE node.lft BETWEEN parent.lft AND parent.rgt
   AND node.user BETWEEN parent.lft AND parent.rgt
   AND node.user = @user
   GROUP BY node.user
   ORDER BY node.lft)AS sub_tree WHERE 
   node.lft BETWEEN parent.lft AND parent.rgt
   AND
   sub_parent.user = sub_tree.user
   GROUP BY node.user 
   HAVING depth <= 1
   ORDER BY node.lft;
   DELIMITER //
CREATE PROCEDURE getdepth(child INT(11))
BEGIN

SELECT node.user, (COUNT(parent.user) - (sub_tree.depth + 1)) AS depth
FROM prestarter AS node,
        prestarter AS parent,
        prestarter AS sub_parent,
        (
                SELECT node.user, (COUNT(parent.user) - 1) AS depth
                FROM prestarter AS node,
                prestarter AS parent
                WHERE node.lft BETWEEN parent.lft AND parent.rgt
                AND node.user = child
                GROUP BY node.user
                ORDER BY node.lft
        )AS sub_tree
WHERE node.lft BETWEEN parent.lft AND parent.rgt
        AND node.lft BETWEEN sub_parent.lft AND sub_parent.rgt
        AND sub_parent.user = sub_tree.user
GROUP BY node.user
HAVING depth > 0
ORDER BY node.lft;
END //
DELIMITER ;



	
							  
								
								// if a is not null
								if(first.a !== null && first.b === null){
									//inserts into the prestarter table
									db.query('INSERT INTO feeder_tree(sponsor, user) VALUES(?,?)',[id, currentUser], function(err, results, fields){
									  if (err) throw err;
									  //update into the sponsor set
									  db.query('UPDATE feeder_tree SET b = ? WHERE user = ?', [currentUser, id], function(err, results, fields){
										if (err) throw err;
										// complete the incentives section
										db.query('CALL leafadd(?,?)', [id, currentUser], function(err, results, fields){
											if (err) throw err;
											res.render('join', {title: 'Successful Entrance'});
										  });
									  });
									});	
								}
								//fix in the spillover
								if(first.a !== null && first.b !== null){
									//get the depth and user
									db.query('CALL firstspill(?)', [id], function(err, results, fields){
										if (err) throw err;
										 var depth = results[0].depth;
										 db.query( 'CALL secondspill( ? )', [id], function ( err, results, fields ){
										 var pick1 = {
										 	user: results[0].user,
										 	depth: results[0].depth,
										 	amount: results[0].amount
										 }
										 if( depth === pick1.depth ){
										 //start with a
										 pick.amount += 1;
										 //inserts into the prestarter table
									db.query('INSERT INTO feeder_tree(sponsor, user) VALUES(?,?)',[pick1.user, currentUser], function(err, results, fields){
									  if (err) throw err;
									  //update into the sponsor set
									  db.query('UPDATE feeder_tree SET b = ? WHERE user = ?', [currentUser, pick1.user], function(err, results, fields){
										if (err) throw err;
										// complete the incentives section
										db.query('CALL leafadd(?,?)', [pick1.user, currentUser], function(err, results, fields){
											if (err) throw err;
											res.render('join', {title: 'Successful Entrance'});
											});
											});
											});
										 }
										 if( depth !== pick1.depth ){
										 //get it in b
										 db.query( 'CALL secondspill( ? )', [id], function ( err, results, fields ){
										 var pick2 = {
										 	user: results[0].user,
										 	depth: results[0].depth,
										 	amount: results[0].amount
										 }
										 pick2.amount += 1;
										 //inserts into the prestarter table
									db.query('INSERT INTO feeder_tree(sponsor, user) VALUES(?,?)',[pick2.user, currentUser], function(err, results, fields){
									  if (err) throw err;
									  //update into the sponsor set
									  db.query('UPDATE feeder_tree SET b = ? WHERE user = ?', [currentUser, pick2.user], function(err, results, fields){
										if (err) throw err;
										// complete the incentives section
										db.query('CALL leafadd(?,?)', [pick2.user, currentUser], function(err, results, fields){
											if (err) throw err;
											res.render('join', {title: 'Successful Entrance'});
											});
											});
											});
										 });
										 }
										 //start the second matrix.
										 if( first.aaaa !== null && first.aaab !== null && first.aaba !== null && first.aabb !== null && first.abaa !== null && first.abab !== null && first.abba !== null && first.abbb !== null && first.baaa !== null && first.baab !== null && first.baba !== null && first.babb !== null && first.bbaa !== null && first.bbab !== null && first.bbba !== null && first.bbbb !== null ){
										//query to add 4k to the user
										db.query('INSERT INTO earnings(user, amount) VALUES(?,?)',[id, 4500], function(err, results, fields){
									  if (err) throw err;
									  //insert into the stage 1 tree
									  db.query('INSERT INTO stage1_tree(sponsor, user) VALUES(?,?)',[sponid, id], function(err, results, fields){
									if (err) throw err;
									//check if the direct sposor is null
							  db.query('SELECT * FROM stage1_tree WHERE user = ?', [sponid], function(err, results, fields){
								if (err) throw err;
								var second = {
								  a: results[0].a,
								  b: results[0].b,
								  aa: results[0].aa,
								  ab: results[0].ab,
								  ba: results[0].ba,
								  bb: results[0].bb,
								  aaa: results[0].aaa,
								  aab: results[0].aab,
								  aba: results[0].aba,
								  abb: results[0].abb,
								  baa: results[0].baa,
								  bab: results[0].bab,
								  bba: results[0].bba,
								  bbb: results[0].bbb
								 }
								 //a and b is null
								if ( second.a === null && second.b === null ){
								//get it in a
								db.query('UPDATE stage1_tree SET a = ? WHERE user = ?', [ id, sponid], function(err, results, fields){
									  if(err) throw err;
										//call the procedure for adding
										db.query('CALL secondleafadd(?,?)', [sponid, id], function(err, results, fields){
											if (err) throw err;
											res.render('join', {title: 'Successful Entrance'});
										}); 
									});
								}
								//a is not null
								if ( second.a !== null && second.b === null ){
								//get it in a
								db.query('UPDATE stage1_tree SET b = ? WHERE user = ?', [ id, sponid], function(err, results, fields){
									  if(err) throw err;
										//call the procedure for adding
										db.query('CALL secondleafadd(?,?)', [sponid, id], function(err, results, fields){
											if (err) throw err;
											res.render('join', {title: 'Successful Entrance'});
										}); 
									});
								}
								//start the spillover
								if(first.a !== null && first.b !== null){
									//get the depth and user
									db.query('CALL stage1firstspill(?)', [sponid], function(err, results, fields){
										if (err) throw err;
										 var stage1depth = results[0].depth;
										 db.query( 'CALL stage1secondspill( ? )', [sponid], function ( err, results, fields ){
										 var stage1pick1 = {
										 	user: results[0].user,
										 	depth: results[0].depth,
										 	amount: results[0].amount
										 }
										 if( stage1depth === stage1pick1.depth ){
										 //start with a
										 stage1pick1.amount += 1;
										 //inserts into the prestarter table
									db.query('INSERT INTO stage1_tree(sponsor, user) VALUES(?,?)',[stage1pick1.user, id], function(err, results, fields){
									  if (err) throw err;
									  //update into the sponsor set
									  db.query('UPDATE stage1_tree SET b = ? WHERE user = ?', [id, stage1pick1.user], function(err, results, fields){
										if (err) throw err;
										// complete the incentives section
										db.query('CALL secondleafadd(?,?)', [stage1pick1.user, id], function(err, results, fields){
											if (err) throw err;
											res.render('join', {title: 'Successful Entrance'});
											});
											});
											});
										 }
										 if( stage1depth !== stage1pick1.depth ){
										 //get it in b
										 db.query( 'CALL secondspill( ? )', [sponid], function ( err, results, fields ){
										 var stage1pick2 = {
										 	user: results[0].user,
										 	depth: results[0].depth,
										 	amount: results[0].amount
										 }
										 stage1pick2.amount += 1;
										 //inserts into the prestarter table
									db.query('INSERT INTO stage1_tree(sponsor, user) VALUES(?,?)',[stage1pick2.user, id], function(err, results, fields){
									  if (err) throw err;
									  //update into the sponsor set
									  db.query('UPDATE stage1_tree SET b = ? WHERE user = ?', [id, stage1pick2.user], function(err, results, fields){
										if (err) throw err;
										// complete the incentives section
										db.query('CALL secondleafadd(?,?)', [stage1pick2.user, id], function(err, results, fields){
											if (err) throw err;
											res.render('join', {title: 'Successful Entrance'});
											});
											});
											});
										 });
										 }
							});
									});
									  });
										 }
										 if( second.aaa !== null && second.aab !== null && second.aba !== null && second.abb !== null && second.baa !== null && second.bab !== null && second.bba !== null && second.bbb !== null){
										 //selects the user to add the money to
										 db.query( 'SELECT user, amount FROM earnings WHERE user  = ( ? )', [id], function ( err, results, fields ){
									if ( err )	 throw err;
									stage1 = {
										user: results[0].user,
										amount: results[0].amount
									}
									stage1.amount += 15000
										//query to add 4k to the user
										db.query('UPDATE earnings SET amount  = ? WHERE user = ?',[stage1.amount, id], function(err, results, fields){
									  if (err) throw err;
									  //insert into the stage 1 tree
									  db.query('INSERT INTO stage2_tree(sponsor, user) VALUES(?,?)',[sponid, id], function(err, results, fields){
									if (err) throw err;
									//check if the direct sposor is null
							  db.query('SELECT * FROM stage2_tree WHERE user = ?', [sponid], function(err, results, fields){
								if (err) throw err;
								var third = {
								  a: results[0].a,
								  b: results[0].b,
								  aa: results[0].aa,
								  ab: results[0].ab,
								  ba: results[0].ba,
								  bb: results[0].bb,
								  aaa: results[0].aaa,
								  aab: results[0].aab,
								  aba: results[0].aba,
								  abb: results[0].abb,
								  baa: results[0].baa,
								  bab: results[0].bab,
								  bba: results[0].bba,
								  bbb: results[0].bbb
								 }
								 //a and b is null
								if ( third.a === null && third.b === null ){
								//get it in a
								db.query('UPDATE stage2_tree SET a = ? WHERE user = ?', [ id, sponid], function(err, results, fields){
									  if(err) throw err;
										//call the procedure for adding
										db.query('CALL thirdleafadd(?,?)', [sponid, id], function(err, results, fields){
											if (err) throw err;
											res.render('join', {title: 'Successful Entrance'});
										}); 
									});
								}
								//a is not null
								if ( third.a !== null && third.b === null ){
								//get it in a
								db.query('UPDATE stage2_tree SET b = ? WHERE user = ?', [ id, sponid], function(err, results, fields){
									  if(err) throw err;
										//call the procedure for adding
										db.query('CALL thirdleafadd(?,?)', [sponid, id], function(err, results, fields){
											if (err) throw err;
											res.render('join', {title: 'Successful Entrance'});
										}); 
									});
								}
								//start the spillover
								if(third.a !== null && third.b !== null){
									//get the depth and user
									db.query('CALL stage2firstspill(?)', [sponid], function(err, results, fields){
										if (err) throw err;
										 var stage2depth = results[0].depth;
										 db.query( 'CALL stage2secondspill( ? )', [sponid], function ( err, results, fields ){
										 var stage2pick1 = {
										 	user: results[0].user,
										 	depth: results[0].depth,
										 	amount: results[0].amount
										 }
										 if( stage2depth === stage2pick1.depth ){
										 //start with a
										 stage2pick1.amount += 1;
										 //inserts into the prestarter table
									db.query('INSERT INTO stage2_tree(sponsor, user) VALUES(?,?)',[stage2pick1.user, id], function(err, results, fields){
									  if (err) throw err;
									  //update into the sponsor set
									  db.query('UPDATE stage2_tree SET b = ? WHERE user = ?', [id, stage2pick1.user], function(err, results, fields){
										if (err) throw err;
										// complete the incentives section
										db.query('CALL thirdleafadd(?,?)', [stage2pick1.user, id], function(err, results, fields){
											if (err) throw err;
											res.render('join', {title: 'Successful Entrance'});
											});
											});
											});
										 }
										 if( stage2depth !== stage2pick1.depth ){
										 
										 //get it in b
										 db.query( 'CALL thirdspill( ? )', [sponid], function ( err, results, fields ){
										 var stage2pick2 = {
										 	user: results[0].user,
										 	depth: results[0].depth,
										 	amount: results[0].amount
										 }
										 stage2pick2.amount += 1;
										 //inserts into the prestarter table
									db.query('INSERT INTO stage2_tree(sponsor, user) VALUES(?,?)',[stage2pick2.user, id], function(err, results, fields){
									  if (err) throw err;
									  //update into the sponsor set
									  db.query('UPDATE stage2_tree SET b = ? WHERE user = ?', [id, stage2pick2.user], function(err, results, fields){
										if (err) throw err;
										// complete the incentives section
										db.query('CALL thirdleafadd(?,?)', [stage2pick2.user, id], function(err, results, fields){
											if (err) throw err;
											res.render('join', {title: 'Successful Entrance'});
											});
											});
											});
										 });
										 }
							});
									});
									  });
										 }
										 if( third.aaa !== null && third.aab !== null && third.aba !== null && third.abb !== null && third.baa !== null && third.bab !== null && third.bba !== null && thirdd.bbb !== null){
										 //get the amount and add up
										 db.query( 'SELECT user, amount FROM earnings WHERE user  = ( ? )', [id], function ( err, results, fields ){
									if ( err )	 throw err;
									stage2 = {
										user: results[0].user,
										amount: results[0].amount
									}
									stage2.amount += 30000
										//query to add 4k to the user
										db.query('UPDATE earnings SET amount  = ? WHERE user = ?',[stage2.amount, id], function(err, results, fields){
									  if (err) throw err;
									  //insert into the stage 1 tree
									  db.query('INSERT INTO stage3_tree(sponsor, user) VALUES(?,?)',[sponid, id], function(err, results, fields){
									if (err) throw err;
									//check if the direct sposor is null
							  db.query('SELECT * FROM stage3_tree WHERE user = ?', [sponid], function(err, results, fields){
								if (err) throw err;
								var fourth = {
								  a: results[0].a,
								  b: results[0].b,
								  aa: results[0].aa,
								  ab: results[0].ab,
								  ba: results[0].ba,
								  bb: results[0].bb,
								  aaa: results[0].aaa,
								  aab: results[0].aab,
								  aba: results[0].aba,
								  abb: results[0].abb,
								  baa: results[0].baa,
								  bab: results[0].bab,
								  bba: results[0].bba,
								  bbb: results[0].bbb
								 }
								 //a and b is null
								if ( fourth.a === null && fourth.b === null ){
								//get it in a
								db.query('UPDATE stage3_tree SET a = ? WHERE user = ?', [ id, sponid], function(err, results, fields){
									  if(err) throw err;
										//call the procedure for adding
										db.query('CALL fourthleafadd(?,?)', [sponid, id], function(err, results, fields){
											if (err) throw err;
											res.render('join', {title: 'Successful Entrance'});
										}); 
									});
								}
								//a is not null
								if ( fourth.a !== null && fourth.b === null ){
								//get it in a
								db.query('UPDATE stage2_tree SET b = ? WHERE user = ?', [ id, sponid], function(err, results, fields){
									  if(err) throw err;
										//call the procedure for adding
										db.query('CALL fourthleafadd(?,?)', [sponid, id], function(err, results, fields){
											if (err) throw err;
											res.render('join', {title: 'Successful Entrance'});
										}); 
									});
								}
								//start the spillover
								if(fourth.a !== null && fourth.b !== null){
									//get the depth and user
									db.query('CALL stage3firstspill(?)', [sponid], function(err, results, fields){
										if (err) throw err;
										 var stage2depth = results[0].depth;
										 db.query( 'CALL stage3secondspill( ? )', [sponid], function ( err, results, fields ){
										 var stage3pick1 = {
										 	user: results[0].user,
										 	depth: results[0].depth,
										 	amount: results[0].amount
										 }
										 if( stage3depth === stage3pick1.depth ){
										 //start with a
										 stage3pick1.amount += 1;
										 //inserts into the prestarter table
									db.query('INSERT INTO stage3_tree(sponsor, user) VALUES(?,?)',[stage3pick1.user, id], function(err, results, fields){
									  if (err) throw err;
									  //update into the sponsor set
									  db.query('UPDATE stage3_tree SET b = ? WHERE user = ?', [id, stage3pick1.user], function(err, results, fields){
										if (err) throw err;
										// complete the incentives section
										db.query('CALL fourthleafadd(?,?)', [stage3pick1.user, id], function(err, results, fields){
											if (err) throw err;
											res.render('join', {title: 'Successful Entrance'});
											});
											});
											});
										 }
										 if( stage3depth !== stage3pick1.depth ){
										 
										 //get it in b
										 db.query( 'CALL fourthspill( ? )', [sponid], function ( err, results, fields ){
										 var stage3pick2 = {
										 	user: results[0].user,
										 	depth: results[0].depth,
										 	amount: results[0].amount
										 }
										 stage3pick2.amount += 1;
										 //inserts into the prestarter table
									db.query('INSERT INTO stage3_tree(sponsor, user) VALUES(?,?)',[stage3pick2.user, id], function(err, results, fields){
									  if (err) throw err;
									  //update into the sponsor set
									  db.query('UPDATE stage3_tree SET b = ? WHERE user = ?', [id, stage2pick2.user], function(err, results, fields){
										if (err) throw err;
										// complete the incentives section
										db.query('CALL thirdleafadd(?,?)', [stage3pick2.user, id], function(err, results, fields){
											if (err) throw err;
											res.render('join', {title: 'Successful Entrance'});
											});
											});
											});
										 });
										 }
							});
									});
									  });
										 }
										 }
							});
							});
									});
									  });
										 }
										 });
										  });
										  });
									});
								}								
							  });
							
							
							
							
							
							
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