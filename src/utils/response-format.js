/**
 * @template T
 * @param {"success" | "fail" | "error"} status
 * @param {string} message
 * @param {T} [data]
 */
const formatResponse = (status, message, data) => ({ status, message, data });

/**
 * @template T
 * @param {string} message
 * @param {T} [data]
 * @returns {{status: 'success', message: string, data: T}}
 */
const formatSuccess = (message, data) => formatResponse("success", message, data);

/**
 * @template T
 * @param {string} message
 * @param {T} [data]
 * @returns {{status: 'fail', message: string, data: T}}
 */
const formatFail = (message, data) => formatResponse("fail", message, data);

/**
 * @template T
 * @param {string} message
 * @param {T} [data]
 * @returns {{status: 'error', message: string, data: T}}
 */
const formatError = (message, data) => formatResponse("error", message, data);

module.exports = { formatSuccess, formatFail, formatError };
