const { email, key } = require("./config.json");
const { create } = require("./index.js");

// ----- test functions ------ REMOVE ON RELEASE
const instance = create(email, key);

instance.updateProduct("c787ea7d", {
	title: "An more EVEN ASESOME awesome product",
}).then(console.log, console.log);
// ----- test functions ------
