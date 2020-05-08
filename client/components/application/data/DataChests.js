/**
 * @type {DataChests}
 * @constructor
 */
let DataChests = function () {

    let chests = {};

    this.init = function () {
        chests[1] = {
            id: 1,
            prizes: [
                {id: DataObjects.STUFF_HUMMER, count: 1},
                {id: DataObjects.STUFF_LIGHTNING, count: 2},
                {id: DataObjects.STUFF_SHUFFLE, count: 3},
                {id: DataObjects.OBJECT_RED, count: 4},
            ],
        };
    };

    this.getById = function (id) {
        return chests[id];
    };
};

/** @type {DataChests} */
DataChests = new DataChests;
