function nextRand(X) {
    //glibc constants
    var a=1103515245;
    var c=12345;
    var m=1<<31;
    return (a*X+c)%m;
}

function genPerm(n, key) {
    var perm=[...Array(n).keys()];
    for (var i = 0; i < n; ++i) {
	key = nextRand(key);
	var j = key % (n - i) + i;
	
	var tmp = perm[i];
	perm[i] = perm[j];
	perm[j] = tmp;
    }
    return perm;
}

function FYBackward(enc, key) {
    var n = enc.length;
    perm = genPerm(n, key);

    var b64a = [];
    for (var i = 0; i < n; ++i) {
	b64a[ perm[i] ] = enc[i];
    }
    return window.atob(b64a.join(''));
}

function FYForward(text, key) {
    var b64 = window.btoa(text);
    b64 = b64.replace(/=+$/, "");
    var expect=Math.ceil(text.length*4/3);
    var n = b64.length;
    var perm = genPerm(n, key);
    var enc = '';
    for (var i = 0; i < n; ++i) {
	enc = enc + b64[ perm[i] ];
    }
    return enc;
}

function mailtoClass(classId, key) {
    classId='.'+classId;
    var elements = document.querySelectorAll(classId);
    Array.prototype.forEach.call(elements, function(element, index) {
	var target=FYBackward(element.dataset['content'],key);
	var anchor = document.createElement("a");
	var fields=[];
	var esc = encodeURIComponent;
	for (field of ['cc', 'bcc', 'subject', 'body']) {
	    if (field in element.dataset) {
		if (field[field.length-1]=='c') {
		    for (mail of element.dataset[field].split(',')) {
			fields.push(field+'='+esc(mail));
		    }
		}
		else {
		    fields.push(field+'='+esc(element.dataset[field]));
		}
	    }
	}
	var query='';
	if (fields.length > 0) {
	    query='?'+fields.shift();
	    for (f of fields) {
		query+='&'+f;
	    }
	}
	anchor.href='mailto:'+target+query;
	anchor.text = target;
	element.parentNode.replaceChild(anchor, element);
    });
}

function unscrambleClass(classId, key) {
    classId='.'+classId;
    var elements = document.querySelectorAll(classId);
    Array.prototype.forEach.call(elements, function(element, index) {
	var target=FYBackward(element.dataset['content'],key);
	element.insertAdjacentHTML('beforebegin', target);
	element.parentNode.removeChild(element);
    });
}

function scrambleClass(classId, key) {
    classId='.'+classId;
    var elements = document.querySelectorAll(classId);
    Array.prototype.forEach.call(elements, function(element, index) {
	var target=FYForward(element.dataset['content'],key);
	element.insertAdjacentHTML('beforebegin', target);
	element.parentNode.removeChild(element);
    });
}
