import { FYForward, FYBackward } from './fyshuffle-crypto.js';

export function mailtoClass(classId, key) {
    classId = '.' + classId;
    var elements = document.querySelectorAll(classId);

    Array.prototype.forEach.call(elements, function (element, index) {
        var target = FYBackward(element.dataset['content'], key);
        var anchor = document.createElement("a");
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

export function unscrambleClass(classId, key) {
    classId = '.' + classId;
    var elements = document.querySelectorAll(classId);

    Array.prototype.forEach.call(elements, function (element, index) {
        var target = FYBackward(element.dataset['content'], key);
        element.insertAdjacentHTML('beforebegin', target);
        element.parentNode.removeChild(element);
    });
}

export function scrambleClass(classId, key) {
    classId = '.' + classId;
    var elements = document.querySelectorAll(classId);

    Array.prototype.forEach.call(elements, function (element, index) {
        var target = FYForward(element.dataset['content'], key);
        element.insertAdjacentHTML('beforebegin', target);
        element.parentNode.removeChild(element);
    });
}
