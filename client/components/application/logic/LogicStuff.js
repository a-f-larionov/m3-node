LogicStuff = function () {
    var self = this;

    this.loadStuff = function () {
        SAPIStuff.sendMeStuff();
    }
};

/**
 * Статичный класс.
 * @type {LogicStuff}
 */
LogicStuff = new LogicStuff();
