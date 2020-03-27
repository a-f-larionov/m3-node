LogicStuff = function () {
    let self = this;

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
    };

    this.usedHummer = function () {
        stuff['hummerQty']--;
    };

    this.usedShuffle = function () {
        stuff['shuffleQty']--;
    };

    this.usedLighting = function () {
        stuff['lightingQty']--;
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

    this.giveALighting = function (quantity) {
        stuff['lightingQty'] += quantity;
    };

    this.giveAGold = function (quantity) {
        stuff['goldQty'] += quantity;
    };

    this.giveAHealth = function (quantity) {
        let user;
        user = LogicUser.getCurrentUser();
        LogicHealth.decrementHealth(user, -1);
    };
};

/**
 * Статичный класс.
 * @type {LogicStuff}
 */
LogicStuff = new LogicStuff();
