require("dotenv").config({ silent: true });

/* eslint-disable no-console */
require("../services/premiumKeys/actions")
  .createKey()
  .then(hash => {
    console.log(`\x1b[32mCreated key: ${hash}\x1b[0m`);
  })
  .catch(err => {
    console.log(err);
  })
  .finally(() => {
    process.exit();
  });
