import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  port: 465,
  auth: {
    user: process.env.GMAIL_LOGIN,
    pass: process.env.GMAIL_PSWD,
  },
});

export default transporter;
