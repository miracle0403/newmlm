exports.verifymail = function verifymail(x){
	
    
	var nodemailer = require('nodemailer');
	
	var transporter = nodemailer.createTransport({
		host: 'server206.web-hosting.com',
		port: '26',
		secure: false,
		auth: {
			user: 'noreply@swiftcircle.website',
			pass: 'Miracle1994'
		}
	});
	var mailOptions = {
		from: 'noreply@swiftcircle',
		to: x,
		subject: 'Password Reset',
		html: 'hi'
	}
	transporter.sendMail(mailOptions, function(error, info){
		if (error) {
			return console.log(error);
		}
		console.log('Message Sent')
	});
}