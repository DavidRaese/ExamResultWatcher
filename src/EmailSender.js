const nodemailer = require("nodemailer");

class EmailSender {
  transporter;

  constructor(emailService, emailUsername, emailPassword) {
    this.emailService = emailService;
    this.emailUsername = emailUsername;
    this.emailPassword = emailPassword;
    this._initializingTransporter();
  }

  sendMail(text) {
    const messageObject = this._createMessageObject(text);
    this.transporter.sendMail(messageObject, (err, info) => {
      console.log("Sending...");
      if (err) return console.log(err);
      console.log("Sent: " + info.response);
    });
  }

  _createMessageObject(text) {
    return {
      from: "ExamResultWatcher@no-valid-email.com",
      to: this.emailUsername,
      subject: "New Exam Result is available",
      text,
    };
  }

  _initializingTransporter() {
    this.transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      auth: {
        user: this.emailUsername,
        pass: this.emailPassword,
      },
    });
  }
}

module.exports = EmailSender;
