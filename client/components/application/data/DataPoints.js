DataPoints = function () {


    var pointsCoords = [
        {
            number: 1,
            x: 8,
            y: 402
        },
        {
            number: 2,
            x: 86,
            y: 309
        },
        {
            number: 3,
            x: 76,
            y: 207
        }
    ];


    var pointsData = [];

    this.getPointsCoords = function () {
        return pointsCoords;
    };

    this.getById = function (id) {
        return pointsData[id];
    };

    this.loadById = function (id) {
        SAPIMap.sendMePointData(id);
    };

    this.setPointData = function (id, data) {
        pointsData[id] = data;
        PageController.redraw();
    };
};

DataPoints = new DataPoints;

DataPoints.OBJECT_NONE = 1;
DataPoints.OBJECT_EMPTY = 2;
DataPoints.OBJECT_GREEN = 3;
DataPoints.OBJECT_RED = 4;
DataPoints.OBJECT_BLUE = 5;
DataPoints.OBJECT_BLOCK = 6;


DataPoints.FIELD_MAX_WIDTH = 5;
DataPoints.FIELD_MAX_HEIGHT = 5;