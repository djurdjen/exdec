const express = require("express");
const router = express.Router();
const superagent = require("superagent");
const endpoint = "https://gateway.apiportal.ns.nl/reisinformatie-api/api/";
router.get("/get-stations", (req, res, next) => {
  superagent
    .get(`${endpoint}v2/stations`)
    .set("Ocp-Apim-Subscription-Key", process.env.NS_API_KEY)
    .then(data => {
      res.json(
        JSON.parse(data.text)
          .payload.filter(entry => entry.land === "NL")
          .map(entry => {
            return { name: entry.namen.lang, code: entry.code };
          })
      );
    })
    .catch(err => {
      res.status(400);
      res.send({ hasError: true, error: err });
    });
});

router.post("/trip", (req, res, next) => {
  const args = Object.keys(req.body)
    .map(key => {
      return `${key}=${req.body[key]}`;
    })
    .join("&");
  superagent
    .get(`${endpoint}v3/trips?${args}`)
    .set("Ocp-Apim-Subscription-Key", process.env.NS_API_KEY)
    .then(data => {
      res.json(JSON.parse(data.text).trips[0].productFare);
    })
    .catch(err => {
      res.status(400);
      res.send({ hasError: true, error: err });
    });
});

module.exports = router;
