exports.passwordreset = function mail(x){
	var fs = require('fs');
    var path = require('path');
    var hbs = require('handlebars');
	var nodemailer = require('nodemailer');
	var source = fs.readFileSync(path.join(__dirname, 'emailreset.hbs'), 'utf8');
	// Create email generator
	var template = hbs.compile(source);
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
		html: template(locals)
	}
	transporter.sendMail(mailOptions, function(error, info){
		if (error) {
			return console.log(error);
		}
		console.log('Message Sent')
	});
}