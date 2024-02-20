

const FormData = require("form-data");

const Mailgun  = require("mailgun.js");
require("dotenv").config();


const mailgun = new Mailgun(FormData);
const DOMAIN = "studyspaceowner.me"
const mg = mailgun.client({username: 'api', key: process.env.MAILGUN});

const sendMail = async (email,code) => {

    console.log("works");

    const messageData = {
        from: `StudySpace <noreply@${DOMAIN}>`,
        to: email,
        subject: "Security Verification",
        text: "code = " + code
      };
      const data = await mg.messages.create(DOMAIN, messageData);
      console.log("data: " + data);
}



module.exports = {sendMail};