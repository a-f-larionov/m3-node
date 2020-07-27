var FS;
if (CONST_IS_SERVER_SIDE) {
    FS = require('fs');
}

/**
 * Компонент логирования.
 * Клиент-серверный компонент!
 * @type {Logs}
 */
let Logs = function () {
    let self = this;

    /**
     * Уровень срабатывания.
     * @type {number} Logs.LEVEL_*
     */
    let trigger_level = null;

    this.init = function (afterInitCallback) {
        trigger_level = Config.Logs.triggerLevel;
        afterInitCallback();
    };

    /**
     * Сюда и проходят логи.
     * @param message {string} сообщение.
     * @param level {int} тип Logs.LEVEL_*.
     * @param [details] {*} необязательный параметр, детали.
     * @param channel
     */
    this.log = function (message, level, details, channel, telega) {
        let date, dateFormated, logText, levelTitle;
        /** Если не передан уровень, то считаем его детальным. */
        if (!level) level = Logs.LEVEL_DETAIL;

        /** Если уровень лога ниже уровня срабатывания ничего не делаем. */
        if (!channel && level < trigger_level) return;
        /** Сформируем сообщение лога. */
        date = new Date();
        /** Тут мы получим "01-01-2014 15:55:55" */
        let day, month, year, hour, minutes, seconds;
        //year = date.getFullYear().toString().substr(2, 2);
        day = str_pad(date.getDate());
        month = str_pad(date.getMonth() + 1);
        hour = str_pad(date.getHours());
        minutes = str_pad(date.getMinutes());
        seconds = str_pad(date.getSeconds());
        if (CONST_IS_CLIENT_SIDE) {
            dateFormated = minutes + ':' + seconds;
        } else {
            dateFormated = day + '.' + month + ' ' + hour + ':' + minutes + ':' + seconds;
        }
        // превратим уровень лога из константы в человеко-читаемый текст.
        levelTitle = typeTitles[level];
        // соединим время, текст уровня лога и сообщение лога в одну строку
        logText = dateFormated + ' [' + levelTitle + '] ' + message;
        if (!details) details = '';
        // добавим к тексту лога детали, если они были переданы
        if (CONST_IS_SERVER_SIDE) {
            // превратим в строку переданные детали лога.
            if (details) details = JSON.stringify(details);
        }
        // выведем на экран
        switch (channel) {
            default:
                switch (level) {
                    case Logs.LEVEL_ERROR:
                        console.error(" > " + logText, details);
                        break;
                    case Logs.LEVEL_WARNING:
                        console.warn(" > " + logText, details);
                        break;
                    default:
                        console.log(" > " + logText, details);
                        break;
                }
                break;
            case Logs.CHANNEL_VK_PAYMENTS:
                FS.writeFile(CONST_DIR_SERVER + '/logs/vk_payments.log', logText + details + "\r\n", {flag: 'a'}, function () {
                });
                telega = true;
                break;
            case Logs.CHANNEL_VK_STUFF:
                FS.writeFile(CONST_DIR_SERVER + '/logs/vk_stuff.log', logText + details + "\r\n", {flag: 'a'}, function () {
                });
                break;
            case Logs.CHANNEL_VK_HEALTH:
                FS.writeFile(CONST_DIR_SERVER + '/logs/vk_health.log', logText + details + "\r\n", {flag: 'a'}, function () {
                });
                break;
            case Logs.CHANNEL_CLIENT:
                FS.writeFile(CONST_DIR_SERVER + '/logs/client.log', logText + details + "\r\n", {flag: 'a'}, function () {
                });
                telega = true;
                break;
            case Logs.CHANNEL_TELEGRAM:
                telega = true;
                break;
        }
        if (level >= Logs.LEVEL_ALERT) telega = true;
        if (level === Logs.LEVEL_ERROR || level === Logs.LEVEL_FATAL_ERROR) {
            if (CONST_IS_CLIENT_SIDE) {
                //@todo client errors channel
                SAPILogs.log(message, level, details);
            }
        }
        // если это фатальная ошибка - завершим работу программы.

        if (CONST_IS_SERVER_SIDE && telega) {
            telegramSent(message + details);
        }
        if (level === Logs.LEVEL_FATAL_ERROR) {
            throw new Error("Vse polamalos'!");
        }
    };

    /**
     * Дополним нулями значение и вернёт строку
     * Тут это специфичная функция, дополнит нулями число спереди до 2ух знаков.
     * @param sourceValue {number}
     */
    let str_pad = function (sourceValue) {
        return "00000".substr(0, 2 - sourceValue.toString().length) + sourceValue;
    };

    this.setLevel = function (level) {
        trigger_level = level;
    };

    /* константы типов логов */

    /**
     * Детально.
     */
    this.LEVEL_DETAIL = 1;

    /**
     * Оповещение.
     */
    this.LEVEL_NOTIFY = 2;

    /**
     * Оповещение.
     */
    this.LEVEL_ALERT = 3;

    /**
     * Внимание.
     */
    this.LEVEL_WARNING = 4;

    /**
     * Ошибка.
     */
    this.LEVEL_ERROR = 5;

    /**
     * Фатальная ошибка.
     */
    this.LEVEL_FATAL_ERROR = 6;

    this.alert = function (level, message) {
        if (level < trigger_level) return;
        alert(message);
    };

    let typeTitles = {};
    /** Человеко-читаемые типы логов. */
    typeTitles[this.LEVEL_DETAIL] = 'd';
    typeTitles[this.LEVEL_NOTIFY] = 'N';
    typeTitles[this.LEVEL_ALERT] = '!';
    typeTitles[this.LEVEL_WARNING] = 'w';
    typeTitles[this.LEVEL_ERROR] = 'E';
    typeTitles[this.LEVEL_FATAL_ERROR] = 'FE';
};
/**
 * Статичный класс.
 * @type {Logs}
 */
Logs = new Logs();

Logs.CHANNEL_VK_PAYMENTS = 1;
Logs.CHANNEL_VK_STUFF = 2;
Logs.CHANNEL_VK_HEALTH = 3;
Logs.CHANNEL_CLIENT = 4;
Logs.CHANNEL_TELEGRAM = 5;

Logs.depends = [];

/** Для кросс-сайдных компонент */
if (CONST_IS_SERVER_SIDE) {
    global['Logs'] = Logs;
}