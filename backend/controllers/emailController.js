const nodemailer = require("nodemailer")
const Transport = require("../emailConfig/transport")

const sendEmail = async (sent_from, send_to, reply_to = "", subject, content) => {
  const transporter = nodemailer.createTransport(new Transport({apiKey: process.env.EMAIL_API_KEY}));

  const options = {
    from: sent_from,
    to: send_to,
    replyTo: reply_to,
    subject: subject,
    html: content,
  }

  transporter.sendMail(options)
}

module.exports = {sendEmail};