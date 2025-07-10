import { genPerm } from './fyshuffle-core.js';
import { base64Encode, base64Decode } from './core/base64.js';

export function FYForward(text, key) {
    var b64 = base64Encode(text);
    b64 = b64.replace(/=+$/, "");
    var n = b64.length;
    var perm = genPerm(n, key);
    var enc = '';
    for (var i = 0; i < n; ++i) {
        enc += b64[perm[i]];
    }
    return enc;
}

export function FYBackward(enc, key) {
    var n = enc.length;
    var perm = genPerm(n, key);
    var b64a = [];
    for (var i = 0; i < n; ++i) {
        b64a[perm[i]] = enc[i];
    }
    return base64Decode(b64a.join(''));
}

