/**
 * @type {DataChests}
 * @constructor
 */
let DataChests = function () {

    let chests = {};
    chests[1] = {
        id: 1,
        prized: [],
    };

    this.getById = function (id) {
        return chests[id];
    };

    this.isItOpened = function (chestId) {
        /**
         *
         */
    };
};

/** @type {DataChests} */
DataChests = new DataChests;
