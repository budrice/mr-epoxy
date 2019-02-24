let nodemailer = require('nodemailer');
let config = require('./../config.json');

let transporter = nodemailer.createTransport({
	service: config.email_service,
	auth: {
		user: config.email_service_address,
		pass: config.email_service_password
	}
});

module.exports = function () {

	return {
		Send: send
	};

	function send(body) {
		return new Promise((resolve, reject) => {

            body.from = config.email_service_address;

			try {
				transporter.sendMail(body, (error, info) => {
					if (error) {
                        console.log(error);
						resolve(error);
					} else {
						console.log('Email sent: ' + info.response);
						resolve({ message: 'Email sent successfully.' });
					}
				});
			}
			catch (error) {
				reject(error);
            }
            
		});

	}

};

