const nodemailer = require("nodemailer");
const fs = require("fs");

// async..await is not allowed in global scope, must use a wrapper
const main = async function(req) {
  // strip base64 from its url data
  function decodeBase64Image(dataString) {
    var matches = dataString.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/),
      response = {};
    if (matches.length !== 3) {
      return new Error("Invalid input string");
    }
    response.type = matches[1];
    response.data = new Buffer.from(matches[2], "base64");
    return response;
  }

  const fileName = "declaration" + Math.round(new Date().getTime() / 1000);
  const imageBuffer = decodeBase64Image(req.file);
  fs.writeFile(`tmp/${fileName}.pdf`, imageBuffer.data, function(err) {
    if (err) {
      return Promise.reject(err);
    }
  });

  let account = await nodemailer.createTestAccount();
  let transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    secure: process.env.MAIL_SECURE,
    auth: {
      user:
        process.env.MAIL_ENV === "prod" ? process.env.MAIL_USER : account.user, // generated ethereal user
      pass:
        process.env.MAIL_ENV === "prod"
          ? process.env.MAIL_PASSWORD
          : account.pass // generated ethereal password
    }
  });

  // setup email data with unicode symbols
  let mailOptions = {
    from: '"Exdec" <no-reply@exdec.com>', // sender address
    to: req.email, // list of receivers
    subject: "Your declaration file", // Subject line
    text: "Thank you for using Exdec!", // plain text body
    attachments: [
      {
        // stream as an attachment
        filename: `${fileName}.pdf`,
        content: fs.createReadStream(`tmp/${fileName}.pdf`)
      }
    ]
  };

  // send mail with defined transport object
  let info = await transporter.sendMail(mailOptions);

  fs.unlink(`tmp/${fileName}.pdf`, err => {
    if (err) {
      console.log(err);
    }
  });
  console.log("Message sent: %s", info.messageId);
  // Preview only available when sending through an Ethereal account
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));

  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
  // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
};

module.exports = main;
