const axios = require("axios");
const { encode64, replacePlaceholder } = require('./utils');

const generate = method => url => ({ method, url });

const get = generate("get");
const del = generate("delete");

/**
 * data sent along with post / put requests require
 * data to be sent with a specific key, this makes it
 * easier on the user to not have to redundantly post it
 * under the key
 * @param key
 * @return {{body: boolean, key?: string}}
 */
const withBody = key => ({ body: true, key });

const generateMutation = method => (url, opts = {}) => ({
	...generate(method)(url),
	...withBody(opts.key)
});

const post = generateMutation("post");

const put = generateMutation("put");


const methods = {
	getCoupons: get("/coupons"),
	getCoupon: get("/coupon/:id"),
	createCoupon: post("/coupons", { key: "coupon" }),
	updateCoupon: put("/coupons/:id", { key: "coupon" }),
	getOrders: get("/orders"),
	getOrder: get("/orders/:id"),
	getProducts: get("/products"),
	getProduct: get("/products/:id"),
	createProduct: post("/products", { key: "product" }),
	updateProduct: put("/products/:id", { key: "product" }),
	deleteProduct: del("/products/:id"),
	getProductGroups: get("/product_groups"),
	getProductGroup: get("/product_groups/:id"),
	getQueries: get("/queries"),
	getQuery: get("/queries/:id"),
	createPayment: post("/pay"),
	deletePayment: del("/pay/:id")
};

const modifyError = ({ response }) => ({
	error: response.statusText,
	status: response.status
});

/**
 * This could be more generic but fuck it
 * @param instance
 */
const generateQuery = instance => ({ method, url, body }) => instance({
	method,
	url,
	data: body,
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
 * @returns {function(string): Promise<AxiosResponse>}
 */
const query = instance => (options) => {
	const action = generateQuery(instance);
	return action(options)
		.then(res => res.data)
		.catch(e => {
			throw modifyError(e)
		});
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
		baseURL: "https://selly.gg/api/v2/",
		headers: {
			Authorization: `Basic ${authorization}`,
			"User-Agent": options.userAgent || "selly.js"
		}
	});


	const request = query(selly);

	return Object.entries(methods).reduce((all, [methodName, endpoint]) => {
		const method = (idOrBody, bodyInput) => {
			let url, body;
			const { method, key } = endpoint;
			const requiresId = endpoint.url.includes(':');
			const hasId = typeof idOrBody === "string";

			if (requiresId && !hasId) {
				return Promise.reject(`The method ${methodName} requires an id but none was given.`);
			}

			if (hasId) {
				url = replacePlaceholder(endpoint.url, idOrBody);
				body = endpoint.key ? { [endpoint.key]: bodyInput } : bodyInput;
			} else {
				url = endpoint.url;
				body = idOrBody;
			}

			return request({ body, url, method, key })
		};

		return {
			...all,
			[methodName]: method
		};
	}, {});
};

module.exports = { create };
