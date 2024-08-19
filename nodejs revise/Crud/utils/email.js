const nodemailer = require('nodemailer');

const sendEmail = async (option) => {
  // CREATE A TRANSPORTER
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  // DEFINE EMAIL OPTIONS
  const emailOptions = {
    from: 'Cineflix Support <support@cineflix.com>',
    to: option.email,
    subject: option.subject,
    text: option.message,
  };

 await transporter.sendMail(emailOptions)
//   , (err, info) => {
//     if (err) {
//       console.log('Error occurred while sending email:', err);
//     } else {
//       console.log('Email sent successfully:', info.response);
//     }
//   });
};

module.exports = sendEmail;
