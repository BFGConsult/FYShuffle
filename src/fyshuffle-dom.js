import { FYForward, FYBackward } from './fyshuffle-crypto.js';

/**
 * Replace obfuscated email spans with <a href="mailto:..."> links.
 * Also supports optional `data-cc`, `data-bcc`, `data-subject`, and `data-body` attributes.
 *
 * @param {string} classId - The class name of elements to target (without the dot prefix).
 * @param {number} key - The numeric scramble key used to decode email addresses.
 */
export function mailtoClass(classId, key) {
    classId = '.' + classId;
    /** @type {NodeListOf<HTMLElement>} */
    const elements = document.querySelectorAll(classId);

    Array.prototype.forEach.call(elements, function (element) {
        const target = FYBackward(element.dataset['content'], key);
        const anchor = document.createElement("a");
        const fields = [];
        const esc = encodeURIComponent;

        for (const field of ['cc', 'bcc', 'subject', 'body']) {
            if (field in element.dataset) {
                if (field[field.length - 1] === 'c') {
                    for (const mail of element.dataset[field].split(',')) {
                        fields.push(`${field}=${esc(mail)}`);
                    }
                } else {
                    fields.push(`${field}=${esc(element.dataset[field])}`);
                }
            }
        }

        let query = '';
        if (fields.length > 0) {
            query = '?' + fields.shift();
            for (const f of fields) {
                query += '&' + f;
            }
        }

        anchor.href = 'mailto:' + target + query;
        anchor.text = target;
        element.parentNode.replaceChild(anchor, element);
    });
}

/**
 * Replaces obfuscated elements with their decoded plain text content.
 *
 * @param {string} classId - The class name of elements to unscramble.
 * @param {number} key - The numeric scramble key used to decode the content.
 */
export function unscrambleClass(classId, key) {
    classId = '.' + classId;
    /** @type {NodeListOf<HTMLElement>} */
    const elements = document.querySelectorAll(classId);

    Array.prototype.forEach.call(elements, function (element) {
        const target = FYBackward(element.dataset['content'], key);
        element.insertAdjacentHTML('beforebegin', target);
        element.parentNode.removeChild(element);
    });
}

/**
 * Replaces visible text elements with scrambled strings.
 *
 * @param {string} classId - The class name of elements to scramble.
 * @param {number} key - The numeric scramble key used to encode the content.
 */
export function scrambleClass(classId, key) {
    classId = '.' + classId;
    /** @type {NodeListOf<HTMLElement>} */
    const elements = document.querySelectorAll(classId);

    Array.prototype.forEach.call(elements, function (element) {
        const target = FYForward(element.dataset['content'], key);
        element.insertAdjacentHTML('beforebegin', target);
        element.parentNode.removeChild(element);
    });
}
