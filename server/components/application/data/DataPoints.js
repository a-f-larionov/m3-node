DataPoints = function () {

    let pointsData = {};

    pointsData[1] = {
        id: 1,
        field: [
            "bbbbb",
            "bnnnb",
            "bRGBb",
            "bnnnb",
            "bbbbb"
        ]
    };

    pointsData[2] = {
        id: 2,
        field: [
            "bnnnb",
            "bnnnb",
            "bRGBb",
            "bnnnb",
            "bbbbb"
        ]
    };

    pointsData[3] = {
        id: 3,
        field: [
            "bbbbb",
            "bnnnb",
            "bRGBb",
            "bnnnb",
            "bnnnb"
        ]
    };

    pointsData[4] = {
        id: 4,
        field: [
            "bbbbb",
            "bnnnb",
            "bRGBb",
            "bnnnb",
            "Rbbbb"
        ]
    };

    pointsData[5] = {
        id: 5,
        field: [
            "bnnnb",
            "bnnnb",
            "bRGBb",
            "bnnnb",
            "Gbbbb"
        ]
    };

    pointsData[6] = {
        id: 6,
        field: [
            "bbbbb",
            "bnnnb",
            "bRGBb",
            "bnnnb",
            "Bnnnb"
        ]
    };

    pointsData[7] = {
        id: 7,
        field: [
            "bbbbb",
            "bnnnb",
            "bRGBb",
            "bnnnb",
            "Rbbbb"
        ]
    };

    pointsData[8] = {
        id: 8,
        field: [
            "bnnnb",
            "bnnnb",
            "bRGBb",
            "bnnnb",
            "Gbbbb"
        ]
    };

    pointsData[9] = {
        id: 9,
        field: [
            "bbbbb",
            "bnnnb",
            "bRGBb",
            "bnnnb",
            "Bnnnb"
        ]
    };

    this.getById = function (id) {
        return pointsData[id];
    };

    this.getPointsByMapId = function (mapId) {
        let firstPointId, lastPointId, points;
        firstPointId = DataMap.getFirstPointId(mapId);
        lastPointId = DataMap.getLastPointId(mapId);

        points = [];
        for (let id = firstPointId; id <= lastPointId; id++) {
            points.push(this.getById(id));
        }
        return points;
    };
};

DataPoints = new DataPoints;

/**
 * Такие же констаннты должны быть и на клиенте
 * @type {number}
 */
DataPoints.OBJECT_NONE = 1;
DataPoints.OBJECT_EMPTY = 2;
DataPoints.OBJECT_RED = 3;
DataPoints.OBJECT_GREEN = 4;
DataPoints.OBJECT_BLUE = 5;
DataPoints.OBJECT_BLOCK = 6;

DataPoints.FIELD_MAX_WIDTH = 5;
DataPoints.FIELD_MAX_HEIGHT = 5;