DataPoints = function () {

    let pointsData = {};

    pointsData[1] = {
        id: 1,
        field: [
            "nnnnn",
            "neeen",
            "nrgbn",
            "neeen",
            "nnnnn"
        ]
    };

    pointsData[2] = {
        id: 2,
        field: [
            "neeen",
            "neeen",
            "nrgbn",
            "neeen",
            "nnnnn"
        ]
    };

    pointsData[3] = {
        id: 3,
        field: [
            "neeen",
            "neeen",
            "nrgbn",
            "neeen",
            "neeen"
        ]
    };

    this.getPointData = function (id) {
        return pointsData[id];
    }

};

DataPoints = new DataPoints;

/**
 * Такие же констаннты должны быть и на клиенте
 * @type {number}
 */
DataPoints.OBJECT_NONE = 1;
DataPoints.OBJECT_EMPTY = 2;
DataPoints.OBJECT_GREEN = 3;
DataPoints.OBJECT_RED = 4;
DataPoints.OBJECT_BLUE = 5;
DataPoints.OBJECT_BLOCK = 6;

DataPoints.FIELD_MAX_WIDTH = 5;
DataPoints.FIELD_MAX_HEIGHT = 5;