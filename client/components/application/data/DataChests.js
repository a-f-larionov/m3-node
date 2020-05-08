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
            ],
        };
    };

    this.getById = function (id) {
        return chests[id];
    };
};

/** @type {DataChests} */
DataChests = new DataChests;
