LogicStuff = function () {
    var self = this;

    let stuff = {};

    this.STUFF_HUMMER = 1;
    this.STUFF_LIGHTING = 2;
    this.STUFF_SHUFFLE = 3;

    this.STUFF_GOLD = 100;

    this.loadStuff = function () {
        SAPIStuff.sendMeStuff();
    };

    this.updateStuff = function (data) {
        stuff = data;
    };

    this.getStuff = function (fieldName) {
        if (fieldName) {
            if (stuff[fieldName] === undefined) {
                Logs.log("No Stuff:", Logs.LEVEL_FATAL_ERROR, [fieldName, stuff]);
            }
            return stuff[fieldName];
        }
        return stuff;
    }
};

/**
 * Статичный класс.
 * @type {LogicStuff}
 */
LogicStuff = new LogicStuff();
