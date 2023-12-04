/**
 * Компонент логирования.
 * @type {Logs}
 */
var Logs = function () {
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
    this.log = function (message, level, details, channel) {
        let date, dateFormated, logText, levelTitle;
        /** Если не передан уровень, то считаем его детальным. */
        if (!level) level = Logs.LEVEL_TRACE;

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
        // выведем на экран
        switch (channel) {
            default:
                switch (level) {
                    case Logs.LEVEL_ERROR:
                        console.error(" > " + logText, details);
                        break;
                    case Logs.LEVEL_WARN:
                        console.warn(" > " + logText, details);
                        break;
                    default:
                        console.log(" > " + logText, details);
                        break;
                }
                break;
        }
        if (level === Logs.LEVEL_ERROR || level === Logs.LEVEL_ERROR) {
            if (CONST_IS_CLIENT_SIDE) {
                //@todo client errors channel
                SAPILogs.log(undefined, message, level, details);
            }
        }
        // если это фатальная ошибка - завершим работу программы.

        if (level === Logs.LEVEL_ERROR) {
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
    this.LEVEL_TRACE = 1;

    /**
     * Оповещение.
     */
    this.LEVEL_DEBUG = 2;

    /**
     * Оповещение.
     */
    this.LEVEL_INFO = 3;

    /**
     * Внимание.
     */
    this.LEVEL_WARN = 4;

    /**
     * Ошибка.
     */
    this.LEVEL_ERROR = 5;


    this.alert = function (level, message) {
        if (level < trigger_level) return;
        alert(message);
    };

    let typeTitles = {};
    /** Человеко-читаемые типы логов. */
    typeTitles[this.LEVEL_TRACE] = 'd';
    typeTitles[this.LEVEL_DEBUG] = 'N';
    typeTitles[this.LEVEL_INFO] = '!';
    typeTitles[this.LEVEL_WARN] = 'w';
    typeTitles[this.LEVEL_ERROR] = 'E';
};
/**
 * Статичный класс.
 * @type {Logs}
 */
Logs = new Logs();

Logs.TYPE_VK_PAYMENTS = 1;
Logs.TYPE_VK_STUFF = 2;
Logs.TYPE_VK_HEALTH = 3;
Logs.TYPE_CLIENT_DEBUG_INFO = 4;

Logs.depends = [];