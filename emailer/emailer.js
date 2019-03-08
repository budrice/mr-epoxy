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
        Send: send,
        SendCode: sendCode
	};

	function send(body) {

		return new Promise((resolve, reject) => {

            body.from = config.email_service_address;

			try {
				transporter.sendMail(body, (error, info) => {
					if (error) {
                        console.log(error);
						reject(error);
					} else {
						// console.log('Email sent: ' + info.response);
						resolve({ message: 'Email sent successfully.' });
					}
				});
			}
			catch (error) {
				reject(error);
            }
            
		});

    }
    
    function sendCode(email_address, reg_code) {
        let html =   '<div class="container">';
        html +=          '<div class="row" style="background: rgb(205, 205, 205);">';
        html +=              '<div class="col-xs-1"></div>';
        html +=              '<div class="col-xs-10">';
        html +=                  '<div class="row" style="margin-top: 35px;">';
        html +=                      '<img src="https://mr-epoxy.com/images/mr-epoxy-email.png" alt="mr epoxy" class="img-responsive">';
        html +=                  '</div>';
        html +=                  '<div class="row">';
        html +=                      '<h3 style="text-align: center;">moisture mitigation epoxy</h3>';
        html +=                  '</div>';
        html +=              '</div>';
        html +=              '<div class="col-xs-1"></div>';
        html +=          '</div>';
        html +=          '<div class="row" style="margin-top: 35px;">';
        html +=              '<h3>Verify your email address and begin working with Mr Epoxy.</h3>';
        html +=              '<h5>Click link to verify email.</h5>';
        html +=              'https://mr-epoxy.com/#/verify/' + reg_code;
        html +=          '</div>';
        html +=      '</div>';

        let body = {};
        body.to = email_address;
        body.subject = 'Mr-Epoxy.com verify email address';
        body.html = html;

        body.from = config.email_service_address;

        transporter.sendMail(body, (error, info) => {
            if (error) {
                console.log(error);
            } else {
                console.log('Email sent: ' + info.response);
            }
        });

    }

};

