/**
 * @type {CAPIMap}
 * @constructor
 */
let CAPIMap = function () {
    let self = this;
    let mapping;

    this.onMapInfoCallback = null;

    /**
     * ╱ ╲ ■ □ ᥩ α β
     * @param ctnx
     * @param mapId
     * @param map
     * @param points
     * @param userPoints
     */
    this.gotMapsInfo = function (ctnx, mapId, map, points, userPoints) {
        if (!mapping) mapping = {
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
            'S': DataObjects.OBJECT_SAND,

            '△': DataObjects.OBJECT_RED,
            '◆': DataObjects.OBJECT_GREEN,
            '▭': DataObjects.OBJECT_BLUE,
            '◇': DataObjects.OBJECT_YELLOW,
            '⨀': DataObjects.OBJECT_PURPLE,

            'ᨔ': DataObjects.OBJECT_POLY_COLOR,

            'ᥩ': DataObjects.OBJECT_BARREL,
            '$': DataObjects.OBJECT_GOLD,
            't': DataObjects.OBJECT_TILE,
            'Ξ': DataObjects.OBJECT_TILE,
            'α': DataObjects.OBJECT_ALPHA,
            '‖': DataObjects.OBJECT_BLOCK,


            'β': DataObjects.OBJECT_BETA,
            'γ': DataObjects.OBJECT_GAMMA,

            'b': DataObjects.OBJECT_BOX,
            '■': DataObjects.OBJECT_BOX,
            '╲': DataObjects.OBJECT_CHAIN_A,
            '╱': DataObjects.OBJECT_CHAIN_B,
            'X': [DataObjects.OBJECT_CHAIN_A, DataObjects.OBJECT_CHAIN_B],

            '⭤': DataObjects.WITH_LIGHTNING_HORIZONTAL,
            '⭥': DataObjects.WITH_LIGHTNING_VERTICAL,
            '+': DataObjects.WITH_LIGHTNING_CROSS,

            /** Layer special */
            '*': DataObjects.IS_EMITTER,
        };
        DataMap.setMapById(mapId, map);

        points.forEach(function (point) {
            if (!point.layers.gems) point.layers.gems = getRandomGems();

            if (point.layers.special === undefined) point.layers.special = [];
            if (point.layers.special[0] === undefined) point.layers.special[0] = [];
            if (typeof point.layers.special[0] === 'string') point.layers.special = [point.layers.special];
            point.layers.special.forEach(function (layer) {
                layer.unshift('');
            });
            point.layers.mask.unshift('');

            point.layers.gems.unshift('');

            point.layers.special.unshift(getEmitterSpecialLayer());

            point.layers.mask = convertLayers(point.layers.mask, false);
            point.layers.gems = convertLayers(point.layers.gems, false);
            point.layers.special = convertLayers(point.layers.special, true);

            DataPoints.setPointData(point);
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
            DataPoints.setPointUserScore(info.pointId, info.userId, info.score);
        });
        PageController.redraw();
    };

    this.gotPointTopScore = function (cntx, pointId, topScore) {
        LogicUser.loadPointTopScore(pointId, topScore);
    };

    let getEmitterSpecialLayer = function () {
        let row = '';
        for (let x = 0; x < DataPoints.FIELD_MAX_WIDTH; x++) {
            row += '*';
        }
        return [row];
    };

    let getRandomGems = function () {
        let gems = [];
        for (let x = 0; x < DataPoints.FIELD_MAX_HEIGHT; x++) {
            gems[x] = '';
            for (let y = 0; y < DataPoints.FIELD_MAX_HEIGHT; y++) {
                gems[x] += '?';
            }
        }
        return gems;
    };

    /**
     * @returns {*[]}
     * ⬍⬌⭥⭤⯐↔↕       ʘ¤ïĦα α ȯ ɷ ɵ ʆ ʭ ʬ ʚ ░▒▓∏∩≡▀ ϔ∎
     *
     * https://pixelplus.ru/samostoyatelno/stati/vnutrennie-faktory/tablica-simvolov-unicode.html
     * https://unicode-table.com/ru/
     *
     * обозначения:
     * RGBPY - камни цветные
     * ⯐↔↕ - молния, вертикальная, горизонтальная, кросовая
     *
     * α - рыба
     * β - осминог
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
     * @param layers
     * @param isSpecialLayer
     */
    let convertLayers = function (layers, isSpecialLayer) {

        let out;
        out = [];
        if (typeof layers[0] === 'string') layers = [layers];
        layers.forEach(function (layer) {
            layer.forEach(function (row, y) {
                row.split('').forEach(function (ceil, x) {
                    if (!mapping[ceil]) {
                        Logs.log("error", Logs.LEVEL_DETAIL, [layer]);
                        Logs.alert(Logs.LEVEL_ERROR, 'ERROR: Нет такого символа в мепинге.' + ceil);
                    }

                    if (!out[x]) out[x] = [];
                    if (isSpecialLayer) {
                        if (!out[x][y]) out[x][y] = [];
                        //@todo move to mapping prepare
                        out[x][y] = out[x][y].concat(mapping[ceil].length ? mapping[ceil] : [mapping[ceil]]);
                    } else {
                        out[x][y] = mapping[ceil];
                    }
                });
            });
        });

        return out;
    };
};

/** @type {CAPIMap} */
CAPIMap = new CAPIMap();
