LogicStuff = function () {
    let self = this;

    let stuff = {};

    this.STUFF_HUMMER = 1;
    this.STUFF_LIGHTNING = 2;
    this.STUFF_SHUFFLE = 3;

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
    };

    this.usedHummer = function () {
        stuff['hummerQty']--;
    };

    this.usedShuffle = function () {
        stuff['shuffleQty']--;
    };

    this.usedlightning = function () {
        stuff['lightningQty']--;
    };

    this.usedGold = function (quantity) {
        stuff['goldQty'] -= quantity;
    };

    this.giveAHummer = function (quantity) {
        stuff['hummerQty'] += quantity;
    };

    this.giveAShuffle = function (quantity) {
        stuff['shuffleQty'] += quantity;
    };

    this.giveALighnting = function (quantity) {
        stuff['lightningQty'] += quantity;
    };

    this.giveAGold = function (quantity) {
        stuff['goldQty'] += quantity;
    };

    this.giveAHealth = function (quantity) {
        let user;
        user = LogicUser.getCurrentUser();
        LogicHealth.decrementHealth(user, -quantity);
    };
};

/**
 * Статичный класс.
 * @type {LogicStuff}
 */
LogicStuff = new LogicStuff();
