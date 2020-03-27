LogicTimeServer = function () {

    this.init = function (afterInitCallback) {
        afterInitCallback();
    };

    /**
     * Return current time. (micro seconds)
     * @returns {number}
     */
    this.getMicroTime = function () {
        return (new Date).getTime();
    };

    /**
     * Return time in seconds.
     * @returns {number}
     */
    this.getTime = function () {
        return Math.floor(this.getMicroTime() / 1000);
    }
};

/**
 * Константный класс.
 * @type {LogicTimeServer}
 */
LogicTimeServer = new LogicTimeServer();
