DataPoints = function () {

    let tableName = 'users_points';

    let pointsData = {};

    let fromDBToData = function (data) {
        if (!data) return data;
        if (data.userId) data.userId = parseInt(data.userId);
        if (data.pointId) data.pointId = parseInt(data.pointId);
        if (data.score) data.score = parseInt(data.score);
        return data;
    };

    pointsData[1] = {
        id: 1,
        score1: 100,
        score2: 200,
        score3: 300,
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
        score1: 100,
        score2: 200,
        score3: 300,
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
        score1: 100,
        score2: 200,
        score3: 300,
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
        score1: 100,
        score2: 200,
        score3: 300,
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
        score1: 100,
        score2: 200,
        score3: 300,
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
        score1: 100,
        score2: 200,
        score3: 300,
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
        score1: 100,
        score2: 200,
        score3: 300,
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
        score1: 100,
        score2: 200,
        score3: 300,
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
        score1: 100,
        score2: 200,
        score3: 300,
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

    this.getUsersInfo = function (mapId, userIds, callback) {
        /**
         * @TODO  only some points from mapId
         */
        DB.queryWhere(tableName, {
            pointId: [[1, 2, 3, 4, 5, 6], DB.WHERE_IN],
            userId: [userIds, DB.WHERE_EQUAL],
        }, function (rows, query) {
            for (let i in rows) {
                rows[i] = fromDBToData(rows[i]);
            }
            callback(rows || null, query);
        });

    }
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