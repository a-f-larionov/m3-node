LogicField = function () {
    let self = this;

    let cells = null;

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

        DataObjects.OBJECT_POLY_COLOR,
        DataObjects.OBJECT_BARREL,
        DataObjects.OBJECT_SPIDER
    ];

    this.getCell = function (p) {
        if (self.isOut(p)) return false;
        return cells[p.x][p.y];
    };

    this.isGem = function (p) {
        if (!cells[p.x] || !cells[p.x][p.y]) return false;
        return cells[p.x][p.y].object.isGem;
    };

    this.isNotGem = function (p) {
        return !self.isGem(p);
    };

    this.isHole = function (p) {
        if (!cells[p.x] || !cells[p.x][p.y]) return false;
        return cells[p.x][p.y].object.isHole;
    };

    this.isFallObject = function (p) {
        if (self.isOut(p)) return false;
        return fallObjects.indexOf(cells[p.x][p.y].object.objectId) !== -1;
    };

    this.mayFall = function (x, y) {
        if (self.isOut({x: x, y: y})) return false;
        if (!LogicField.getCell({x: x, y: y}).object.isCanMoved) return false;

        return LogicField.isFallObject({x: x, y: y}) &&
            getHole({x: x, y: y})
    };

    let getHole = function (p) {
        for (let y = 0, cell; y < DataPoints.FIELD_MAX_HEIGHT; y++) {
            p.y++;
            cell = self.getCell(p);
            if (cell && cell.object.isHole && !cell.object.isCanMoved) {
                return p;
            }
        }
        return false;
    };

    this.getRandomGemId = function () {
        return gems[Math.floor(Math.random() * gems.length)];
    };

    this.isVisible = function (p) {
        if (!cells[p.x] || !cells[p.x][p.y]) return false;
        return cells[p.x][p.y].isVisible;
    };

    this.countTurns = function () {
        let allLines = [], lines, objectA, objectB, cellA, cellB;

        let checkGems = function (a, b) {
            cellA = self.getCell(a);
            cellB = self.getCell(b);
            if (cellA && cellB) {
                objectA = cellA.object;
                objectB = cellB.object;
                if (cellA.isVisible && objectA.isCanMoved && cellB.isVisible && objectB.isCanMoved) {
                    /** 1 - Меняем a ⇔ b */
                    self.exchangeObjects(a, b);
                    /** 2 - Считаем линии */
                    lines = self.findLines();
                    if (lines.length) allLines.push({a: a, b: b, lines: lines});
                    /** 3 - Возвращаем a ⇔ b */
                    self.exchangeObjects(a, b);
                }
            }
        };
        this.eachCell(function (x, y) {
            checkGems({x: x, y: y}, {x: x + 1, y: y});
            checkGems({x: x, y: y}, {x: x, y: y + 1});
        });

        return allLines;
    };

    this.exchangeObjects = function (a, b) {
        let tmp;
        if (self.isOut(a) || self.isOut(b)) return false;

        tmp = cells[b.x][b.y].object;
        cells[b.x][b.y].object = cells[a.x][a.y].object;
        cells[a.x][a.y].object = tmp;

        return true;
    };

    this.isOut = function (p) {
        return p.x < 0 ||
            p.x >= DataPoints.FIELD_MAX_WIDTH ||
            p.y < 0 ||
            p.y > DataPoints.FIELD_MAX_HEIGHT;
    };

    /**
     * Камни рядом, значит они прилегают друг к другу.
     * @param a
     * @param b
     * @returns {boolean}
     */
    this.isNear = function (a, b) {
        if (Math.abs(a.x - b.x) === 1
            && a.y - b.y === 0
        ) return true;
        if (a.x - b.x === 0
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

                line = this.findLine(x, y, DataObjects.WITH_LIGHTNING_VERTICAL);
                if (line) lines.push(line);

                line = this.findLine(x, y, DataObjects.WITH_LIGHTNING_HORIZONTAL);
                if (line) lines.push(line);
            }
        }
        return lines;
    };

    this.findLine = function (x, y, orientation) {
        let gemId, line, cell;
        cell = self.getCell({x: x, y: y});
        gemId = cell.object.objectId;
        if (!cell.isVisible || !cell.object.isCanMoved) return false;

        line = {
            orientation: orientation,
            coords: [],
            gemId: gemId
        };
        let checkCell = function (p) {
            cell = self.getCell(p);
            if (cell && cell.isVisible &&
                cell.object.isCanMoved &&
                cell.object.objectId === gemId)
                return line.coords.push(p);
            return false;
        };
        if (orientation === DataObjects.WITH_LIGHTNING_HORIZONTAL) {
            for (let offset = 0; offset < 5; offset++) {
                if (!checkCell({x: x + offset, y: y})) break;
            }
        } else {
            for (let offset = 0; offset < 5; offset++) {
                if (!checkCell({x: x, y: y + offset})) break;
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
        for (let y = 0; y < DataPoints.FIELD_MAX_HEIGHT; y++) {
            for (let x = 0; x < DataPoints.FIELD_MAX_WIDTH; x++) {
                callback(x, y,
                    cells && cells[x][y],
                    cells && cells[x][y].object
                );
            }
        }
    };

    this.setObject = function (p, id, lightningId) {
        let object;
        object = cells[p.x][p.y].object;
        object.objectId = id;
        object.isHole = (id === DataObjects.OBJECT_HOLE);
        object.isGem = gems.indexOf(id) !== -1;
        object.lightningId = lightningId;

        object.isPolyColor = (id === DataObjects.OBJECT_POLY_COLOR);
        object.isBarrel = (id === DataObjects.OBJECT_BARREL);
        object.isSpider = (id === DataObjects.OBJECT_SPIDER);

        self.updateIsCanMoved(object);
    };

    this.updateIsCanMoved = function (object) {
        object.isCanMoved = (object.isGem || object.isBarrel || object.isPolyColor) && !object.withBox && !object.withChain;
    };

    this.getGemId = function (p) {
        return cells[p.x] && cells[p.x][p.y].object.objectId;
    };

    this.setLayers = function (mask, objects, specials) {
        let specIds, lightningId, objectId;
        cells = [];
        for (let x = 0; x < DataPoints.FIELD_MAX_WIDTH; x++) {
            cells[x] = [];
            for (let y = 0; y < DataPoints.FIELD_MAX_HEIGHT; y++) {
                specIds = getSpecIds({x: x, y: y}, specials);

                lightningId = false;
                if (specIds.indexOf(DataObjects.WITH_LIGHTNING_HORIZONTAL) !== -1) lightningId = DataObjects.WITH_LIGHTNING_HORIZONTAL;
                if (specIds.indexOf(DataObjects.WITH_LIGHTNING_VERTICAL) !== -1) lightningId = DataObjects.WITH_LIGHTNING_VERTICAL;
                if (specIds.indexOf(DataObjects.WITH_LIGHTNING_CROSS) !== -1) lightningId = DataObjects.WITH_LIGHTNING_CROSS;

                objectId = objects[x] && objects[x][y];

                let cell, object;
                object = {};
                cell = {object: object, x: x, y: y};
                cells[x][y] = cell;
                cell.isVisible = mask[x] && mask[x][y] && mask[x][y] === DataObjects.CELL_VISIBLE;
                cell.isEmitter = specIds.indexOf(DataObjects.IS_EMITTER) !== -1;

                if (objectId === DataObjects.OBJECT_SPIDER) object.health = 3;

                cell.withTreasures = specIds.indexOf(DataObjects.OBJECT_TREASURES) !== -1;

                object.withBox = specIds.indexOf(DataObjects.OBJECT_BOX) !== -1;
                object.withChain = specIds.indexOf(DataObjects.OBJECT_CHAIN) !== -1;
                object.withOctopus = specIds.indexOf(DataObjects.OBJECT_OCTOPUS) !== -1;

                self.setObject({x: x, y: y}, objectId, lightningId)
            }
        }
    };

    this.eachNears = function (p, callback) {
        let toSearch = [
            {x: p.x + 1, y: p.y},
            {x: p.x - 1, y: p.y},
            {x: p.x, y: p.y + 1},
            {x: p.x, y: p.y - 1},
        ];
        toSearch.forEach(function (p) {
            if (!self.isOut(p) && self.isVisible(p)) {
                callback(p, self.getCell(p));
            }
        });
    };

    let getSpecIds = function (p, specials) {
        let specIds = [];
        specials.forEach(function (level) {
            if (level[p.x] && level[p.x][p.y])
                specIds.push(level[p.x][p.y]);
        });
        return specIds;
    };

    this.isLinePossiblyDestroy = function (pA, pB) {
        let lines, mayLineDestroy;
        LogicField.exchangeObjects(pA, pB);
        lines = LogicField.findLines();
        mayLineDestroy = LogicField.lineCrossing(lines, pA.x, pA.y) | LogicField.lineCrossing(lines, pB.x, pB.y);
        LogicField.exchangeObjects(pA, pB);
        return mayLineDestroy;
    };

    /**
     * @param p
     * @param oreintation
     * @param callback
     */
    this.eachVisibleLine = function (p, oreintation, callback) {
        let list = [];
        let isVisbleCall = function (p, cell) {
            cell = self.getCell(p);
            if (cell.isVisible) list.push({p: p, cell: cell});
        };
        switch (oreintation) {
            case DataObjects.WITH_LIGHTNING_HORIZONTAL:
                for (let x = 0; x < DataPoints.FIELD_MAX_WIDTH; x++) isVisbleCall({x: x, y: p.y});
                break;
            case DataObjects.WITH_LIGHTNING_VERTICAL:
                for (let y = 0; y < DataPoints.FIELD_MAX_HEIGHT; y++) isVisbleCall({x: p.x, y: y});
                break;
            default:
                Logs.log("Error :" + arguments.callee.name, Logs.LEVEL_ERROR);
                break;
        }
        list.sort(function (a, b) {
            if (a.cell.object.isCanMoved && !b.cell.object.isCanMoved) return 1;
            if (!a.cell.object.isCanMoved && b.cell.object.isCanMoved) return -1;
            return 0;
        });
        list.forEach(function (i) {
            callback(i.p, i.cell);
        })
    };

    this.getVisibleLength = function (p, orientation) {
        let leftX = Infinity, rightX = -Infinity;
        /** Получить длину текущей линии */
        switch (orientation) {
            case DataObjects.WITH_LIGHTNING_HORIZONTAL:
                for (let x = 0; x < DataPoints.FIELD_MAX_WIDTH; x++) {
                    if (Field.isVisible({x: x, y: p.y})) {
                        leftX = Math.min(leftX, x);
                        rightX = Math.max(rightX, x);
                    }
                }
                return {lower: leftX, higher: rightX, length: rightX - leftX + 1};
            case DataObjects.WITH_LIGHTNING_VERTICAL:
                for (let y = 0; y < DataPoints.FIELD_MAX_HEIGHT; y++) {
                    if (Field.isVisible({x: p.x, y: y})) {
                        leftX = Math.min(leftX, y);
                        rightX = Math.max(rightX, y);
                    }
                }
                return {lower: leftX, higher: rightX, length: rightX - leftX + 1};
        }
    }
};

/** @type {LogicField} */
LogicField = new LogicField;
/** Aliases */
Field = LogicField;