/**
 * В этом файле содержаться системные функции.
 */

/**
 * Логи на этапах создания.
 * @param message
 */
let log = console.log;

/**
 * Ошибка создания, выводит сообщение и завершает работу.
 * @param message
 */
let error = function (message) {
    console.log("Ошибка: " + message);
    process.exit();
};

/* Функционал для последовательной инициализации компонент. */
let sequencedInitStack = [];
let sequencedInitBlocked = false;

/**
 * Выполнить очередной инит по завершению всех предыдущих.
 * @param initFunction {function}
 */
let sequencedInit = function (initFunction) {
    sequencedInitStack.push(initFunction);
    tryInitNext();
};

let tryInitNext = function () {
    if (!sequencedInitStack.length) {
        log("Init stack empty now.");
        return;
    }
    if (sequencedInitBlocked) return;
    sequencedInitBlocked = true;
    initFunction = sequencedInitStack.shift();
    initFunction(function () {
        sequencedInitBlocked = false;
        tryInitNext();
    });
};

/**
 *
 *  Javascript string pad
 *  http://www.webtoolkit.info/
 *
 **/

let STR_PAD_LEFT = 1;
let STR_PAD_RIGHT = 2;
let STR_PAD_BOTH = 3;

let str_pad = function (str, len, pad, dir) {
    if (typeof (len) == "undefined") {
        let len = 0;
    }
    if (typeof (pad) == "undefined") {
        let pad = ' ';
    }
    if (typeof (dir) == "undefined") {
        let dir = STR_PAD_RIGHT;
    }
    if (len + 1 >= str.length) {

        switch (dir) {
            case STR_PAD_LEFT:
                str = Array(len + 1 - str.length).join(pad) + str;
                break;

            case STR_PAD_BOTH:
                let right = Math.ceil((padlen = len - str.length) / 2);
                let left = padlen - right;
                str = Array(left + 1).join(pad) + str + Array(right + 1).join(pad);
                break;

            default:
                str = str + Array(len + 1 - str.length).join(pad);
                break;
        } // switch
    }
    return str;
};

/**
 * Возвращает время в секундах.
 */
let time = function () {
    return LogicTimeClient.getTime();
};

/**
 * Возвращает время в миллисекундах секундах.
 */
let mtime = function () {
    return LogicTimeClient.getMicroTime();
};

let getQueryVariable = function (variable) {
    let query = window.location.search.substring(1);
    let variables = query.split("&");
    for (let i = 0; i < variables.length; i++) {
        let pair = variables[i].split("=");
        if (pair[0] === variable) {
            return pair[1];
        }
    }
    Logs.log('Query Variable ' + variable + ' not found', Logs.LEVEL_WARNING);
};

/**
 * Provides requestAnimationFrame in a cross browser way.
 * @author paulirish / http://paulirish.com/
 */

if (!window.requestAnimationFrame) {
    window.requestAnimationFrame = (function () {

        return window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            window.oRequestAnimationFrame ||
            window.msRequestAnimationFrame ||
            function ( /* function FrameRequestCallback */ callback, /* DOMElement Element */ element) {
                return window.setTimeout(callback, 1000 / 60);
            };

    })();
}

if (!window.cancelAnimationFrame) {
    window.cancelAnimationFrame =
        window.mozCancelAnimationFrame ||
        window.webkitCancelAnimationFrame ||
        window.msCancelAnimationFrame;
}

/**
 * declination() склоняет числительные по разряду единиц указанного числа
 * 'штука','штуки','штук'
 */
function declination(number, titles) {
    let cases = [2, 0, 1, 1, 1, 2];
    return titles[(number % 100 > 4 && number % 100 < 20) ? 2 : cases[(number % 10 < 5) ? number % 10 : 5]];
}