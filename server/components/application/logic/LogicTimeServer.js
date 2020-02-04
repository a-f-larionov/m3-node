LogicTimeServer = function () {

    let self = this;

    this.init = function (afterInitCallback) {
        afterInitCallback();
    };

    /**
     * Return current time.
     * @returns {number}
     */
    this.getCurrentTime = function () {
        return (new Date).getTime();
    };
};

/**
 * Константный класс.
 * @type {LogicTimeServer}
 */
LogicTimeServer = new LogicTimeServer();
