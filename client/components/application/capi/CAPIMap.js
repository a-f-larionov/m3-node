CAPIMap = function () {

    this.gotMapsInfo = function (ctnx, mapId, map, points, chests, usersInfo) {
        DataMap.setMapById(mapId, map);
        points.forEach(function (point) {
            point.field = convertFieldData(point.field);
            DataPoints.setPointData(point);
        });
        chests.forEach(function (chest) {
            DataChests.setData(chest);
        });
        usersInfo.forEach(function (info) {
            DataPoints.setUserInfo(info.userId, info.pointId, info.score);
        });
    };

    let convertFieldData = function (fieldSource) {
        let fieldResult, source, result, fieldWidth, fieldHeight;
        let convertTable = {
            'n': DataPoints.OBJECT_NONE,
            'r': DataPoints.OBJECT_RANDOM,
            'R': DataPoints.OBJECT_RED,
            'G': DataPoints.OBJECT_GREEN,
            'B': DataPoints.OBJECT_BLUE,
            'b': DataPoints.OBJECT_BLOCK
        };
        fieldResult = [];

        fieldWidth = fieldSource[0].length;
        fieldHeight = fieldSource.length;
        for (let y = 0; y < fieldHeight; y++) {
            fieldResult[y] = [];
            for (let x = 0; x < fieldWidth; x++) {
                source = fieldSource[y][x];
                result = convertTable[source];
                fieldResult[y][x] = result;
            }
        }
        return fieldResult;
    };

    this.log = function (ctnx, message, data) {
        console.log(message, data);
    };
};

CAPIMap = new CAPIMap();