LogicField = function () {
    let self = this;

    let layerMask = null,
        layerGems = null,
        layerSpecial = null;

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
    let fallObjects = [
        DataObjects.OBJECT_RED,
        DataObjects.OBJECT_GREEN,
        DataObjects.OBJECT_BLUE,
        DataObjects.OBJECT_YELLOW,
        DataObjects.OBJECT_PURPLE,
    ];

    this.isGem = function (p) {
        if (!layerGems[p.x] || !layerGems[p.x][p.y]) return false;
        return gems.indexOf(layerGems[p.x][p.y]) !== -1;
    };

    this.isNotGem = function (p) {
        return !self.isGem(p);
    };

    this.isHole = function (p) {
        return layerGems[p.x] && layerGems[p.x][p.y] &&
            layerGems[p.x][p.y] === DataObjects.OBJECT_HOLE;
    };

    this.isFallObject = function (id) {
        return fallObjects.indexOf(id) !== -1;
    };

    /**
     * Может ли упасть камень с верху
     * @param x
     * @param y
     * @returns {boolean|boolean}
     */
    this.mayFall = function (x, y) {
        return layerGems[x] && layerGems[x][y] &&
            !LogicField.isFallObject(layerGems[x][y]) &&
            LogicField.isFallObject(layerGems[x][y - 1]);
    };

    this.getRandomGemId = function () {
        return gems[Math.floor(Math.random() * gems.length)];
    };

    this.isVisilbe = function (p) {
        return layerMask[p.x] && layerMask[p.x][p.y] &&
            layerMask[p.x][p.y] === DataObjects.OBJECT_VISIBLE;
    };

    this.countTurns = function () {
        let allLines = [], lines;

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
        this.eachCell(function (x, y) {

            a = {x: x, y: y};
            b = {x: x + 1, y: y};
            if (self.isVisilbe(a) && self.isGem(a) &&
                self.isVisilbe(b) && self.isGem(b)
            ) {
                /** 1 - Меняем a ⇔ b */
                self.exchangeGems(a, b);

                /** 2 - Считаем линии */
                lines = self.findLines();

                if (lines.length) allLines.push({a: a, b: b.y, lines: lines});

                /** 3 - Возвращаем a ⇔ b */
                self.exchangeGems(a, b);
            }

            a = {x: x, y: y};
            b = {x: x, y: y + 1};
            if (self.isVisilbe(a) && self.isGem(a) &&
                self.isVisilbe(b) && self.isGem(b)
            ) {
                /** 5 - Меняем a ⇕ b */
                self.exchangeGems(a, b);

                /** 6 - Считаем линии */
                lines = self.findLines();
                if (lines.length) allLines.push({a: a, b: b.y, lines: lines});

                /** 7 - Возвращаем a ⇕ b */
                self.exchangeGems(a, b);
            }
        });

        return allLines;
    };

    this.exchangeGems = function (a, b) {
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

    /**
     * Камни рядом, значит они прилегают друг к другу.
     * @param a
     * @param b
     * @returns {boolean}
     */
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

    this.findLines = function () {
        let line, lines;
        lines = [];
        for (let y = 0; y < DataPoints.FIELD_MAX_HEIGHT; y++) {
            for (let x = 0; x < DataPoints.FIELD_MAX_WIDTH; x++) {
                if (this.lineCrossing(lines, x, y)) continue;
                line = this.findLine(x, y, 1);
                if (line) {
                    lines.push(line);
                }
                line = this.findLine(x, y, 2);
                if (line) {
                    lines.push(line);
                }
            }
        }
        return lines;
    };

    this.findLine = function (x, y, orientation) {
        let gemId, line;
        gemId = self.getGemId({x: x, y: y});
        /** Может ли такой объект вообще падать */
        if (LogicField.isNotGem({x: x, y: y})) return false;
        line = {
            coords: [],
            gemId: gemId
        };
        if (orientation === 1) {
            for (let offset = 0; offset < 5; offset++) {
                if (x + offset >= DataPoints.FIELD_MAX_WIDTH) continue;
                if (y >= DataPoints.FIELD_MAX_HEIGHT) continue;
                if (
                    self.isVisilbe({x: x + offset, y: y}) &&
                    self.getGemId({x: x + offset, y: y}) === gemId
                ) {
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
                if (x + offset >= DataPoints.FIELD_MAX_WIDTH) continue;
                if (y >= DataPoints.FIELD_MAX_HEIGHT) continue;
                if (self.isVisilbe({x: x, y: y + offset}) &&
                    self.getGemId({x: x, y: y + offset}) === gemId) {
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

    //@todo refactring
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

    this.eachCell = function (callback) {
        let maskId, gemId, specId;
        for (let y = 0; y < DataPoints.FIELD_MAX_HEIGHT; y++) {
            for (let x = 0; x < DataPoints.FIELD_MAX_WIDTH; x++) {
                maskId = layerMask && layerMask[x] && layerMask[x][y];
                gemId = layerGems && layerGems[x] && layerGems[x][y];
                specId = layerSpecial && layerSpecial[x] && layerSpecial[x][y];
                callback(x, y, maskId, gemId, specId);
            }
        }
    };

    this.setGem = function (p, gemId) {
        layerGems[p.x][p.y] = gemId;
    };

    this.getGemId = function (p) {
        return layerGems[p.x] && layerGems[p.x][p.y];
    };

    this.setLayers = function (mask, gems, special) {
        layerMask = mask;
        layerGems = gems;
        layerSpecial = special;
    };

    this.isLightningGem = function (p) {
        return layerSpecial[p.x] && layerSpecial[p.x][p.y]
            && layerSpecial[p.x][p.y] === DataObjects.OBJECT_LIGHTNING_VERTICAL;
    };

    this.isLinePossiblyDestroy = function (pA, pB) {
        let lines, mayLineDestroy;
        LogicField.exchangeGems(pA, pB);
        lines = LogicField.findLines();
        mayLineDestroy = LogicField.lineCrossing(lines, pA.x, pA.y) | LogicField.lineCrossing(lines, pB.x, pB.y);
        LogicField.exchangeGems(pA, pB);
        return mayLineDestroy;
    }
};

/** @type {LogicField} */
LogicField = new LogicField;
/** Aliases */
Field = LogicField;