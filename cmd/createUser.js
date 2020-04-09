require("dotenv").config({ silent: true });

/* eslint-disable no-console */
const pw = "admin";
require("../services/user/actions")
  .register("admin@admin.nl", pw)
  .then(resp => {
    console.log(
      `\x1b[32mCreated user: ${resp.username} - with password: ${pw}\x1b[0m`
    );
  })
  .catch(err => {
    console.log(err);
  })
  .finally(() => {
    process.exit();
  });
