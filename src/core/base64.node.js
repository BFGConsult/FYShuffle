/**
 * Encodes a string to base64 using Buffer (Node.js).
 * @param {string} str - The string to encode.
 * @returns {string}
 */
export function base64Encode(str) {
  return Buffer.from(str, 'utf8').toString('base64');
}

/**
 * Decodes a base64-encoded string using Buffer (Node.js).
 * @param {string} b64 - The base64 string to decode.
 * @returns {string}
 */
export function base64Decode(b64) {
  return Buffer.from(b64, 'base64').toString('utf8');
}
