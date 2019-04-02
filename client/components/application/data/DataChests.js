DataChests = function () {

    var chestCoords = [
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
};

DataChests = new DataChests;
