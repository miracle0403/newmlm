'use strict';
const nodemailer = require('nodemailer');
//var resete = require('../nodemailer/passwordreset.js');
var verify = require('../nodemailer/verification.js');
var express = require('express');
var passport = require('passport'); 
var securePin = require('secure-pin');
var charSet = new securePin.CharSet();
charSet.addLowerCaseAlpha().addUpperCaseAlpha().addNumeric().randomize();
var router = express.Router();
var db = require('../db.js');
var expressValidator = require('express-validator');

var bcrypt = require('bcrypt');
const saltRounds = 15;

function restrict( ){
	db.query( 'SELECT user_id FROM admin WHERE user_id  = ?', [currentUser], function ( err, results, fields ){
		if( err ) throw err;
		if( results.length === 0 ){
			res.redirect( 'dashboard' )
		}
	});
}

/* GET home page. */
router.get('/', function(req, res, next) {
  console.log(req.user)
  console.log(req.isAuthenticated())
  res.render('index', { title: 'AKALINE GLOBAL SERVICES' });
});

// get join
router.get('/join', authentificationMiddleware(), function (req, res, next){
  res.render('join', {title: "JOIN MATRIX"});
});

// get password reset
router.get('/reset/:username/:email/:password/:code',  function (req, res, next){
  var username = req.params.username;
  var email = req.params.email;
  var password = req.params.password;
  var username = req.params.username;
  var code = req.params.code;
  //get username
    db.query('SELECT username FROM user WHERE username = ?', [username], function(err, results, fields){
      if (err) throw err;
      if (results.length === 0){
        res.render('nullreset', {title: 'Invalid link'});
		console.log('not a valid username');
	  }else{
		  db.query('SELECT email FROM user WHERE email = ?', [email], function(err, results, fields){
			if (err) throw err;
			if (results.length === 0){
				res.render('nullreset', {title: 'Invalid link'});
				console.log('not a valid username');
			}else{
				db.query('SELECT password FROM user WHERE password = ?', [password], function(err, results, fields){
					if (err) throw err;
					if (results.length === 0){
						res.render('nullreset', {title: 'Invalid link'});
					}else{
						db.query('SELECT code FROM reset WHERE code = ?', [code], function(err, results, fields){
							if (err) throw err;
							if (results.length === 0){
								res.render('nullreset', {title: 'Invalid link'});
							}else{
								db.query('SELECT status FROM reset WHERE code = ?', [code], function(err, results, fields){
									if (err) throw err;
									var status = results[0].status;
									
									if (status ==='expired'){
										res.render('nullreset', {title: 'Link Expired!'});
									}else{
										res.redirect('dashboard');
									}
								});
							}
						});
					}
				});
			}
		  });
	  }
	});
});

// get password verify
router.get('/verify/:username/:email/:password/:code',  function (req, res, next){
  var username = req.params.username;
  var email = req.params.email;
  var password = req.params.password;
  var username = req.params.username;
  var code = req.params.code;
  //get username
    db.query('SELECT username FROM user WHERE username = ?', [username], function(err, results, fields){
      if (err) throw err;
      if (results.length === 0){
        res.render('nullreset', {title: 'Invalid link'});
		console.log('not a valid username');
	  }else{
		  db.query('SELECT email FROM user WHERE email = ?', [email], function(err, results, fields){
			if (err) throw err;
			if (results.length === 0){
				res.render('nullreset', {title: 'Invalid link'});
				console.log('not a valid username');
			}else{
				db.query('SELECT password FROM user WHERE password = ?', [password], function(err, results, fields){
					if (err) throw err;
					if (results.length === 0){
						res.render('nullreset', {title: 'Invalid link'});
					}else{
						db.query('SELECT code FROM verify WHERE code = ?', [code], function(err, results, fields){
							if (err) throw err;
							if (results.length === 0){
								res.render('nullreset', {title: 'Invalid link'});
							}else{
								db.query('SELECT status FROM verify WHERE code = ?', [code], function(err, results, fields){
									if (err) throw err;
									var status = results[0].status;
									
									if (status ==='expired'){
										res.render('nullreset', {title: 'Link Expired!'});
									}else{
										res.redirect('changepassword');
									}
								});
							}
						});
					}
				});
			}
		  });
	  }
	});
});

// get password reset
router.get('/passwordreset',  function (req, res, next){
  res.render('passwordreset', {title: "PASSWORD RESET"});
});
// get verification
router.get('/verify',  function (req, res, next){
  res.render('verify', {title: "Verify Email"});
});


// get terms and conditions
router.get('/terms', function (req, res, next) {
  res.render('terms', {title: "TERMS AND CONDITIONS"});
});

// get fast teams
router.get('/fastteams', function (req, res, next) {
  res.render('fastteams', {title: "FASTEST TEAMS"});
});



//get register with referral link
router.get('/register/:username', function(req, res, next) {
  const db = require('../db.js');
  var username = req.params.username;
    //get the sponsor name on the registration page
    db.query('SELECT username FROM user WHERE username = ?', [username],
    function(err, results, fields){
      if (err) throw err;
      if (results.length === 0){
        res.render('register')
        console.log('not a valid sponsor name');
      }else{
        var sponsor = results[0].username;
        console.log(sponsor)
        if (sponsor){
          console.log(JSON.stringify(sponsor));
          res.render('register', { title: 'REGISTRATION', sponsor: sponsor });
        }     
      }
    });  
});

//register get request
router.get('/register', function(req, res, next) {
    res.render('register', { title: 'REGISTRATION'});
});

//get login
router.get('/login', function(req, res, next) {
  res.render('login', { title: 'LOG IN'});
});

//get referrals
router.get('/referrals', authentificationMiddleware(), function(req, res, next) {
  var currentUser = req.session.passport.user.user_id;
  //get sponsor name from database to profile page
  db.query('SELECT sponsor FROM user WHERE user_id = ?', [currentUser], function(err, results, fields){
    if (err) throw err;
    var sponsor = results[0].sponsor;
    db.query('SELECT username FROM user WHERE user_id = ?', [currentUser], function(err, results, fields){
      if (err) throw err;
      //get the referral link to home page
      //var website = "localhost:3002/";
      var user = results[0].username;
      var reg = "/register/";
      var link = user;
      var register = reg + user;
      db.query('SELECT * FROM user WHERE sponsor = ?', [user], function(err, results, fields){
        if (err) throw err;
        console.log(results)
        res.render('referrals', { title: 'Referrals', register: register, referrals: results, sponsor: sponsor, link: link});
      });
    });
  });
});
 

//get logout
router.get('/logout', function(req, res, next) {
  req.logout();
  req.session.destroy();
  res.redirect('/');
});

//get dashboard
router.get('/dashboard', authentificationMiddleware(), function(req, res, next) {
  var db = require('../db.js');
  var currentUser = req.session.passport.user.user_id;

  //get sponsor name from database to profile page
  db.query('SELECT sponsor FROM user WHERE user_id = ?', [currentUser], function(err, results, fields){
    if (err) throw err;

    var sponsor = results[0];
    if (sponsor){
      res.render('dashboard', { title: 'USER DASHBOARD', sponsor:sponsor });
    }
  });
});

//get profile
router.get('/profile', authentificationMiddleware(), function(req, res, next) {
  var currentUser = req.session.passport.user.user_id;
  //get user details to showcase
  db.query('SELECT * FROM user WHERE user_id = ?', [currentUser], function(err, results, fields){
    if (err) throw err;
    console.log(results)
    //get from profile table
    db.query('SELECT * FROM profile WHERE user_id = ?', [currentUser], function(err, results, fields){
      if (err) throw err;
      console.log(results)
      res.render('profile', {title: 'PROFILE'});
    });
  });
});


//post register
router.post('/register', function(req, res, next) {
  console.log(req.body) 
  req.checkBody('sponsor', 'Sponsor must not be empty').notEmpty();
  req.checkBody('sponsor', 'Sponsor must be between 8 to 25 characters').len(8,25);
  req.checkBody('username', 'Username must be between 8 to 25 characters').len(8,25);
  req.checkBody('fullname', 'Full Name must be between 8 to 25 characters').len(8,25);
  req.checkBody('pass1', 'Password must be between 8 to 25 characters').len(8,100);
  req.checkBody('pass2', 'Password confirmation must be between 8 to 100 characters').len(8,100);
  req.checkBody('email', 'Email must be between 8 to 105 characters').len(8,105);
  req.checkBody('email', 'Invalid Email').isEmail();
  req.checkBody('code', 'Country Code must not be empty.').notEmpty();
  req.checkBody('pass1', 'Password must match').equals(req.body.pass2);
  req.checkBody('phone', 'Phone Number must be ten characters').len(10);
  //req.checkBody('pass1', 'Password must have upper case, lower case, symbol, and number').matches(/*(?=,*\d)(?=, *[a-z])(?=, *[A-Z])(?!, [^a-zA-Z0-9]).{8,}$/, "i")
 
  var errors = req.validationErrors();

  if (errors) { 
    console.log(JSON.stringify(errors));
    res.render('register', { title: 'REGISTRATION FAILED', errors: errors});
    //return noreg
  }
  else {
    var username = req.body.username;
    var password = req.body.pass1;
    var cpass = req.body.pass2;
    var email = req.body.email;
    var fullname = req.body.fullname;
    var code = req.body.code;
    var phone = req.body.phone;
	var sponsor = req.body.sponsor;

    var db = require('../db.js');
    
    //check if sponsor is valid
    db.query('SELECT username, full_name, email FROM user WHERE username = ?', [sponsor], function(err, results, fields){
      if (err) throw err;
      if(results.length===0){
        var spone = "This Sponsor does not exist"
        console.log(sponsor);
        res.render('register', {title: "REGISTRATION FAILED", spone: sponsor});
      }else{
		  var sponmail ={
			email: results[0].email,
			name: results[0].full_name
		  }
        db.query('SELECT username FROM user WHERE username = ?', [username], function(err, results, fields){
          if (err) throw err;
          if(results.length===1){
            var error = "Sorry, this username is taken";
            console.log(error)
            res.render('register', {title: "REGISTRATION FAILED", error: error});
          }else{
            db.query('SELECT email FROM user WHERE email = ?', [email], function(err, results, fields){ 
              if (err) throw err;
              if(results.length===1){ 
                var error = "Sorry, this email is taken";
                console.log(error);
                res.render('register', {title: "REGISTRATION FAILED", email: error});
              }else{
                bcrypt.hash(password, saltRounds, function(err, hash){
                  db.query('CALL register(?, ?, ?, ?, ?, ?, ?, ?)', [sponsor, fullname, phone, code, username, email, hash, 0], function(error, result, fields){
                    if (error) throw error;
					verify.mail(email);
                    console.log(hash);
                    console.log(results); 
                    res.render('register', {title: 'SUCCESS', username: username});  
                  });
                });
              }
            });
          }
        });
      }
    });
  }
});
//Passport login
passport.serializeUser(function(user_id, done){
  done(null, user_id)
});
        
passport.deserializeUser(function(user_id, done){
  done(null, user_id)
});


//get function for pin and serial number
function pin(){
  var charSet = new securePin.CharSet();
  charSet.addLowerCaseAlpha().addUpperCaseAlpha().addNumeric().randomize();
  securePin.generatePin(16, function(pin){
    console.log("Pin: AGS"+ pin);
    securePin.generateString(16, charSet, function(str){
      console.log(str);
	  var pinn = 'AGS' + pin;
      bcrypt.hash(pinn, saltRounds, function(err, hash){
        db.query('INSERT INTO pin (pin, serial) VALUES (?, ?)', [hash, str], function(error, results, fields){
          if (error) throw error;
          //console.log(results)
        });
      });
    });
  });
}
pin(); 
//authentication middleware snippet 
function authentificationMiddleware(){
  return (req, res, next) => {
    console.log(JSON.stringify(req.session.passport));
  if (req.isAuthenticated()) return next();

  res.redirect('/login'); 
  } 
}

//post log in
router.post('/login', passport.authenticate('local', {
  failureRedirect: '/login',
  successRedirect: '/dashboard'
}));

//post profile
router.post('/profile', function(req, res, next) {
  console.log(req.body) 
  req.checkBody('fullname', 'Full Name must be between 8 to 25 characters').len(8,25);
  req.checkBody('email', 'Email must be between 8 to 25 characters').len(8,25);
  req.checkBody('email', 'Invalid Email').isEmail();
  req.checkBody('code', 'Country code must not be empty.').notEmpty();
  req.checkBody('account_number', 'Account Number must not be empty.').notEmpty();
  req.checkBody('phone', 'Phone Number must be ten characters').len(10);
  //req.checkBody('pass1', 'Password must have upper case, lower case, symbol, and number').matches(/^(?=,*\d)(?=, *[a-z])(?=, *[A-Z])(?!, [^a-zA-Z0-9]).{8,}$/, "i")
 
  var errors = req.validationErrors();

  if (errors) { 
    console.log(JSON.stringify(errors));
    res.render('profile', { title: 'UPDATE FAILED', errors: errors});

  }
  else {
    var password = req.body.password;
    var email = req.body.email;
    var fullname = req.body.fullname;
    var code = req.body.code;
    var phone = req.body.phone;
    var bank = req.body.bank;
    var accountName = req.body.AccountName;
    var accountNumber = req.body.account_number;
    var currentUser = req.session.passport.user.user_id;

    //get sponsor name from database to profile page
    db.query('SELECT password FROM user WHERE user_id = ?', [currentUser], function(err, results, fields){
      if (err) throw err;
      const hash = results[0].password;
      //compare password
      bcrypt.compare(password, hash, function(err, response){
        if(response === false){
          res.render('profile', { title: 'Profile Update failed', error: "Password is not correct"});
        }else{
          //check if email exist
          db.query('SELECT email FROM user WHERE email = ?', [email], function(err, results, fields){
            if (err) throw err;

            if (results.length===1){
              console.log('email exists')
              res.render('profile', { title: 'Profile Update failed', error: "Email exist in the database"});
            }else{
              //update user
              db.query('UPDATE user SET email = ?, full_name = ?, code = ?, phone = ? WHERE user_id = ?', [email, fullname, code, phone, currentUser], function(err, results,fields){
                if (err) throw err;

                //check if user has updated profile before now
                db.query('SELECT user_id FROM profile WHERE user_id = ?', [currentUser], function(err, results, fields){
                  if (err) throw err;
      
                  if (results.length===0){
                    db.query('INSERT INTO profile (user_id, bank, account_name, account_number) VALUES (?, ?, ?, ?)', [currentUser, bank, accountName, accountNumber], function(error, result, fields){
                      if (error) throw error;
                      console.log(results);
                      res.render('profile', {title: "UPDATE SUCCESSFUL"});  
                    });
                  }else{
                    db.query('UPDATE profile SET bank = ?, account_name = ?, account_number = ? WHERE user_id = ?', [bank, accountName, accountNumber, currentUser], function(err, results,fields){
                      if (err) throw err;
                      console.log(results);
                      res.render('profile', {title: "UPDATE SUCCESSFUL"});  
                    });
                  }
                });
              });
            }
          });
        }
      });
    });
  }
});

// post join
router.post('/join',  function (req, res, next) {
  var pin = req.body.pin;
  var serial = req.body.serial;
  var currentUser = req.session.passport.user.user_id;
  console.log(req.body);
  //console.log(currentUser)

  //get the particular serial and pin from the database
  db.query('SELECT * FROM pin WHERE serial = ?', [serial], function(err, results, fields){
    if (err) throw err;
    if(results.length === 0){
      console.log('serial does not exist');
      res.render('join', {title: 'MATRIX UNSUCCESSCUL!'})
    }else{
      const hash = results[0].pin;
      bcrypt.compare(pin, hash, function(err, response){
        if(response === false){
          console.log('the pin does not exist');
          res.render('join', {title: 'MATRIX ENTRANCE UNSUSSESSFUL!'})
        }else{
          var user_pin = results[0].user_id;
          console.log('user in the pin is' + user_pin);
          //make sure no one has used the pin before
          if(user_pin !== null){
            console.log('pin has been  used already!');
            res.render('join', {title: 'MATRIX ENTRANCE UNSUSSESSFUL!'});
          }else{
          //check if the user has joined the matrix before now
          db.query('SELECT user_id FROM pin WHERE user_id = ?', [currentUser], function(err, results, fields){
            if (err) throw err;
			//now for the normal matrix
            if(results.length === 0){
              //update the pin
              db.query('UPDATE pin SET user_id = ? WHERE serial = ?', [currentUser, serial], function(err, results,fields){
                if (err) throw err;
                console.log(results);
                //select sponsor from user
                db.query('SELECT sponsor FROM user WHERE user_id = ?', [currentUser], function(err, results, fields){
                  if (err) throw err;
                  var sponsor = results[0].sponsor;
                  console.log('sponsor name is:' + sponsor);
                  //get the sponsor id
                  db.query('SELECT user_id FROM user WHERE username = ?', [sponsor], function(err, results, fields){
                    if (err) throw err;
                    var id = results[0].user_id;
                    console.log('sponsor id is ' + id);
                       //select sponsor of the sponsor
					db.query('SELECT sponsor FROM user WHERE user_id = ?', [id], function(err, results, fields){
					  if (err) throw err;
					  var sponsorer = results[0].sponsor;
					  console.log('sponsor name is:' + sponsorer);
					  //get the sponsor id
					  db.query('SELECT user_id FROM user WHERE username = ?', [sponsorer], function(err, results, fields){
						if (err) throw err;
						var sponid = results[0].user_id;
						console.log('sponsor id is ' + sponid);
						//change user to a paid member
						db.query('UPDATE user SET paid = ? WHERE user_id = ?', ["yes", currentUser], function(err, results,fields){
						  if (err) throw err;
						  console.log(results);
						  //check if the user is already a paid member 
						  db.query('SELECT paid FROM user WHERE user_id = ?', [id], function(err, results, fields){
							if (err) throw err; 
							console.log(results)
							var paid = results[0].paid;  
							console.log('the paid value is ' + paid);
							if(paid == "yes"){
								db.query('INSERT INTO pin_entrance(user, entered_matrix) VALUES(?,?)',[currentUser, 1], function(err, results, fields){
								if (err) throw err;
								//check if the direct sposor is null
								  db.query('SELECT * FROM feeder_tree WHERE user = ?', [id], function(err, results, fields){
									if (err) throw err;
									var first = {
									  a: results[0].a,
									  b: results[0].b,
									  c: results[0].c,
									  d: results[0].d
									}
										//if a is null
									if(first.a === null && first.b === null && first.c === null && first.d === null){
									 //update into the sponsor set
									  db.query('UPDATE feeder_tree SET a = ? WHERE user = ?', [currentUser, id], function(err, results, fields){
										if(err) throw err;
										//call the procedure for adding
										db.query('CALL leafadd(?,?,?)', [id, id, currentUser], function(err, results, fields){
										  if (err) throw err;
											res.render('join', {title: 'Successful Entrance'});
										});
									  });
									}	
									//if b is null
									if(first.a !== null && first.b === null && first.c === null && first.d === null){
									 //update into the sponsor set
									  db.query('UPDATE feeder_tree SET b = ? WHERE user = ?', [currentUser, id], function(err, results, fields){
										if(err) throw err;
										//call the procedure for adding
										db.query('CALL leafadd(?,?,?)', [id, id, currentUser], function(err, results, fields){
										  if (err) throw err;
											res.render('join', {title: 'Successful Entrance'});
										});
									  });
									}
									//if c is null
									if(first.a !== null && first.b !== null && first.c === null && first.d === null){
									 //update into the sponsor set
									  db.query('UPDATE feeder_tree SET c = ? WHERE user = ?', [currentUser, id], function(err, results, fields){
										if(err) throw err;
										//call the procedure for adding
										db.query('CALL leafadd(?,?,?)', [id, id, currentUser], function(err, results, fields){
										  if (err) throw err;
											res.render('join', {title: 'Successful Entrance'});
										});
									  });
									}
									//if d is null
									if(first.a !== null && first.b !== null && first.c !== null && first.d === null){
										//call the feeder amount
									  db.query('CALL feederAmount(?)', [id], function(err, results, fields){
										if (err) throw err;
										 //update into the sponsor set
										  db.query('UPDATE feeder_tree SET d = ? WHERE user = ?', [currentUser, id], function(err, results, fields){
											if(err) throw err;
											//call the procedure for adding
											db.query('CALL leafadd(?,?)', [id, id, currentUser], function(err, results, fields){
											  if (err) throw err;
											  //add the new user to the next user
											  db.query('CALL getdepth(?)', [id], function(err, results, fields){
												if (err) throw err;
												var feederdepth = results[0].depth;
												//call the a side
												db.query('CALL getdepth1(?)', [id], function(err, results, fields){
													if (err) throw err;
													var firstspill = {
														user: results[0].user,
														depth: results[0].depth,
														amount: results[0].amount
													}
													if (firstspill.depth === feederdepth){
														//update into the sponsor set
														db.query('UPDATE feeder_tree SET a = ? WHERE user = ?', [currentUser, firstspill.user], function(err, results, fields){
															if(err) throw err;
															//call the procedure for adding
															db.query('CALL leafadd(?,?,?)', [id, firstspill.user, currentUser], function(err, results, fields){
															  if (err) throw err;
															  res.render('join', {title: 'Successful Entrance'});
															});
														});
													}
													
											  //enter the user into the next matrix
											  db.query('SELECT user FROM stage1 WHERE user = ?', [sponid], function(err, results, fields){
												  if (err) throw err;
												  if(results.length === 1){
													  db.query('SELECT * FROM stage1 WHERE user = ?', [sponid], function(err, results, fields){
														  var stage1 = {
															  a: results[0].a,
															  b: results[0].b,
															  c: results[0].c,
															  d: results[0].d,
															  aa: results[0].aa,
															  ab: results[0].ab,
															  ac: results[0].ac,
															  ad: results[0].ad,
															  ba: results[0].ba,
															  bb: results[0].bb,
															  bc: results[0].bc,
															  bd: results[0].bd,
															  ca: results[0].ca,
															  cb: results[0].cb,
															  cc: results[0].cc,
															  cd: results[0].cd,
															  da: results[0].da,
															  db: results[0].dc,
															  dc: results[0].dc,
															  dd: results[0].dd
														  }
														  // if a is null
														  if(stage1.a === null && stage1.b === null && stage1.c === null && stage1.d === null){
															  db.query('CALL stage1in(?,?,?)',[sponid, sponid, id], function(err, results, fields){
																  if (err) throw err;
																  db.query('UPDATE stage1_tree SET a = ? WHERE user = ?', [id, sponid], function (err, results, fields){
																	  if (err) throw err;
																	  res.render('join', {title: 'Successful Entrance'});
																  });
															  });
														  }
														  // if b is null
														  if(stage1.a !== null && stage1.b === null && stage1.c === null && stage1.d === null){
															  db.query('CALL stage1in(?,?,?)',[sponid, sponid, id], function(err, results, fields){
																  if (err) throw err;
																  db.query('UPDATE stage1_tree SET b = ? WHERE user = ?', [id, sponid], function (err, results, fields){
																	  if (err) throw err;
																	  res.render('join', {title: 'Successful Entrance'});
																  });
															  });
														  }
														  // if c is null
														  if(stage1.a !== null && stage1.b !== null && stage1.c === null && stage1.d === null){
															  db.query('CALL stage1in(?,?,?)',[sponid, sponid, id], function(err, results, fields){
																  if (err) throw err;
																  db.query('UPDATE stage1_tree SET c = ? WHERE user = ?', [id, sponid], function (err, results, fields){
																	  if (err) throw err;
																	  res.render('join', {title: 'Successful Entrance'});
																  });
															  });
														  }
														  // if d is null
														  if(stage1.a !== null && stage1.b !== null && stage1.c !== null && stage1.d === null){
															  db.query('CALL stage1in(?,?,?)',[sponid, sponid, id], function(err, results, fields){
																  if (err) throw err;
																  db.query('UPDATE stage1_tree SET d = ? WHERE user = ?', [id, sponid], function (err, results, fields){
																	  if (err) throw err;
																	  res.render('join', {title: 'Successful Entrance'});
																  });
															  });
														  }
														//if a or b or c or d is null.
															db.query('CALL stage1stspill (?)', [sponid], function(err, results, fields){
																if(err) throw err;
																var stage1depth = results[0].depth
																db.query('CALL stage12ndspill (?)', [sponid], function(err, results, fields){
																	if (err) throw err;
																	var secondspill = {
																		user: results[0].user,
																		depth: results[0].depth
																	}
																	//check if the user is the lowest depth.
																		
																	if(secondspill.depth === stage1depth){
																		
																		//inserts into the a of the user
																		db.query('UPDATE stage1_tree SET a = ? WHERE user = ?', [id, sponid], function (err, results, fields){
																			if (err) throw err;
																			//add procedure
																			db.query('CALL stage1in(?,?,?)',[sponid, firstspill.user, id], function(err, results, fields){
																				if (err) throw err;
																				res.render('join', {title: 'Successful Entrance'});
																			});
																		});
																	}
																	//if the a is filled
																	//check if the user is the lowest depth.
																	if(secondspill.depth !== stage1depth){
																		db.query('CALL stage13rdspill (?)', [sponid], function(err, results, fields){
																			if (err) throw err; 
																			var stage1b = {
																				user: results[0].user,
																				depth: results[0].depth
																			}
																			if(stage1b.depth === stage1depth){
																				//inserts into the a of the user
																				db.query('UPDATE stage1_tree SET b = ? WHERE user = ?', [id, sponid], function (err, results, fields){
																					if (err) throw err;
																					//add procedure
																					db.query('CALL stage1in(?,?,?)',[sponid, stage1b.user, id], function(err, results, fields){
																						if (err) throw err;
																						res.render('join', {title: 'Successful Entrance'});
																					});
																				});
																			}
																		});
																	}
																		//if the b is filled
																	//check if the user is the lowest depth.
																	if(stage1b.depth !== stage1depth){
																		db.query('CALL stage14thspill (?)', [sponid], function(err, results, fields){
																			if (err) throw err; 
																			var stage1c = {
																				user: results[0].user,
																				depth: results[0].depth
																			}
																			if(stage1c.depth === stage1depth){
																				//inserts into the a of the user
																				db.query('UPDATE stage1_tree SET c = ? WHERE user = ?', [id, sponid], function (err, results, fields){
																					if (err) throw err;
																			//add procedure
																					db.query('CALL stage1in(?,?,?)',[sponid, stage1c.user, id], function(err, results, fields){
																						if (err) throw err;
																						res.render('join', {title: 'Successful Entrance'});
																					});
																				});
																			}
																		});
																	}
																		//if the a is filled
																	//check if the user is the lowest depth.
																	if(stage1c.depth !== stage1depth){
																		db.query('CALL stage15thspill (?)', [sponid], function(err, results, fields){
																			if (err) throw err; 
																			var stage1d = {
																				user: results[0].user,
																				depth: results[0].depth
																			}
																			if(stage1d.depth === stage1.depth){
																				//inserts into the a of the user
																				db.query('UPDATE stage1_tree SET d = ? WHERE user = ?', [id, sponid], function (err, results, fields){
																					if (err) throw err;
																					//add procedure
																					db.query('CALL stage1in(?,?,?)',[sponid, stage1d.user, id], function(err, results, fields){
																						if (err) throw err;
																						res.render('join', {title: 'Successful Entrance'});
																					});
																				});
																			}
																		});
																	}
																	//if stage 1 is filled up
																	if (stage1.aa !== null && stage1.ab !== null && stage1.ac !== null && stage1.ad !== null && stage1.ba !== null && stage1.bb !== null && stage1.bc !== null && stage1.bd !== null && stage1.ca !== null && stage1.cb !== null && stage1.cc !== null && stage1.cd !== null && stage1.da !== null && stage1.db !== null && stage1.dc !== null && stage1.dd !== null){
																		db.query('CALL stage1Amount (?)', [sponid], function(err, results, fields){
																			if (err) throw err; 
																			// chech if the sponsor is in stage 2
																			db.query('SELECT * FROM stage2_tree WHERE user = ?', [id], function(err, results, fields){
																				if (err) throw err;
																				var stage2 = {
																				  a: results[0].a,
																				  b: results[0].b,
																				  c: results[0].c,
																				  d: results[0].d
																				}
																				//if a is null
																				if(stage2.a === null && stage2.b === null && stage2.c === null && stage2.d === null){
																				 //update into the sponsor set
																				  db.query('UPDATE stage2_tree SET a = ? WHERE user = ?', [id, sponid], function(err, results, fields){
																					if(err) throw err;
																					//call the procedure for adding
																					db.query('CALL stage2try(?,?,?)', [sponid, sponid, id], function(err, results, fields){
																					  if (err) throw err;
																						res.render('join', {title: 'Successful Entrance'});
																					});
																				  });
																				}
																				//if b is null
																				if(stage2.a !== null && stage2.b === null && stage2.c === null && stage2.d === null){
																				 //update into the sponsor set
																				  db.query('UPDATE stage2_tree SET b = ? WHERE user = ?', [id, sponid], function(err, results, fields){
																					if(err) throw err;
																					//call the procedure for adding
																					db.query('CALL stage2try(?,?,?)', [sponid, sponid, id], function(err, results, fields){
																					  if (err) throw err;
																						res.render('join', {title: 'Successful Entrance'});
																					});
																				  });
																				}
																				//if c is null
																				if(stage2.a !== null && stage2.b !== null && stage2.c === null && stage2.d === null){
																				 //update into the sponsor set
																				  db.query('UPDATE stage2_tree SET c = ? WHERE user = ?', [id, sponid], function(err, results, fields){
																					if(err) throw err;
																					//call the procedure for adding
																					db.query('CALL stage2try(?,?,?)', [sponid, sponid, id], function(err, results, fields){
																					  if (err) throw err;
																						res.render('join', {title: 'Successful Entrance'});
																					});
																				  });
																				}
																				//if d is null
																				if(stage2.a !== null && stage2.b !== null && stage2.c !== null && stage2.d === null){
																				 //update into the sponsor set
																				  db.query('UPDATE stage2_tree SET d = ? WHERE user = ?', [id, sponid], function(err, results, fields){
																					if(err) throw err;
																					//call the procedure for adding
																					db.query('CALL stage2try(?,?,?)', [sponid, sponid, id], function(err, results, fields){
																					  if (err) throw err;
																						db.query('CALL stage2Amount(?)', [sponid], function(err, results, fields){
																							if (err) throw err;
																							//add to stage three... first select if the sponsor is there
																							db.query('SELECT * FROM stage3_tree WHERE user = ?', [id], function(err, results, fields){
																								if (err) throw err;
																								var stage3 = {
																								  a: results[0].a,
																								  b: results[0].b,
																								  c: results[0].c,
																								  d: results[0].d
																								}
																								//add to a if a is null
																								if(stage3.a === null && stage3.b === null && stage3.c === null && stage3.d === null){
																								 //update into the sponsor set
																								  db.query('UPDATE stage3_tree SET a = ? WHERE user = ?', [id, sponid], function(err, results, fields){
																									if(err) throw err;
																									//call the procedure for adding
																									db.query('CALL stage3try(?,?,?)', [sponid, sponid, id], function(err, results, fields){
																									  if (err) throw err;
																										res.render('join', {title: 'Successful Entrance'});
																									});
																								  });
																								}
																								//add to b if a is null
																								if(stage3.a !== null && stage3.b === null && stage3.c === null && stage3.d === null){
																								 //update into the sponsor set
																								  db.query('UPDATE stage3_tree SET b = ? WHERE user = ?', [id, sponid], function(err, results, fields){
																									if(err) throw err;
																									//call the procedure for adding
																									db.query('CALL stage3try(?,?,?)', [sponid, sponid, id], function(err, results, fields){
																									  if (err) throw err;
																										res.render('join', {title: 'Successful Entrance'});
																									});
																								  });
																								}
																								//add to c if a is null
																								if(stage3.a !== null && stage3.b !== null && stage3.c === null && stage3.d === null){
																								 //update into the sponsor set
																								  db.query('UPDATE stage3_tree SET c = ? WHERE user = ?', [id, sponid], function(err, results, fields){
																									if(err) throw err;
																									//call the procedure for adding
																									db.query('CALL stage3try(?,?,?)', [sponid, sponid, id], function(err, results, fields){
																									  if (err) throw err;
																										res.render('join', {title: 'Successful Entrance'});
																									});
																								  });
																								}
																								//add to d if d is null
																								if(stage3.a !== null && stage3.b !== null && stage3.c !== null && stage3.d === null){
																								 //update into the sponsor set
																								  db.query('UPDATE stage3_tree SET d = ? WHERE user = ?', [id, sponid], function(err, results, fields){
																									if(err) throw err;
																									//call the procedure for adding
																									db.query('CALL stage3try(?,?,?)', [sponid, sponid, id], function(err, results, fields){
																									  if (err) throw err;
																										db.query('CALL stage3Amount(?)', [sponid], function(err, results, fields){
																											if (err) throw err;
																											res.render('join', {title: 'Successful Entrance'});
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
																		});
																	}
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
							  });
							}
						  });
					    }); 
                      });
                    });
                  });
                });
              });
            }
          });
		  }  
        }
      });
    }
  });
});
module.exports = router;