const axios = require("axios");
const ptre = require('path-to-regexp');

const generate = method => url => ({
	method,
	url
});

const get = generate("get");
const del = generate("delete");

const withQueryParams = params => ({
	...params
});

/**
 * data sent along with post / put requests require
 * data to be sent with a specific key, this makes it
 * easier on the user to not have to redundantly post it
 * under the key
 * @param key
 * @return {{body: boolean, key?: string}}
 */
const withBody = key => ({ body: true, key });

const generateMutation = method => (url, { key }) => ({
	...generate(method)(url),
	...withBody(key)
});

const post = generateMutation("post");

const put = generateMutation("put");


const methods = {
	getCoupons: get("/coupons"),
	getCoupon: get("/coupon/:id"),
	createCoupon: post("/coupons", { key: "coupon"}),
	updateCoupon: put("/coupons/:id", { key: "coupon" }),
	getOrders: get("/orders"),
	getOrder: get("/orders/:id"),
	getProducts: get("/products"),
	getProduct: get("/product/:id"),
	createProduct: post("/products"),
	updateProduct: put("/products", { key: "product" }),
	deleteProduct: del("/products/:id"),
	getProductGroups: get("/product_groups"),
	getProductGroup: get("/product_groups/:id"),
	getQueries: get("/queries"),
	getQuery: get("/queries/:id"),
	createPayment: post("/pay"),
	deletePayment: del("/pay/:id")
};

const modifyError = ({ response }) => ({
	error: response.data.message,
	status: response.status
});

/**
 * Makes a get request that returns the json response
 *
 * The function is CURRIED to allow reusing the
 * function without having to repeat the first parameter
 *
 * You might want to change this up to make it more
 * generic so it can support more than just GET
 * @param {AxiosInstance} instance
 * @returns {function(string): AxiosResponse}
 */
const query = instance => endpoint =>
	instance.get(endpoint)
		.then(res => res.data)
		.catch(e => {
			throw modifyError(e)
		});

/**
 * Customize this as you need, you'll need to handle errors as necessary
 */
const errors = {
	400: "Bad Request",
	401: "Unauthorized - Unable to authenticate",
	403: "Forbidden",
	404: "Not found"
};

/**
 * Encodes input string in base64
 * @param {string} input
 */
const encode64 = input => Buffer.from(input).toString("base64");

/**
 * Handler for coupon related functions
 *
 * @param {AxiosInstance} instance
 */
const couponFunctions = instance => {
	// currying the query function
	const get = query(instance);
	return {
		coupons: () => get("/coupons"),
		coupon: id => get(`/coupons/${id}`)
	};
};

const productFunctions = instance => {
};
const productGroupFunctions = instance => {
};
const queryFunctions = instance => {
};
const paymentFunctions = instance => {
};

/**
 * Creates a selly instance with all the methods
 * attached
 * @param {string} email
 * @param {string} key
 * @param {Object} [options={}] Selly options
 */
const create = (email, key, options = {}) => {
	// TODO: Check to make sure email and key aren't empty first
	const authorization = encode64(`${email}:${key}`);

	const selly = axios.create({
		baseURL: "http://selly.gg/api/v2/",
		headers: {
			Authorization: `Basic ${authorization}`,
			"User-Agent": options.userAgent || "selly.js"
		}
	});


	const get = query(selly);

	return Object.entries(endpoints).reduce((all, [key, endpoint]) => {
		const re = ptre(endpoint);

		return ({
			...all,
			[key]: (id, ...input) => get(re)
		})
	});

	// // you can use reduce here to avoid this repetition
	// return {
	// 	...couponFunctions(selly),
	// 	...productFunctions(selly),
	// 	...productGroupFunctions(selly),
	// 	...queryFunctions(selly)
	// };
};

module.exports = { create };
