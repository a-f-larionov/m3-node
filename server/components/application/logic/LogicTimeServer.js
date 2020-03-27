LogicTimeServer = function () {

    this.init = function (afterInitCallback) {
        afterInitCallback();
    };

    /**
     * Return current time.
     * @returns {number}
     */
    this.getMicroTime = function () {
        return (new Date).getTime();
    };

    this.getTime = function () {
        Math.floor(this.getMicroTime() / 1000);
    }
};

/**
 * Константный класс.
 * @type {LogicTimeServer}
 */
LogicTimeServer = new LogicTimeServer();
