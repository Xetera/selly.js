module.exports = {
	replacePlaceholder: (target, input) => target.replace(/:[^/]+/, input),
	/**
	 * Encodes input string in base64
	 * @param {string} input
	 */
	encode64: input => Buffer.from(input).toString("base64")
};
