const { email, key } = require("./config.json");
const { create } = require("./index.js");

// ----- test functions ------ REMOVE ON RELEASE
const instance = create(email, key);

instance.getQuery("84e1560c").then(console.log, console.log);
// ----- test functions ------
