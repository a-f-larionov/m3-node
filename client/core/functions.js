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
    throw new Error(message);
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
    Logs.log('Query Variable ' + variable + ' not found', Logs.LEVEL_WARN);
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

let clientCrypt = function (str) {
    return str.split('')
        .map(function (s, i) {
            return String.fromCharCode(s.charCodeAt() ^ DataCross.clientCryptKey + i)
        })
        .join('');
};

let clientDecrypt = function (str) {
    return str.split('')
        .map(function (s, i) {
            return String.fromCharCode(s.charCodeAt() ^ DataCross.serverCryptKey + i)
        })
        .join('');
};

function chunkIt(arr) {
    let i, j, temparray, chunk = 1000, out = [];
    for (i = 0, j = arr.length; i < j; i += chunk) {
        temparray = arr.slice(i, i + chunk);
        if (i + chunk > j) temparray.isLast = true;
        out.push(temparray);
    }
    return out;
}

function onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
}


function tlock(key, seconds) {
    if (!seconds) seconds = 1;
    if (tlock.locks[key]) return true;
    tlock.locks[key] = true;
    setTimeout(function () {
        tlock.locks[key] = false;
    }, seconds);
};

tlock.locks = [];
tlock.STUFF_BUTTON = 1;