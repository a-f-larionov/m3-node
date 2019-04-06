/**
 * Компонент логирования.
 * Клиент-серверный компонент!
 */
Logs = function () {
    var self = this;

    /**
     * Уровень срабатывания.
     * @type {number} Logs.LEVEL_*
     */
    var trigger_level = null;

    var cache = [];

    this.init = function (afterInitCallback) {
        trigger_level = Config.Logs.triggerLevel;
        for (var i = 0; i < 100; i++) {
            cache.push('--dummy--');
        }
        afterInitCallback();
    };

    this.showCache = function () {
        for (var i in cache) {
            if (cache[i] == '--dummy--') continue;
        }
    };

    /**
     * Сюда и проходят логи.
     * @param message {string} сообщение.
     * @param level {int} тип Logs.LEVEL_*.
     * @param [details] {*} необязательный параметр, детали.
     */
    this.log = function (message, level, details) {
        var date, dateFormated, logText, levelTitle;
        // если не передан уровень, то считаем его детальным.
        if (!level) {
            level = Logs.LEVEL_DETAIL;
        }
        // если уровень лога ниже уровня срабатывания ничего не делаем.
        if (level < trigger_level) return;
        // сформируем сообщение лога.
        date = new Date();
        // тут мы получим "01-01-2014 15:55:55"
        var day, month, year, hour, minutes, seconds;
        year = date.getFullYear();
        day = str_pad(date.getDate());
        month = str_pad(date.getMonth() + 1);
        hour = str_pad(date.getHours());
        minutes = str_pad(date.getMinutes());
        seconds = str_pad(date.getSeconds());
        dateFormated = day + '-' + month + '-' + year + ' ' + hour + ':' + minutes + ':' + seconds;
        // превратим в строку переданные детали лога.
        details = JSON.stringify(details);
        // превратим уровень лога из константы в человеко-читаемый текст.
        levelTitle = typeTitles[level];
        // соединим время, текст уровня лога и сообщение лога в одну строку
        logText = dateFormated + ' [' + levelTitle + '] ' + message;
        // добавим к тексту лога детали, если они были переданы
        if (details) logText += ' ' + details;
        // выведем на экран
        cache.push(logText);
        cache.shift();
        switch (level) {
            case Logs.LEVEL_WARNING:
                console.warn(" > " + logText);
                break;
            default:
                console.log(" > " + logText);
                break;
        }
        if (level === Logs.LEVEL_ERROR || level === Logs.LEVEL_FATAL_ERROR) {
            if (typeof CONST_IS_SERVER_SIDE === 'undefined') {
                SAPILogs.log(message, level, details);
            }
        }
        // если это фатальная ошибка - завершим работу программы.
        if (level === Logs.LEVEL_FATAL_ERROR) {
            self.showCache();
            throw new Error("Vse polamalos'!");
        }
    };

    /**
     * Дополним нулями значение и вернёт строку
     * Тут это специфичная функция, дополнит нулями число спереди до 2ух знаков.
     * @param sourceValue {Mixed}
     */
    var str_pad = function (sourceValue) {
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
     * Внимание.
     */
    this.LEVEL_WARNING = 3;

    /**
     * Ошибка.
     */
    this.LEVEL_ERROR = 4;

    /**
     * Фатальная ошибка.
     */
    this.LEVEL_FATAL_ERROR = 5;

    this.alert = function (level, message) {
        if (level < trigger_level) return;
        alert(message);
    };

    var typeTitles = {};
    /* человеко-читаемые типы логов. */
    typeTitles[this.LEVEL_DETAIL] = 'detail';
    typeTitles[this.LEVEL_NOTIFY] = 'NOTIFY';
    typeTitles[this.LEVEL_WARNING] = 'WARNING';
    typeTitles[this.LEVEL_ERROR] = 'ERROR';
    typeTitles[this.LEVEL_FATAL_ERROR] = 'FATAL ERROR';
};
/**
 * Статичный класс.
 * @type {Logs}
 */
Logs = new Logs();

Logs.depends = [];
