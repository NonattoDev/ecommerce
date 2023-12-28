import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.dreamhost.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.GMAIL_LOGIN,
    pass: process.env.GMAIL_PSWD,
  },
});

export default transporter;
