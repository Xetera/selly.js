const axios = require("axios");

/**
 * Makes a get request that returns the json response
 *
 * The function is CURRIED to allow reusing the
 * function without having to repeat the first parameter
 *
 * You might want to change this up to make it more
 * generic so it can support more than just GET
 * @param {AxiosInstance} instance
 * @param {string} endpoint
 * @returns {AxiosResponse}
 */
const query = instance => endpoint =>
  instance.get(endpoint).then(res => res.data);

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

const productFunctions = instance => {};
const productGroupFunctions = instance => {};
const queryFunctions = instance => {};
const paymentFunctions = instance => {};

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

  // you can use reduce here to avoid this repetition
  return {
    ...couponFunctions(selly),
    ...productFunctions(selly),
    ...productGroupFunctions(selly),
    ...queryFunctions(selly)
  };
};

module.exports = { create };
