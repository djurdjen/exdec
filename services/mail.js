const mailgun = require("mailgun-js");
const mg = mailgun({
  apiKey: process.env.MAILGUN_API_KEY,
  domain: process.env.MAILGUN_DOMAIN
});
const fs = require("fs");

const mailErrors = err => {
  switch (err.message) {
    case "Sandbox subdomains are for test purposes only. Please add your own domain or add the address to authorized recipients in Account Settings.":
      return {
        status: 401,
        message:
          "Er kan geen e-mail verstuurd worden voor dit e-mail adres. Neem contact op met de developer voor e-mail features"
      };
    default:
      return { status: 400, message: err.message };
  }
};

const requestPassword = function({ email, url }) {
  return new Promise((resolve, reject) => {
    const data = {
      from: "Exdec <no-reply@exdec.nl>",
      to: email,
      subject: "Forgot password",
      text: `You requested a new password. If this was not you, please ignore this message!
    Follow this link to reset your password: ${url}`
    };
    mg.messages().send(data, function(error, body) {
      if (error) {
        return reject(mailErrors(error));
      }
      return resolve(body);
    });
  });
};

const mail = function(req) {
  return new Promise((resolve, reject) => {
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
        return reject(err);
      } else {
        const data = {
          from: "Exdec <no-reply@exdec.nl>",
          to: req.email,
          subject: "Your declaration",
          text: "Regards, The Exdec Team",
          attachment: fs.createReadStream(`tmp/${fileName}.pdf`)
        };
        mg.messages().send(data, function(error, body) {
          fs.unlink(`tmp/${fileName}.pdf`, err => {
            err && console.log(err);
          });
          if (error) {
            return reject(error);
          }
          return resolve(body);
        });
      }
    });
  });
};

module.exports = { mail, requestPassword };
