exports.sendverify = function sendverify(){
  var db = require( '../db.js' );
  var securePin = require( 'secure-pin' );
   //import the mail variable
	var verifymail = require( '../nodemailer/verification.js' );
	
	//get the stuffs to send
	db.query( 'SELECT LAST_INSERT_ID( ) FROM user', function ( err, results, fields ){
		if ( err ) throw err;
		var lastid = results[0].user_id;
		//select the variables in it
		db.query( 'SELECT username, password, email, user_id, sponsor FROM user WHERE user_id = ?', [lastid], function ( err, results, fields ){
			if ( err ) throw err;
			var veri = {
				user_id: results[0].user_id,
				username: results[0].username,
				sponsor: results[0].sponsor,
				password: results[0].password,
				email: results[0].email,
			}
			//generate code for verify mail
			securePin.generatePin(10, function(pin){
      			bcrypt.hash(pin, saltRounds, null, function(err, hash){
       			 db.query('INSERT INTO verify (code, user, status) VALUES (?, ?, ?)', [hash, lastid, 'active'], function(error, results, fields){
         				 if (error) throw error;
         				 verifymail.verifymail( email );
         			 });
         		});
         	}
		});
	});
}