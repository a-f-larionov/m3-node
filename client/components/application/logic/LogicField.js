LogicField = function () {
    let self = this;

    let gems = [
        DataPoints.OBJECT_RED,
        DataPoints.OBJECT_GREEN,
        DataPoints.OBJECT_BLUE,
        DataPoints.OBJECT_YELLOW,
        DataPoints.OBJECT_PURPLE,
    ];

    let fallDownObjects = [
        DataPoints.OBJECT_RED,
        DataPoints.OBJECT_GREEN,
        DataPoints.OBJECT_BLUE,
        DataPoints.OBJECT_YELLOW,
        DataPoints.OBJECT_PURPLE,
    ];

    this.isGem = function (id, layerGems) {
        if (layerGems) id = layerGems[id.y][id.x];
        return gems.indexOf(id) !== -1;
    };

    this.isNotGem = function (id) {
        return !self.isGem(id);
    };

    this.isFallingObject = function (id) {
        return fallDownObjects.indexOf(id) !== -1;
    };

    this.mayFall = function (x, y, layerGems) {
        return !LogicField.isFallingObject(layerGems[y][x]) &&
            LogicField.isFallingObject(layerGems[y - 1][x]);
    };

    this.getRandomGemId = function () {
        return gems[Math.floor(Math.random() * gems.length)];
    };

    this.isVisilbe = function (p, layerMask) {
        return layerMask[p.y][p.x] !== DataPoints.OBJECT_NONE;
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
        if (layerGems[a.y] === undefined ||
            layerGems[a.y][a.x] === undefined ||
            layerGems[b.y] === undefined ||
            layerGems[b.y][b.x] === undefined
        ) return false;
        tmp = layerGems[b.y][b.x];
        layerGems[b.y][b.x] = layerGems[a.y][a.x];
        layerGems[a.y][a.x] = tmp;
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
        startId = layerGems[y][x];
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
                if (layerGems[y][x + offset] === startId &&
                    layerMask[y][x + offset] === DataPoints.OBJECT_EMPTY) {
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
                if (layerGems[y + offset][x] === startId &&
                    layerMask[y + offset][x] === DataPoints.OBJECT_EMPTY) {
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

};

LogicField = new LogicField;