CAPIMap = function () {

    this.gotMapsInfo = function (ctnx, mapId, map, points, userPoints, chests, userChests) {
        DataMap.setMapById(mapId, map);
        points.forEach(function (point) {
            point.layers.mask = convertLayer(point.layers.mask);
            point.layers.gems = convertLayer(point.layers.gems);
            point.layers.special = convertLayer(point.layers.special);
            DataPoints.setPointData(point);
        });
        chests.forEach(function (chest) {
            DataChests.setData(chest);
        });
        userPoints.forEach(function (info) {
            DataPoints.setPointUserScore(info.userId, info.pointId, info.score);
        });
        userChests.forEach(function (info) {
            DataChests.setOpened(info.chestId);
        });
    };

    this.gotUserScores = function (cntx, usersInfo) {
        usersInfo.forEach(function (info) {
            DataPoints.setPointUserScore(info.userId, info.pointId, info.score);
        });
    };

    let convertLayer = function (layer) {
        let layerMapping = {
            ' ': DataPoints.OBJECT_NONE,
            '■': DataPoints.OBJECT_BLOCK,
            '*': DataPoints.OBJECT_EMITTER,
            '□': DataPoints.OBJECT_EMPTY,
            'c': DataPoints.OBJECT_CELL,
            '?': DataPoints.OBJECT_RANDOM,
            'R': DataPoints.OBJECT_RED,
            'G': DataPoints.OBJECT_GREEN,
            'B': DataPoints.OBJECT_BLUE,
            'Y': DataPoints.OBJECT_YELLOW,
            'P': DataPoints.OBJECT_PURPLE,
        };

        let out;

        out = [];
        layer.forEach(function (row, y) {
            out[y] = [];
            row.split('').forEach(function (ceil, x) {
                if (!layerMapping[ceil]) {
                    Logs.log("error", Logs.LEVEL_DETAIL, [layer]);
                    Logs.alert(Logs.LEVEL_ERROR, 'ERROR: Нет такого символа в мепинге.' + ceil);
                }
                out[y][x] = layerMapping[ceil];
            });
        });
        return out;
    };

    this.log = function (ctnx, message, data) {
        console.log(message, data);
    };
};

CAPIMap = new CAPIMap();