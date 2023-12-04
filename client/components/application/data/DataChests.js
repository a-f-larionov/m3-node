/**
 * @type {DataChests}
 * @constructor
 */
let DataChests = function () {

    let chests = {};

    this.init = function (finished) {
        /** Map-001 */
        chests[1] = {
            id: 1, prizes: [
                {id: DataObjects.STUFF_HUMMER, count: 3},
                {id: DataObjects.STUFF_LIGHTNING, count: 1},
                {id: DataObjects.STUFF_SHUFFLE, count: 1},
            ],
        };
        chests[2] = {
            id: 1, prizes: [
                {id: DataObjects.STUFF_GOLD, count: 500},
                {id: DataObjects.STUFF_HUMMER, count: 2},
            ],
        };
        chests[3] = {
            id: 1, prizes: [
                {id: DataObjects.STUFF_GOLD, count: 500},
                {id: DataObjects.STUFF_LIGHTNING, count: 3},
            ],
        };

        /** Map-002 */
        chests[4] = {
            id: 1, prizes: [
                {id: DataObjects.STUFF_HUMMER, count: 3},
                {id: DataObjects.STUFF_LIGHTNING, count: 2},
                {id: DataObjects.STUFF_SHUFFLE, count: 1},
            ],
        };
        chests[5] = {
            id: 1, prizes: [
                {id: DataObjects.STUFF_GOLD, count: 500},
                {id: DataObjects.STUFF_HUMMER, count: 3},
            ],
        };
        chests[6] = {
            id: 1, prizes: [
                {id: DataObjects.STUFF_GOLD, count: 500},
                {id: DataObjects.STUFF_LIGHTNING, count: 3},
                {id: DataObjects.STUFF_SHUFFLE, count: 1},
            ],
        };

        /** Map-003 */
        chests[7] = {
            id: 1, prizes: [
                {id: DataObjects.STUFF_HUMMER, count: 3},
                {id: DataObjects.STUFF_LIGHTNING, count: 2},
                {id: DataObjects.STUFF_SHUFFLE, count: 1},
            ],
        };
        chests[8] = {
            id: 1, prizes: [
                {id: DataObjects.STUFF_GOLD, count: 1500},
                {id: DataObjects.STUFF_SHUFFLE, count: 2},
            ],
        };
        chests[9] = {
            id: 1, prizes: [
                {id: DataObjects.STUFF_GOLD, count: 1500},
                {id: DataObjects.STUFF_HUMMER, count: 3},
            ],
        };
        if (finished) finished();
    };

    this.getById = function (id) {
        return chests[id];
    };
};

DataChests = new DataChests();

DataChests.depends = ['Logs'];