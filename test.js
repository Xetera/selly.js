const { email, key } = require("./config.json");
const { create } = require("./index.js");

// ----- test functions ------ REMOVE ON RELEASE
const instance = create(email, key);

instance.coupons().then(console.log);
// ----- test functions ------
