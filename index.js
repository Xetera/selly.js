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
 */
const withBody = key => ({ data: true, key });

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
 * Creating the method that acts on the right context
 */
const createMethodHandler = (request, context) => (idOrBody, dataInput) => {
  let url, data;
  const { url: urlTemplate, key, method } = context;
  const requiresId = urlTemplate.includes(':');
  const hasId = typeof idOrBody === "string";

  if (requiresId && !hasId) {
    throw new Error(`This method requires an id but none was given.`);
  }

  if (hasId) {
    url = replacePlaceholder(urlTemplate, idOrBody);
    data = key ? { [key]: dataInput } : dataInput;
  } else {
    url = urlTemplate;
    data = idOrBody;
  }

  return request({ data, url, method, key })
};

/**
 * Passing the required context to create requests from the methods
 * @param {AxiosInstance} instance
 */
const createMethods = (instance) => Object.entries(methods).reduce((all, [functionName, options]) => ({
  ...all,
  [functionName]: createMethodHandler(query(instance), options)
}), {});


/**
 * Makes a get request that returns the json response
 *
 * The function is CURRIED to allow reusing the
 * function without having to repeat the first parameter
 */
const query = instance => (options) => instance(options)
  .then(res => res.data)
  .catch(e => {
    throw modifyError(e)
  });

const create = (email, key, options = {}) => {
  if (!email) {
    throw new Error("An email is required for selly");
  }

  if (!key) {
    throw new Error("An api key is required for selly, grab one at https://selly.gg/settings");
  }

  const authorization = encode64(`${email}:${key}`);

  const selly = axios.create({
    baseURL: "https://selly.gg/api/v2/",
    headers: {
      Authorization: `Basic ${authorization}`,
      "User-Agent": options.userAgent || "selly.js"
    }
  });

  return createMethods(selly);
};

module.exports = { create };
