const mailgun = require("mailgun-js");
const mg = mailgun({
  apiKey: process.env.MAILGUN_API_KEY,
  domain: process.env.MAILGUN_DOMAIN
});
const fs = require("fs");

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
          text: "Thanks for using Exdec",
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

module.exports = mail;
