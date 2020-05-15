LogicTimeServer = function () {

    this.init = function (afterInitCallback) {
        afterInitCallback();
    };

    /**
     * Return current time. (micro seconds)
     * @returns {number}
     */
    this.getMTime = function () {
        return Date.now();
    };

    /**
     * Return time in seconds.
     * @returns {number}
     */
    this.getTime = function () {
        return Math.floor(this.getMTime() / 1000);
    }
};

/**
 * Константный класс.
 * @type {LogicTimeServer}
 */
LogicTimeServer = new LogicTimeServer();
