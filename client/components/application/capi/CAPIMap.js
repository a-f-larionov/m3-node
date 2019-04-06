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
            DataPoints.setPointUserScore(info.userId, info.pointId, info.score);
        });
    };

    let convertFieldData = function (fieldSource) {
        let fieldResult, source, result, fieldWidth, fieldHeight;
        let convertTable = {
            ' ': DataPoints.OBJECT_NONE,
            '□': DataPoints.OBJECT_EMPTY,
            '?': DataPoints.OBJECT_RANDOM,
            '■': DataPoints.OBJECT_BLOCK,
            'R': DataPoints.OBJECT_RED,
            'G': DataPoints.OBJECT_GREEN,
            'B': DataPoints.OBJECT_BLUE,
            'Y': DataPoints.OBJECT_YELLOW,
            'P': DataPoints.OBJECT_PURPLE,
        };
        fieldResult = [];

        fieldWidth = fieldSource[0].length;
        fieldHeight = fieldSource.length;
        for (let y = 0; y < fieldHeight; y++) {
            fieldResult[y] = [];
            for (let x = 0; x < fieldWidth; x++) {
                source = fieldSource[y][x];
                result = convertTable[source];
                if (source === null) {
                    Logs.log("error no field ceil", Logs.LEVEL_DETAIL, [fieldSource, source]);
                    Logs.alert(Logs.LEVEL_ERROR, 'ERROR: Одна из линий поля не соответствует длине других линий.');
                }
                if (result === undefined) {
                    Logs.log("error no field ceil", Logs.LEVEL_DETAIL, [fieldSource, source]);
                    Logs.alert(Logs.LEVEL_ERROR, 'ERROR: Нет такой ячейки.');
                }
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