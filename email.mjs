import nodemailer from 'nodemailer'
import 'dotenv/config'

// Looking to send emails in production? Check out our Email API/SMTP product!
var transport = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const sendEmail = async (to, subject, body) => {
  await transport.sendMail({
    from: 'Game Server <a@game.com>',
    to,
    subject,
    html: body
  });
}

export default sendEmail 