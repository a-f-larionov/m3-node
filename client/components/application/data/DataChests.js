let DataChests = function () {

    let chestCoords = [
        {
            number: 1,
            x: 175,
            y: 125
        },
        {
            number: 2,
            x: 475,
            y: 225
        }
    ];

    let chests = [];

    let opened = [];

    this.getCoords = function () {
        return chestCoords;
    };

    this.getById = function (id) {
        return chests[id];
    };

    this.setData = function (data) {
        chests[data.id] = data;
        PageController.redraw();
    };

    this.setOpened = function (chestId) {
        opened[chestId] = true;
    };

    this.isItOpened = function (chestId) {
        return opened[chestId] === true;
    };
};

DataChests = new DataChests;
