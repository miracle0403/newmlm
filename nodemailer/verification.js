exports.verifymail = function mail(x){
	var nodemailer = require('nodemailer');
	var transporter = nodemailer.createTransporr({
		host: 'server206.web-hosting.com',
		port: '26',
		secure: false,
		auth
	});
}