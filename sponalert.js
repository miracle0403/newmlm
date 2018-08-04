var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'lawrencemiracle72@gmail.com',
    pass: '08061179366'
  }
});

var mailOptions = {
  from: 'lawrencemiracle72@gmail.com',
  to: {{sponmail.email}},
  subject: 'You Have A New REferral!',
  html: '<h1>HELLO {{sponmail.name}}<h1>
		<p>You have been working extremely hard and we can see it clearly! As a result of your hardwork, you added one feather to your cap!</p>
		<p>I want you to keep pressing on and growing your team and please, do not forget to tell your referrals to do the same.</p>
		<p>By the way, the details of your new referral,here it is:
		<br>
		<br>
		Name:{{fullname}}
		Email:{{email}}
		Username:{{username}}
		Phone:{{phone}}
		<br>
		<br>
		Have a nice day! Keep winning!</p>'
};
transporter.sendMail(mailOptions, function(error, info){
  if (error) {
    console.log(error);
  } else {
    console.log('Email sent: ' + info.response);
  }
});
