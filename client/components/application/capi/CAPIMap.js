CAPIMap = function () {
    let self = this;

    this.onMapInfoCallback = null;

    this.gotMapsInfo = function (ctnx, mapId, map, points, userPoints, chests, userChests) {
        DataMap.setMapById(mapId, map);
        points.forEach(function (point) {
            point.layers.mask = convertLayer(point.layers.mask);
            point.layers.gems = convertLayer(point.layers.gems);
            if (typeof point.layers.special[0] === 'string') {
                point.layers.special = [point.layers.special];
            }
            for (let z = 0; z < point.layers.special.length; z++)
                point.layers.special[z] = convertLayer(point.layers.special[z]);
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
     * ⬍⬌⭥⭤⯐↔↕       ʘ¤ïĦȪ ȫ ȯ ɷ ɵ ʆ ʭ ʬ ʚ ░▒▓∏∩≡▀ ϔ∎
     *
     * https://pixelplus.ru/samostoyatelno/stati/vnutrennie-faktory/tablica-simvolov-unicode.html
     * обозначения:
     * RGBPY - камни цветные
     * ⯐↔↕ - молния, вертикальная, горизонтальная, кросовая
     *
     * ȫ - рыба
     * ᴥ - осминог
     * ᥩ - бочка
     * ɨ - лёд
     * $ - драгоценности
     * ■ - ящик
     * Z - цепи
     * Ż - цепи на ящик
     * ᨔ - многоцветный камень
     *
     *
     * китайский:
     * 冰 - лёд
     * 桶 - бочка
     *
     * 洞  - дырка
     * 红 - красный
     * 绿 - зеленый
     * 蓝 - голубой
     * 紫 - фиолетовый
     * 黄 - желтый
     *
     */
    let convertLayer = function (layer) {

        let mapping = {
            /** Layer mask */
            '□': DataObjects.CELL_VISIBLE,
            ' ': DataObjects.CELL_INVISIBLE,

            /** Layer gems */
            '?': DataObjects.OBJECT_RANDOM,
            'H': DataObjects.OBJECT_HOLE,

            'R': DataObjects.OBJECT_RED,
            'G': DataObjects.OBJECT_GREEN,
            'B': DataObjects.OBJECT_BLUE,
            'Y': DataObjects.OBJECT_YELLOW,
            'P': DataObjects.OBJECT_PURPLE,

            'ᨔ' : DataObjects.OBJECT_POLY_COLOR,
            'ᥩ' : DataObjects.OBJECT_BARREL,
            'ȫ' : DataObjects.OBJECT_RED_SPIDER,


            'ᴥ' : DataObjects.OBJECT_GREEN_SPIDER,
            'ɨ' : DataObjects.OBJECT_ICE,
            '$' : DataObjects.OBJECT_TREASURES,
            '■' : DataObjects.OBJECT_BOX,
            'Z' : DataObjects.OBJECT_CHAIN,

            '⭤': DataObjects.WITH_LIGHTNING_HORIZONTAL,
            '⭥': DataObjects.WITH_LIGHTNING_VERTICAL,
            '+': DataObjects.WITH_LIGHTNING_CROSS,

            /** Layer special */
            '*': DataObjects.IS_EMITTER,
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