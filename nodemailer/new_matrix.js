exports.newmatrix = function mail(x){
	var nodemailer = require('nodemailer');
	var transporter = nodemailer.createTransporr({
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
		subject: 'Welcome to the Matrix',
		html: ''
	}
	transporter.sendMail(mailOptions, function(error, info)){
		if (error) {
			return console.log(error);
		}
		console.log('Message Sent' + info)
	}
}