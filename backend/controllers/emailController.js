const nodemailer = require("nodemailer")
const Transport = require("../emailConfig/transport")

const sendEmail = async (sent_from, send_to, reply_to = "", subject, content) => {
  const transporter = nodemailer.createTransport(new Transport({apiKey: process.env.EMAIL_API_KEY}));

  /*
    service: 'gmail',
    auth: {
      user: 'svobodapetr803@gmail.com',
      pass: 'https://myaccount.google.com/u/0/apppasswords?rapt=AEjHL4PPHz7ZWkUfa2AQZK-rE7WvUyrTdaEcjm05WCiGAVhnwlM24h2nRbnq1oWG5dBZLNH_vJ2q5kCjjn3cLjCxPE7pDasqkw'
    }
  */
  //new Transport({apiKey: process.env.EMAIL_API_KEY})

  const options = {
    from: sent_from,
    to: send_to,
    replyTo: reply_to,
    subject: subject,
    html: content,
  }

  transporter.sendMail(options, function (err, info) {
    if (err) {
      console.log(err);
    }
  })
}

module.exports = {sendEmail};