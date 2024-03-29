const Kafka = require("../components/base/Kafka.js").Kafka

/**
 * Core functions
 */

/**
 * log functions
 * @param message
 */
log = console.log;

/**
 * error function
 * @param message
 */
error = function (message) {
    console.log("Ошибка: " + message);
    process.exit();
};

/* Sequenced inits */
let sequencedInitStack = [];
let sequencedInitBlocked = false;

/**
 * Add to queue and try call next
 * @param initFunction {function}
 */
sequencedInit = function (initFunction) {
    sequencedInitStack.push(initFunction);
    tryInitNext();
};

let tryInitNext = function () {
    if (!sequencedInitStack.length) {
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
 * Динициализация\остановка системы.
 */
let deInitCallbacks = [];
addDeInitCallback = function (callback) {
    deInitCallbacks.push(callback);
};

deInitBeforeShutdown = function (callback) {
    let count;
    count = 0;
    log("Deinit callbacks is raised.");
    for (let i in deInitCallbacks) {
        deInitCallbacks[i].call(null, function () {
            count++;
        });
    }
    log("De inits completed.");
    setTimeout(callback, 1235);
};

/**
 * При вызове process.exit(), выполниться каллбэки деинициализации.
 */
process.on('exit', function () {
    log("on Exit raized!");
});

/**
 * Перехыватываем ошибки!
 */
process.on('uncaughtException', function (err) {

    if (typeof Logs === 'undefined') {
        console.log(err);
    }

    if (err.code === 'ECONNRESET') {
        return Logs.log("Skip process.exit()" + JSON.stringify(err), Logs.LEVEL_TRACE);
    }
    if (err.code === 'PROTOCOL_CONNECTION_LOST') {
        return Logs.log("Skip process.exit()" + JSON.stringify(err), Logs.LEVEL_TRACE);
    }

    Logs.log("!!! ERROR HAPPENDZ !!!." + JSON.stringify(err), Logs.LEVEL_ERROR, true);
    Logs.log("!!! ERROR HAPPENDZ !!!!." + JSON.stringify(err), Logs.LEVEL_ERROR);

    log('!!! ERROR HAPPENDZ !!!!', err, Date.now());
    // process.exit();
    //@todo check self connect
});

/**
 *
 *  Javascript string pad
 *  http://www.webtoolkit.info/
 *
 **/
let STR_PAD_LEFT = 1;
let STR_PAD_RIGHT = 2;
let STR_PAD_BOTH = 3;

str_pad = function (str, len, pad, dir) {
    if (typeof (len) == "undefined") {
        len = 0;
    }
    if (typeof (pad) == "undefined") {
        pad = ' ';
    }
    if (typeof (dir) == "undefined") {
        dir = STR_PAD_RIGHT;
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
time = function () {
    return Math.floor(mtime() / 1000);
};

/**
 * Возвращает время в миллисекундах секундах.
 */
mtime = Date.now;