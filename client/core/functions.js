/**
 * В этом файле содержаться системные функции.
 */

/**
 * Логи на этапах создания.
 * @param message
 */
var log = console.log;

/**
 * Ошибка создания, выводит сообщение и завершает работу.
 * @param message
 */
var error = function (message) {
    console.log("Ошибка: " + message);
    process.exit();
};

/* Функционал для последовательной инициализации компонент. */
var sequencedInitStack = [];
var sequencedInitBlocked = false;

/**
 * Выполнить очередной инит по завершению всех предыдущих.
 * @param initFunction {function}
 */
var sequencedInit = function (initFunction) {
    sequencedInitStack.push(initFunction);
    tryInitNext();
};

var tryInitNext = function () {
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

var STR_PAD_LEFT = 1;
var STR_PAD_RIGHT = 2;
var STR_PAD_BOTH = 3;

var str_pad = function (str, len, pad, dir) {
    if (typeof(len) == "undefined") {
        var len = 0;
    }
    if (typeof(pad) == "undefined") {
        var pad = ' ';
    }
    if (typeof(dir) == "undefined") {
        var dir = STR_PAD_RIGHT;
    }
    if (len + 1 >= str.length) {

        switch (dir) {
            case STR_PAD_LEFT:
                str = Array(len + 1 - str.length).join(pad) + str;
                break;

            case STR_PAD_BOTH:
                var right = Math.ceil((padlen = len - str.length) / 2);
                var left = padlen - right;
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
var time = function () {
    return LogicTimeClient.getTime();
};

/**
 * Возвращает время в миллисекундах секундах.
 */
var mtime = function () {
    return LogicTimeClient.getMicroTime();
};

var getQueryVariable = function (variable) {
    var query = window.location.search.substring(1);
    var vars = query.split("&");
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split("=");
        if (pair[0] === variable) {
            return pair[1];
        }
    }
    Logs.log('Query Variable ' + variable + ' not found', Logs.LEVEL_WARNING);
};