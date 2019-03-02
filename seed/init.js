require("dotenv").config({ silent: true });

const secret = require("../services/secrets");
const seedEntries = require("../services/entry/actions");
const seedUsers = require("../services/user/actions");
const bcrypt = require("bcrypt");

// fill the array param with the Promises of all the tables you want to seed

// eslint-disable-line no-console
const args =
  process.argv.reduce((ac, cur) => {
    if (cur.includes("--")) {
      return cur.replace("--", "");
    }
  }) || [];

Promise.all([
  seedEntries.createEntryTable({ force: args.includes("fresh") }),
  seedUsers.createUserTable({ force: args.includes("fresh") })
])
  .then(() => {
    console.log("\x1b[32mCreated tables!\x1b[0m");
    const pw = "admin";
    bcrypt.hash(pw, secret.saltRounds, function(err, hash) {
      // require here so the action doesn't polute the connection models
      require("../services/user/actions")
        .register("admin@admin.nl", hash)
        .then(resp => {
          console.log(
            `\x1b[32mCreated user: ${
              resp.username
            } - with password: ${pw}\x1b[0m`
          );
        })
        .catch(err => {
          console.log(err);
        })
        .finally(() => {
          process.exit();
        });
    });
  })
  .catch(err => {
    console.log(`\x1b[31m${err.original.sqlMessage}\x1b[0m`);
    process.exit();
  });
