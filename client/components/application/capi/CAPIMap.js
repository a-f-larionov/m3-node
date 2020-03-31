CAPIMap = function () {
    let self = this;

    this.onMapInfoCallback = null;

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
        if (self.onMapInfoCallback) {
            self.onMapInfoCallback.call();
            self.onMapInfoCallback = null;
        }
    };

    /** Каллбэк после обновления данных о карте(точках и прочие) */
    this.setCallbackOnMapsInfo = function (callback) {
        self.onMapInfoCallback = callback;
    };

    this.gotUserScores = function (cntx, usersInfo) {
        usersInfo.forEach(function (info) {
            DataPoints.setPointUserScore(info.userId, info.pointId, info.score);
        });
    };

    /**
     * @param layer
     * @returns {*[]}
     * ⬍⬌⭥⭤⯐↔↕
     */
    let convertLayer = function (layer) {

        let mapping = {
            /** ??? */
            '■': DataObjects.OBJECT_BLOCK,
            'c': DataObjects.OBJECT_CELL,

            /** Layer mask */
            ' ': DataObjects.OBJECT_INVISIBLE,
            '□': DataObjects.OBJECT_VISIBLE,

            /** Layer special */
            '*': DataObjects.OBJECT_EMITTER,
            '⭤': DataObjects.OBJECT_LIGHTNING_HORIZONTAL,
            '⭥': DataObjects.OBJECT_LIGHTNING_VERTICAL,
            '⯐': DataObjects.OBJECT_LIGHTNING_CROSS,

            /** Layer gems */
            '?': DataObjects.OBJECT_RANDOM,
            'R': DataObjects.OBJECT_RED,
            'G': DataObjects.OBJECT_GREEN,
            'B': DataObjects.OBJECT_BLUE,
            'Y': DataObjects.OBJECT_YELLOW,
            'P': DataObjects.OBJECT_PURPLE,
        };

        let out;

        out = [];
        layer.forEach(function (row, y) {
            row.split('').forEach(function (ceil, x) {
                if (!out[x]) out[x] = [];
                if (!mapping[ceil]) {
                    Logs.log("error", Logs.LEVEL_DETAIL, [layer]);
                    Logs.alert(Logs.LEVEL_ERROR, 'ERROR: Нет такого символа в мепинге.' + ceil);
                }
                out[x][y] = mapping[ceil];
            });
        });
        return out;
    };
};

/** @type {CAPIMap} */
CAPIMap = new CAPIMap();