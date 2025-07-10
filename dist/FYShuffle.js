/* FYShuffle.js — browser (UMD-style) */

function nextRand(X) {
  var a = 1103515245;
  var c = 12345;
  var m = 1 << 31;
  return (a * X + c) % m;
}
function genPerm(n, key) {
  var perm = [...Array(n).keys()];
  for (var i = 0; i < n; ++i) {
    key = nextRand(key);
    var j = (key % (n - i)) + i;
    var tmp = perm[i];
    perm[i] = perm[j];
    perm[j] = tmp;
  }
  return perm;
}

function base64Encode(str) {
  return window.btoa(str);
}
function base64Decode(str) {
  return window.atob(str);
}

function FYForward(text, key) {
  var b64 = base64Encode(text);
  b64 = b64.replace(/=+$/, '');
  var n = b64.length;
  var perm = genPerm(n, key);
  var enc = '';
  for (var i = 0; i < n; ++i) {
    enc += b64[perm[i]];
  }
  return enc;
}
function FYBackward(enc, key) {
  var n = enc.length;
  var perm = genPerm(n, key);
  var b64a = [];
  for (var i = 0; i < n; ++i) {
    b64a[perm[i]] = enc[i];
  }
  return base64Decode(b64a.join(''));
}

function mailtoClass(classId, key) {
  classId = '.' + classId;
  var elements = document.querySelectorAll(classId);
  Array.prototype.forEach.call(elements, function (element, index) {
    var target = FYBackward(element.dataset['content'], key);
    var anchor = document.createElement('a');
    var fields = [];
    var esc = encodeURIComponent;
    for (var field of ['cc', 'bcc', 'subject', 'body']) {
      if (field in element.dataset) {
        if (field[field.length - 1] == 'c') {
          for (var mail of element.dataset[field].split(',')) {
            fields.push(field + '=' + esc(mail));
          }
        } else {
          fields.push(field + '=' + esc(element.dataset[field]));
        }
      }
    }
    var query = '';
    if (fields.length > 0) {
      query = '?' + fields.shift();
      for (var f of fields) {
        query += '&' + f;
      }
    }
    anchor.href = 'mailto:' + target + query;
    anchor.text = target;
    element.parentNode.replaceChild(anchor, element);
  });
}
function unscrambleClass(classId, key) {
  classId = '.' + classId;
  var elements = document.querySelectorAll(classId);
  Array.prototype.forEach.call(elements, function (element, index) {
    var target = FYBackward(element.dataset['content'], key);
    element.insertAdjacentHTML('beforebegin', target);
    element.parentNode.removeChild(element);
  });
}
function scrambleClass(classId, key) {
  classId = '.' + classId;
  var elements = document.querySelectorAll(classId);
  Array.prototype.forEach.call(elements, function (element, index) {
    var target = FYForward(element.dataset['content'], key);
    element.insertAdjacentHTML('beforebegin', target);
    element.parentNode.removeChild(element);
  });
}
