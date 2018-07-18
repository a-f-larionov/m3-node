CAPIMap = function () {

    this.gotMapsInfo = function (ctnx, mapId, map, points, usersInfo) {
        DataMap.setMapById(mapId, map);
        for (let i in points) {
            points[i].field = convertFieldData(points[i].field);
            DataPoints.setPointData(points[i].id, points[i]);
        }
        for (let i in usersInfo) {
            DataPoints.setUserInfo(
                parseInt(usersInfo[i].userId),
                parseInt(usersInfo[i].pointId),
                parseInt(usersInfo[i].score)
            );
        }
    };

    let convertFieldData = function (fieldSource) {
        let fieldResult, value, source, result, fieldWidth, fieldHeight;
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
    }
};

CAPIMap = new CAPIMap();