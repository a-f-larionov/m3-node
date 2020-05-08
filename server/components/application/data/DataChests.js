/**
 * @type {DataChests}
 * @constructor
 */
let DataChests = function () {

    let chests = {};

    this.init = function (finished) {
        chests[1] = {
            id: 1,
            prizes: [
                {id: DataObjects.STUFF_HUMMER, count: 1},
                {id: DataObjects.STUFF_LIGHTNING, count: 2},
                {id: DataObjects.STUFF_SHUFFLE, count: 3},
                {id: DataObjects.OBJECT_RED, count: 4},
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

/** Для кросс-сайдных компонент */
if (CONST_IS_SERVER_SIDE) {
    global['DataChests'] = DataChests;
}