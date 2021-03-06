'use strict';
const nodemailer = require('nodemailer');
//var resete = require('../nodemailer/passwordreset.js');
var verify = require('../nodemailer/verification.js');
var timer = require( '../functions/datefunctions.js' );
var express = require('express');
var passport = require('passport'); 
var securePin = require('secure-pin');
var charSet = new securePin.CharSet();
charSet.addLowerCaseAlpha().addUpperCaseAlpha().addNumeric().randomize();
var router = express.Router();
var db = require('../db.js');
var expressValidator = require('express-validator');
var  matrix = require('../functions/withsponsor.js');

var bcrypt = require('bcrypt-nodejs');
function rounds( err, results ){
	if ( err ) throw err;
}
const saltRounds = bcrypt.genSalt( 15, rounds);

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
  res.render('index', { title: 'AKAHLINE GLOBAL SERVICES' });
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
										db.query( 'UPDATE user SET verification  = ? WHERE username = ?',['yes', username], function ( err, results, fields ){
											if( err ) throw err;
											db.query( 'UPDATE verify SET status = ? WHERE username = ?',['expired', username], function ( err, results, fields ){
											if( err ) throw err;
										res.redirect('dashboard');
											});
										})	;
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

//var vtimer  = timer.timerreset( )
//setInterval( 10000, vtimer ); 
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
					var pass = results[0].password;
					//compare password
						bcrypt.compare( password, pass, null, function ( err, response ){
					
					if (response === 0){
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
										res.redirect('login');
									}
								});
							}
						});
					}
					});
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
        res.render('register', {title: 'REGISTRATION'});
        console.log('not a valid sponsor name');
       // req.flash( 'error', error.msg);
        res.render( '/register')
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
	
    res.render('register',  { title: 'REGISTRATION'});
});

//get login
router.get('/login', function(req, res, next) {
	const flashMessages = res.locals.getMessages( );
	if( flashMessages.error ){
		res.render( 'login', {
			showErrors: true,
			errors: flashMessages.error
		});
	}else{
		res.render( 'login' )
	}
	//console.log( 'flash', flashMessages);
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
  db.query( 'SELECT lft, rgt FROM user_tree WHERE user_id  = ?', [currentUser], function ( err, results, fields ){
  	if( err ) throw err;
  	if( results.length === 0){
  		db.query( 'SELECT sponsor FROM user WHERE user_id = ?', [currentUser], function ( err, results, fields ){
  			if ( err ) throw err;
  			var spo = results[0].sponsor;
  			console.log( 'spo is ' + spo);
  					db.query( 'SELECT user_id FROM user WHERE username = ?', [spo], function ( err, results, fields ){
  				if ( err ) throw err;
  				var spoid = results[0].user_id;
  				console.log( spoid);
  				db.query( 'CALL useradd ( ?,? )', [spoid, currentUser], function( err, results, fields) {
  					if ( err ) throw err;
  					res.render( 'dashboard' )
  				});
  			});
  		});
  	}
  	//if the user had been added...
  	if( results.length !== 0 ){
  		//check if the user has updated his profile
  		db.query( 'SELECT user_id FROM profile WHERE user_id = ?', [currentUser], function ( err, results, fields ){
  			if( err ) throw err;
  			if( results.length === 0 ){
  				res.redirect( 'profile' )
  			}
  			else{
  				//get the earnings
  				db.query( 'SELECT * FROM earnings WHERE user_id  = ?', [currentUser], function ( err, results, fields ){
  					if( err ) throw err;
  					if( results.length === 0 ){
  						var noearnings = 0;
  						res.render( 'dashboard', {title: 'USER DASHBOARD', noearnings: noearnings });
  										
  					}else{
  						var earnings = {
  							feeder: results[0].feeder,
  							stage1: results[0].stage1,
  							stage2: results[0].stage2,
  							stage3: results[0].stage3,
  							stage4: results[0].stage4,
  							powerbank: results[0].powerbank,
  							phone: results[0].phone,
  							laptop: results[0].laptop,
  							leadership: results[0].leadership,
  							empower: results[0].empower,
  							salary: results[0].salary
  						}
  						db.query( 'SELECT feeder FROM user_tree WHERE user_id  = ?', [currentUser], function ( err, results, fields){
  							if( err ) throw err;
  							console.log( results )
  							var feeder = results[0].feeder;
  							console.log( feeder);
  							if (feeder === null){
  								var error = 'You are not yet in the matrix... please click on join matrix to join';
  						res.render( 'dashboard', {title: 'USER DASHBOARD', error: error, salary: earnings.salary, empower: earnings.empower, leadership: earnings.leadership, laptop: earnings.laptop, phone: earnings.phone, powerbank: earnings.powerbank, stage4: earnings.stage4, stage3: earnings.stage3, stage2: earnings.stage2, stage1: earnings.stage1, feeder: earnings.feeder });		
  						}
  					  });
  					}
  				});
  			}
  		});
  	}
  });
});

//get profile
router.get('/profile', authentificationMiddleware(), function(req, res, next) {
  var currentUser = req.session.passport.user.user_id;
  //get user details to showcase
  db.query('SELECT full_name, code, phone FROM user WHERE user_id = ?', [currentUser], function(err, results, fields){
    if (err) throw err;
    console.log(results)
    var bio = {
   	 	fullname: results[0].full_name,
    	code: results[0].code,
    	phone: results[0].phone
    }
    //get from profile table
    db.query('SELECT * FROM profile WHERE user_id = ?', [currentUser], function(err, results, fields){
      if (err) throw err;
      console.log(results)
      if ( results.length === 0 ){
      		var error = "You have not updated your profile yet."
      		res.render('profile', {title: 'PROFILE', error: error,  phone: bio.phone, code: bio.code, fullname: bio.fullname});
      }else{
      		var prof = {
      		bank: results[0].bank,
      		bank: results[0].account_name,
      		bankname: results[0].account_name,
      		account_number: results[0].account_number
      }
      res.render('profile', {title: 'PROFILE', bank: prof.bank, accountname: prof.account_name, accountnumber: prof.account_number, phone: bio.phone, code: bio.code, fullname: bio.fullname});
      }
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
    
    //export variables to sen mails
  /*  exports.sponsor = sponsor;
    exports.phone = phone;
    exports.fullname = fullname;
    exports.password = password;
    exports.code = code;
    exports.email  = email;
    exports.username = username;*/
    
    //check if sponsor is valid
    db.query('SELECT username, full_name, email FROM user WHERE username = ?', [sponsor], function(err, results, fields){
      if (err) throw err;
      if(results.length===0){
        var error = "This Sponsor does not exist";
        //req.flash( 'error', error)
        console.log(error);
        res.render('register', {title: "REGISTRATION FAILED", error: error });
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
           // req.flash( 'error', error)
            res.render('register', {title: "REGISTRATION FAILED", error: error});
          }else{
            db.query('SELECT email FROM user WHERE email = ?', [email], function(err, results, fields){ 
              if (err) throw err;
              if(results.length===1){ 
                var error = "Sorry, this email is taken";
                console.log(error);
                //req.flash( 'error', error)
                res.render('register', {title: "REGISTRATION FAILED", error: error});
              }else{
              	
              		 bcrypt.hash(password, saltRounds, null, function(err, hash){
                  db.query('CALL register(?, ?, ?, ?, ?, ?, ?, ?, ?)', [sponsor, fullname, phone, code, username, email, hash, 'active', 'no'], function(err, result, fields){
                    if (err) throw err;
                    
                    		var veri = require( '../functions/mailfunctions.js' );
					   		//veri.sendverify(username);
					   			var success  = 'Your registration was successful';
                    		console.log(hash);
                   		 	console.log(results); 
                    		res.render('register', {title: 'SUCCESS', success: success});                   	            	  
              		
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
      bcrypt.hash(pinn, saltRounds, null, function(err, hash){
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
  successRedirect: '/dashboard',
  failureFlash: true
}));

//post profile
router.post('/profile', function(req, res, next) {
  console.log(req.body) 
  req.checkBody('fullname', 'Full Name must be between 8 to 25 characters').len(8,25);
  //req.checkBody('email', 'Email must be between 8 to 25 characters').len(8,25);
 // req.checkBody('email', 'Invalid Email').isEmail();
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
    //var email = req.body.email;
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
        error = "Password is not correct";
          res.render('profile', { title: 'Profile Update failed', error: error});
        }else{
              //update user
              db.query('UPDATE user SET full_name = ?, code = ?, phone = ? WHERE user_id = ?', [fullname, code, phone, currentUser], function(err, results,fields){
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
                      var success = "Profile Updated";
                      console.log(results);
                      res.render('profile', {title: "UPDATE SUCCESSFUL", success: success});  
                    });
                  }
                });
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
      var error = 'serial does not exist';
      res.render('join', {title: 'MATRIX UNSUCCESSCUL!'})
    }else{
      const hash = results[0].pin;
      bcrypt.compare(pin, hash, function(err, response){
        if(response === false){
          var error = 'the pin does not exist';
          res.render('join', {title: 'MATRIX ENTRANCE UNSUSSESSFUL!', error: error})
        }else{
          var user_pin = results[0].user_id;
          console.log('user in the pin is' + user_pin);
          //make sure no one has used the pin before
          if(user_pin !== null){
            var error = 'pin has been  used already!'
            res.render('join', {title: 'MATRIX ENTRANCE UNSUSSESSFUL!', error: error});
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
								db.query('INSERT INTO pin_entrance(user, amount) VALUES(?,?)',[currentUser, 1], function(err, results, fields){
								if (err) throw err;
								matrix.withspon()
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