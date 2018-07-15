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
        let fieldResult, value, source, result;
        let convertTable = {
            'n': DataPoints.OBJECT_NONE,
            'r': DataPoints.OBJECT_RANDOM,
            'R': DataPoints.OBJECT_RED,
            'G': DataPoints.OBJECT_GREEN,
            'B': DataPoints.OBJECT_BLUE,
            'b': DataPoints.OBJECT_BLOCK
        };
        fieldResult = {};
        let randomObjects = [
            DataPoints.OBJECT_RED,
            DataPoints.OBJECT_GREEN,
            DataPoints.OBJECT_BLUE
        ];
        for (let y = 0; y < DataPoints.FIELD_MAX_HEIGHT; y++) {
            fieldResult[y] = [];
            for (let x = 0; x < DataPoints.FIELD_MAX_WIDTH; x++) {
                source = fieldSource[y][x];
                result = convertTable[source];
                if (result == DataPoints.OBJECT_RANDOM) {
                    result = randomObjects[Math.floor(Math.random() * 3)];
                }
                fieldResult[y][x] = result;
            }
        }
        return fieldResult;
    }
};

CAPIMap = new CAPIMap();