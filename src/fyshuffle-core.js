export function nextRand(X) {
    var a = 1103515245;
    var c = 12345;
    var m = 1 << 31;
    return (a * X + c) % m;
}

export function genPerm(n, key) {
    var perm = [...Array(n).keys()];
    for (var i = 0; i < n; ++i) {
        key = nextRand(key);
        var j = key % (n - i) + i;
        var tmp = perm[i];
        perm[i] = perm[j];
        perm[j] = tmp;
    }
    return perm;
}

