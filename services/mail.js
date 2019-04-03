const nodemailer = require("nodemailer");
const fs = require("fs");

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
  let account = {};
  if (process.env.MAIL_ENV === "dev") {
    account = await nodemailer.createTestAccount();
  }
  // TODO: Merge this with mailgun - https://medium.com/hexient-labs/nodemailer-mailgun-4d9f18f955a9
  let transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    secure: process.env.MAIL_ENV === "dev" ? false : true, // true for 465, false for other ports
    auth: {
      user: account.user, // generated ethereal user
      pass: account.pass // generated ethereal password
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
  try {
    let info = await transporter.sendMail(mailOptions);
    console.log("Message sent: %s", info.messageId);
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    fs.unlink(`tmp/${fileName}.pdf`, err => {
      if (err) {
        console.log(err);
      }
    });
    return Promise.resolve();
  } catch (err) {
    return Promise.reject(err);
  }
};

module.exports = main;
