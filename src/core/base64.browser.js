/**
 * Encodes a string to base64 using the browser's `btoa` function.
 *
 * @param {string} str - The input string to encode.
 * @returns {string} - The base64-encoded output.
 */
export function base64Encode(str) {
    return window.btoa(str);
}

/**
 * Decodes a base64-encoded string using the browser's `atob` function.
 *
 * @param {string} str - The base64 string to decode.
 * @returns {string} - The decoded plain string.
 */
export function base64Decode(str) {
    return window.atob(str);
}
