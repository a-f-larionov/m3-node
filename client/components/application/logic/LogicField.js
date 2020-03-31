LogicField = function () {
    let self = this;

    /**
     * Список всех камней
     * @type {number[]}
     */
    let gems = [
        DataObjects.OBJECT_RED,
        DataObjects.OBJECT_GREEN,
        DataObjects.OBJECT_BLUE,
        DataObjects.OBJECT_YELLOW,
        DataObjects.OBJECT_PURPLE,
    ];

    /**
     * Объекты, способные падать вниз.
     * @type {number[]}
     */
    let fallDownObjects = [
        DataObjects.OBJECT_RED,
        DataObjects.OBJECT_GREEN,
        DataObjects.OBJECT_BLUE,
        DataObjects.OBJECT_YELLOW,
        DataObjects.OBJECT_PURPLE,
    ];

    this.isGem = function (gemOrId, layerGems) {
        if (layerGems) gemOrId = layerGems[gemOrId.x][gemOrId.y];
        return gems.indexOf(gemOrId) !== -1;
    };

    this.isNotGem = function (id) {
        return !self.isGem(id);
    };

    this.isFallingObject = function (id) {
        return fallDownObjects.indexOf(id) !== -1;
    };

    this.mayFall = function (x, y, layerGems) {
        return !LogicField.isFallingObject(layerGems[x][y]) &&
            LogicField.isFallingObject(layerGems[x][y-1]);
    };

    this.getRandomGemId = function () {
        return gems[Math.floor(Math.random() * gems.length)];
    };

    this.isVisilbe = function (p, layerMask) {
        return layerMask[p.x] && layerMask[p.x][p.y] &&
            layerMask[p.x][p.y] !== DataObjects.OBJECT_NONE;
    };

    this.countTurns = function (layerMask, layerGems, fieldHeight, fieldWidth) {
        let turnCount = 0,
            allLines = [],
            lines
        ;

        /**
         * 1 - Меняем a ⇔ b
         * 2 - Считаем линии
         * 3 - Возвращаем a <> b
         * 4 - Считаем линии
         * 5 - Меняем a⇕b
         * 6 - Считаем линии
         * 7 - Возвращаем a⇕b
         */
        let a, b;
        for (let y = 0; y < fieldHeight; y++) {
            for (let x = 0; x < fieldWidth; x++) {

                a = {x: x, y: y};
                b = {x: x + 1, y: y};
                if (this.isVisilbe(a, layerMask) && this.isGem(a, layerGems) &&
                    this.isVisilbe(b, layerMask) && this.isGem(b, layerGems)
                ) {
                    /** 1 - Меняем a ⇔ b */
                    this.exchangeGems(a, b, layerGems);

                    /** 2 - Считаем линии */
                    lines = this.findLines(fieldHeight, fieldWidth, layerMask, layerGems, true);
                    if (lines.length) allLines.push({a: a, b: b.y, lines: lines});

                    /** 3 - Возвращаем a ⇔ b */
                    this.exchangeGems(a, b, layerGems);
                }

                a = {x: x, y: y};
                b = {x: x, y: y + 1};
                if (this.isVisilbe(a, layerMask) && this.isGem(a, layerGems) &&
                    this.isVisilbe(b, layerMask) && this.isGem(b, layerGems)
                ) {
                    /** 5 - Меняем a ⇕ b */
                    this.exchangeGems(a, b, layerGems);

                    /** 6 - Считаем линии */
                    lines = this.findLines(fieldHeight, fieldWidth, layerMask, layerGems, true);
                    if (lines.length) allLines.push({a: a, b: b.y, lines: lines});

                    /** 7 - Возвращаем a ⇕ b */
                    this.exchangeGems(a, b, layerGems);
                }
            }
        }
        return allLines;
    };

    this.exchangeGems = function (a, b, layerGems) {
        let tmp;
        if (layerGems[a.x] === undefined ||
            layerGems[a.x][a.y] === undefined ||
            layerGems[b.x] === undefined ||
            layerGems[b.x][b.y] === undefined
        ) return false;
        tmp = layerGems[b.x][b.y];
        layerGems[b.x][b.y] = layerGems[a.x][a.y];
        layerGems[a.x][a.y] = tmp;
        return true;
    };

    this.isNear = function (a, b) {
        if (
            Math.abs(a.x - b.x) === 1
            && a.y - b.y === 0
        ) return true;
        if (
            a.x - b.x === 0
            && Math.abs(a.y - b.y) === 1
        ) return true;
        return false;
    };

    this.findLines = function (fieldHeight, fieldWidth, layerMask, layerGems, log) {
        let line, lines;
        lines = [];
        for (let y = 0; y < fieldHeight; y++) {
            for (let x = 0; x < fieldWidth; x++) {
                if (this.lineCrossing(lines, x, y)) continue;
                line = this.findLine(x, y, 1, fieldHeight, fieldWidth, layerMask, layerGems);
                if (line) {
                    lines.push(line);
                }
                line = this.findLine(x, y, 2, fieldHeight, fieldWidth, layerMask, layerGems);
                if (line) {
                    lines.push(line);
                }
            }
        }
        return lines;
    };

    this.findLine = function (x, y, orientation, fieldHeight, fieldWidth, layerMask, layerGems) {
        let startId, line;
        startId = layerGems[x][y];
        /** Может ли такой объект вообще падать */
        if (LogicField.isNotGem(startId)) return false;

        line = {
            coords: [],
            gemId: startId
        };
        if (orientation === 1) {
            for (let offset = 0; offset < 5; offset++) {
                if (y >= fieldHeight) continue;
                if (x + offset >= fieldWidth) continue;
                if (layerGems[x + offset][y] === startId &&
                    layerMask[x + offset][y] === DataObjects.OBJECT_EMPTY) {
                    line.coords.push({
                        x: x + offset,
                        y: y
                    });
                } else {
                    break;
                }
            }
        } else {
            for (let offset = 0; offset < 5; offset++) {
                if (y + offset >= fieldHeight) continue;
                if (x >= fieldWidth) continue;
                if (layerGems[x][y + offset] === startId &&
                    layerMask[x][y + offset] === DataObjects.OBJECT_EMPTY) {
                    line.coords.push({
                        x: x,
                        y: y + offset
                    });
                } else {
                    break;
                }
            }
        }
        if (line.coords.length >= 3)
            return line;
        else
            return false;
    };

    this.lineCrossing = function (lines, x, y) {
        for (let i in lines) {
            for (let n in lines[i].coords) {
                if (x === lines[i].coords[n].x &&
                    y === lines[i].coords[n].y) {
                    return true;
                }
            }
        }
        return false;
    };

    this.eachLayerMask = function (callback, layerMask, layerGems) {
        let mask, gem;
        for (let y = 0; y < DataPoints.FIELD_MAX_HEIGHT; y++) {
            for (let x = 0; x < DataPoints.FIELD_MAX_WIDTH; x++) {
                mask = layerMask && layerMask[x] && layerMask[x][y];
                gem = layerGems && layerGems[x] && layerGems[x][y];
                callback(x, y, mask, gem);
            }
        }
    };
};

/** @type {LogicField} */
LogicField = new LogicField;