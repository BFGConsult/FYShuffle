export function base64Encode(str) {
  return Buffer.from(str, 'utf8').toString('base64');
}

export function base64Decode(b64) {
  return Buffer.from(b64, 'base64').toString('utf8');
}
