export function base64Encode(str) {
    return window.btoa(str);
}

export function base64Decode(str) {
    return window.atob(str);
}

