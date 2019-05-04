/**
 * Элемент игрового поля.
 * @constructor
 */
ElementField = function () {
    let self = this;

    let lock = true;

    /**
     * Показывать ли элемент.
     * @type {boolean}
     */
    let showed = false;

    this.ANIM_TYPE_FALLDOWN = 1;
    this.ANIM_TYPE_EXCHANGE = 2;

    // рамка и все что связано
    let gemA = null;
    let gemB = null;
    let domFrame = null;

    this.centerX = 0;
    this.centerY = 0;

    /**
     * Координата X картинки.
     * @type {number}
     */
    this.x = 0;

    /**
     * Координата Y картинки.
     * @type {number}
     */
    this.y = 0;

    let domBackground = null;

    let maskDoms = [];

    let domGemsContainer = null;
    let gemDoms = [];

    let layerGems = null;
    let layerMask = null;
    let layerSpecial = null;

    let randomGems = [
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

    let animType = null;
    let animBlock = false;
    let animObjects = [];
    let animCounter = 0;
    let animExchangeHalf = false;
    let animavx, animavy;

    let fieldWidth = 0;
    let fieldHeight = 0;

    this.onDestroyLine = null;

    /**
     * Создадим дом и настроем его.
     */
    this.init = function () {
        let dom;

        domBackground = GUI.createDom(undefined, {});

        /**
         * Create mask layer cells
         */
        for (let y = 0; y < DataPoints.FIELD_MAX_HEIGHT; y++) {
            maskDoms[y] = [];
            for (let x = 0; x < DataPoints.FIELD_MAX_WIDTH; x++) {
                dom = GUI.createDom(undefined, {
                    x: self.x + x * DataPoints.BLOCK_WIDTH,
                    y: self.y + y * DataPoints.BLOCK_HEIGHT,
                    backgroundImage: DataPoints.objectImages[DataPoints.OBJECT_CELL]
                });
                maskDoms[y][x] = dom;
            }
        }

        domGemsContainer = GUI.createDom(undefined, {
            x: self.x,
            y: self.y,
            width: DataPoints.FIELD_MAX_WIDTH * DataPoints.BLOCK_WIDTH,
            height: DataPoints.FIELD_MAX_HEIGHT * DataPoints.BLOCK_HEIGHT
        });
        /**
         * Create dom Objects
         */
        GUI.pushParent(domGemsContainer);
        for (let y = -DataPoints.FIELD_MAX_HEIGHT; y < DataPoints.FIELD_MAX_HEIGHT; y++) {
            gemDoms[y] = [];
            for (let x = 0; x < DataPoints.FIELD_MAX_WIDTH; x++) {
                dom = GUI.createDom(undefined, {
                    fieldX: x,
                    fieldY: y,
                    x: x * DataPoints.BLOCK_WIDTH,
                    y: y * DataPoints.BLOCK_HEIGHT,
                    height: DataPoints.BLOCK_HEIGHT,
                    width: DataPoints.BLOCK_WIDTH,
                    backgroundImage: '/images/field-none.png'
                });
                dom.bind(GUI.EVENT_MOUSE_CLICK, onGemClick, dom);
                dom.bind(GUI.EVENT_MOUSE_MOUSE_DOWN, onGemMouseDown, dom);
                dom.bind(GUI.EVENT_MOUSE_MOUSE_TOUCH_START, onGemTouchStart, dom);
                dom.bind(GUI.EVENT_MOUSE_MOUSE_TOUCH_END, onGemTouchEnd, dom);
                dom.bind(GUI.EVENT_MOUSE_MOUSE_UP, onGemMouseUp, dom);
                dom.bind(GUI.EVENT_MOUSE_OVER, onGemMouseOver, dom);
                gemDoms[y][x] = dom;
            }
        }

        domFrame = GUI.createDom(undefined, {
            x: self.x,
            y: self.y,
            width: DataPoints.BLOCK_WIDTH,
            height: DataPoints.BLOCK_HEIGHT,
            backgroundImage: '/images/field-frame.png'
        });

        GUI.popParent();

        OnIdle.register(self.animate);

        this.redraw();
    };

    let gemTouched = null;

    let onGemTouchStart = function () {
        Sounds.play(Sounds.PATH_CHALK);
        gemTouched = this;
    };

    let onGemTouchEnd = function (event) {
        try {
            event.stopPropagation();
            let changedTouch = event.changedTouches[0];
            let elem = document.elementFromPoint(changedTouch.clientX, changedTouch.clientY);

            if (gemTouched) {
                fieldAct(gemTouched.fieldX, gemTouched.fieldY);
                fieldAct(elem.__dom.fieldX, elem.__dom.fieldY);
                gemTouched = null;
            }
        } catch (e) {
            gemTouched = null;
        }
    };

    let onGemClick = function () {
        fieldAct(this.fieldX, this.fieldY);
    };

    let fieldAct = function (x, y) {
        console.log(x, y);

        gemAct(gemDoms[y][x]);
    };

    /**
     * Обработка дейтсвия с камнем, при клике например
     * или другом любом действием аналогичным клику.
     * @param gem
     */
    let gemAct = function (gem) {

        if (lock) return;
        if (animBlock) return;
        if (randomGems.indexOf(layerGems[gem.fieldY][gem.fieldX]) === -1) {
            return;
        }
        if (!gemA) {
            gemA = gem;
        } else {
            //if near
            let isNear;
            isNear = false;
            if (gemA.fieldX === gem.fieldX + 1 && gemA.fieldY === gem.fieldY + 0) isNear = true;
            if (gemA.fieldX === gem.fieldX - 1 && gemA.fieldY === gem.fieldY + 0) isNear = true;
            if (gemA.fieldX === gem.fieldX + 0 && gemA.fieldY === gem.fieldY + 1) isNear = true;
            if (gemA.fieldX === gem.fieldX + 0 && gemA.fieldY === gem.fieldY - 1) isNear = true;

            if (isNear) {
                domFrame.hide();
                gemB = gem;
                animBlock = true;
                let mayExchange;
                let lines;
                self.exchangeGems(gemA, gemB);
                lines = self.findLines();
                mayExchange =
                    self.lineCrossing(lines, gemA.fieldX, gemA.fieldY)
                    | self.lineCrossing(lines, gemB.fieldX, gemB.fieldY);
                self.exchangeGems(gemA, gemB);

                if (gemA.fieldX < gemB.fieldX) {
                    animType = self.ANIM_TYPE_EXCHANGE;
                    animavx = +1;
                    animavy = 0;
                }
                if (gemA.fieldX > gemB.fieldX) {
                    animType = self.ANIM_TYPE_EXCHANGE;
                    animavx = -1;
                    animavy = 0;
                }
                if (gemA.fieldY < gemB.fieldY) {
                    animType = self.ANIM_TYPE_EXCHANGE;
                    animavx = 0;
                    animavy = +1;
                }
                if (gemA.fieldY > gemB.fieldY) {
                    animType = self.ANIM_TYPE_EXCHANGE;
                    animavx = 0;
                    animavy = -1;
                }
                if (mayExchange) {
                    self.exchangeGems(gemA, gemB);
                    animExchangeHalf = true;
                    self.beforeTurnUse();
                } else {
                    animExchangeHalf = false;
                }
                animCounter = 0;
            } else {
                gemA = gem;
            }
        }
        self.redraw();
    };

    let gemMouseDown = null;

    let onGemMouseDown = function () {
        Sounds.play(Sounds.PATH_CHALK);
        gemMouseDown = this;
        // 1 - при mousedown - ждём перехода в соседнию
        // 2 - если перешли - вызываем onclick дважды
    };

    let onGemMouseUp = function () {
        gemMouseDown = null;
        // 1 - при mousedown - ждём перехода в соседнию
        // 2 - если перешли - вызываем onclick дважды
    };

    let onGemMouseOver = function () {
        if (gemMouseDown) {
            fieldAct(gemMouseDown.fieldX, gemMouseDown.fieldY);
            fieldAct(this.fieldX, this.fieldY);
            gemMouseDown = null;
        }
    };

    /**
     * Покажем картинку.
     */
    this.show = function () {
        if (showed === true) return;
        showed = true;
        domBackground.show();
        domGemsContainer.show();
        for (let y = 0; y < fieldHeight; y++) {
            for (let x = 0; x < fieldWidth; x++) {
                maskDoms[y][x].show();
            }
        }
        for (let y = -fieldHeight; y < fieldHeight; y++) {
            for (let x = 0; x < fieldWidth; x++) {
                gemDoms[y][x].show();
            }
        }
        self.redraw();
    };

    /**
     * Спрячем картинку.
     */
    this.hide = function () {
        if (showed === false) return;
        showed = false;
        domBackground.hide();
        domGemsContainer.hide();
        for (let y = 0; y < DataPoints.FIELD_MAX_HEIGHT; y++) {
            for (let x = 0; x < DataPoints.FIELD_MAX_WIDTH; x++) {
                maskDoms[y][x].hide();
            }
        }
        for (let y = -DataPoints.FIELD_MAX_HEIGHT; y < DataPoints.FIELD_MAX_HEIGHT; y++) {
            for (let x = 0; x < DataPoints.FIELD_MAX_WIDTH; x++) {
                gemDoms[y][x].hide();
            }
        }
    };

    /**
     * Перерисуем картинку.
     */
    this.redraw = function () {
        if (!showed) return;
        if (animBlock) return;
        self.x = self.centerX - DataPoints.BLOCK_WIDTH * Math.floor(fieldWidth / 2);
        self.y = self.centerY - DataPoints.BLOCK_HEIGHT * Math.floor(fieldHeight / 2);
        domGemsContainer.x = self.x;
        domGemsContainer.y = self.y;
        domGemsContainer.redraw();
        domBackground.redraw();
        // layer.mask
        layerMask.forEach(function (row, y) {
            row.forEach(function (cell, x) {
                switch (cell) {
                    case DataPoints.OBJECT_EMPTY:
                        cell = DataPoints.OBJECT_CELL;
                    default:
                        maskDoms[y][x].x = self.x + x * DataPoints.BLOCK_WIDTH;
                        maskDoms[y][x].y = self.y + y * DataPoints.BLOCK_HEIGHT;
                        maskDoms[y][x].backgroundImage = DataPoints.objectImages[cell];
                        maskDoms[y][x].show();
                        maskDoms[y][x].redraw();
                        break;
                    case DataPoints.OBJECT_NONE:
                        maskDoms[y][x].hide();
                        break;
                }
            });
        });
        if (layerGems) {
            for (let y = 0; y < fieldHeight; y++) {
                for (let x = 0; x < fieldWidth; x++) {
                    if (layerGems[y][x] === DataPoints.OBJECT_NONE) {
                        gemDoms[y][x].hide();
                    } else {
                        if (layerMask[y][x] !== DataPoints.OBJECT_EMPTY) {
                            gemDoms[y][x].hide();
                        } else {
                            gemDoms[y][x].backgroundImage = DataPoints.objectImages[layerGems[y][x]];
                            gemDoms[y][x].y = y * DataPoints.BLOCK_HEIGHT;
                            gemDoms[y][x].x = x * DataPoints.BLOCK_WIDTH;
                            gemDoms[y][x].height = DataPoints.BLOCK_HEIGHT;
                            gemDoms[y][x].backgroundPositionY = null;
                            gemDoms[y][x].show();
                            gemDoms[y][x].redraw();
                        }
                    }
                }
            }
        }
        if (gemA && !animBlock) {
            domFrame.x = gemA.x;
            domFrame.y = gemA.y;
            domFrame.show();
            domFrame.redraw();
        } else {
            domFrame.hide();
        }
    };

    /**
     * Set the field data.
     * @param newField
     */
    this.setLayers = function (layers) {
        layerMask = [];
        layerGems = [];
        layerSpecial = [];

        layers.gems.forEach(function (row, y) {
            layerGems[y] = [];
            row.forEach(function (cell, x) {
                if (cell === DataPoints.OBJECT_RANDOM) cell = self.getRandomGem();
                layerGems[y][x] = cell;
            });
        });
        layers.mask.forEach(function (row, y) {
            layerMask[y] = [];
            row.forEach(function (cell, x) {
                layerMask[y][x] = cell;
            });
        });
        layers.special.forEach(function (row, y) {
            layerSpecial[y] = [];
            row.forEach(function (cell, x) {
                layerSpecial[y][x] = cell;
            });
        });

        fieldWidth = layers.gems[0].length;
        fieldHeight = layers.gems.length;
        this.redraw();
    };

    this.getRandomGem = function () {
        return randomGems[Math.floor(Math.random() * randomGems.length)];
    };

    let runNext = 0;

    this.run = function () {
        switch (runNext) {
            case 0:
                runNext = 1;
                self.processSpecialLayer();
                break;
            case 1:
                runNext = 2;
                self.fallDown();
                break;
            case 2:
                runNext = 0;
                self.destroyLines();
                break;
        }
    };

    this.processSpecialLayer = function () {
        layerSpecial.forEach(function (row, y) {
            row.forEach(function (cell, x) {
                //if emitter and empty layerGems, set random gem
                if (cell === DataPoints.OBJECT_EMITTER &&
                    layerGems[y][x] === DataPoints.OBJECT_EMPTY
                ) {
                    layerGems[y][x] = self.getRandomGem();
                    if (layerMask[y][x] === DataPoints.OBJECT_NONE) {
                        gemDoms[y][x].height = 0;
                    } else {
                        gemDoms[y][x].height = DataPoints.BLOCK_HEIGHT;
                    }
                }
            });
        });
        self.run();
    };

    this.fallDown = function () {
        if (animBlock) return;
        self.redraw(); // reset coords and other states
        animObjects = [];
        animCounter = 0;

        for (let y = fieldHeight - 1; y > 0; y--) {
            for (let x = 0; x < fieldWidth; x++) {
                let dom;
                if (
                    fallDownObjects.indexOf(layerGems[y][x]) === -1 &&
                    fallDownObjects.indexOf(layerGems[y - 1][x]) !== -1
                ) {
                    dom = gemDoms[y - 1][x];
                    dom.mode = '';
                    // if dom now on NONE and below IS NOT NONE, set flag - showUp
                    // if dom now is NOT NONE and below IS NONE, set flag hideDown
                    if (layerMask[y - 1][x] === DataPoints.OBJECT_EMPTY &&
                        layerMask[y][x] !== DataPoints.OBJECT_EMPTY
                    ) dom.mode = 'tohide';

                    if (layerMask[y - 1][x] !== DataPoints.OBJECT_EMPTY &&
                        layerMask[y][x] === DataPoints.OBJECT_EMPTY
                    ) {
                        dom.mode = 'toshow';
                        dom.backgroundImage = DataPoints.objectImages[layerGems[y - 1][x]];
                        // переисовка backgroundPositionY это хитрый хак и костыль :)
                        dom.backgroundPositionY = DataPoints.BLOCK_HEIGHT;
                        dom.height = 0;
                        dom.y = y * DataPoints.BLOCK_HEIGHT;
                        dom.x = x * DataPoints.BLOCK_WIDTH;
                        dom.show();
                    }
                    // exchange
                    layerGems[y][x] = layerGems[y - 1][x];
                    layerGems[y - 1][x] = DataPoints.OBJECT_EMPTY;

                    animObjects.push(dom);
                }
            }
        }

        if (animObjects.length) {
            animType = self.ANIM_TYPE_FALLDOWN;
            animBlock = true;
        } else {
            self.run();
        }
    };

    this.destroyLines = function () {
        let lines;
        lines = this.findLines();
        // destroy lines
        let p;
        if (lines.length)
            for (let i in lines) {
                for (let c in lines[i].coords) {
                    p = lines[i].coords[c];
                    layerGems[p.y][p.x] = DataPoints.OBJECT_EMPTY;
                }
                self.onDestroyLine(lines[i]);
            }
        this.redraw();

        setTimeout(function () {
            self.run();
        }, 1);
    };

    this.findLines = function () {
        let line, lines;
        lines = [];
        for (let y = 0; y < fieldHeight; y++) {
            for (let x = 0; x < fieldWidth; x++) {
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
        let startId, line;
        startId = layerGems[y][x];
        if (fallDownObjects.indexOf(startId) == -1) return false;

        line = {
            coords: [],
            gemId: startId
        };
        if (orientation == 1) {
            for (let offset = 0; offset < 5; offset++) {
                if (y >= fieldHeight) continue;
                if (x + offset >= fieldWidth) continue;
                if (layerGems[y][x + offset] == startId) {
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
                if (layerGems[y + offset][x] == startId) {
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

    this.animate = function () {
        let dom;
        if (lock) return;
        if (!animBlock) return;

        switch (animType) {
            case self.ANIM_TYPE_FALLDOWN:// falldown
                animCounter++;
                for (let i in animObjects) {
                    dom = animObjects[i];
                    switch (dom.mode) {
                        case 'toshow':
                            dom.height += 15;
                            dom.backgroundPositionY -= 15;
                            break;
                        case 'tohide':
                            dom.y += 15;
                            dom.height -= 15;
                            break;
                        default:
                            dom.y += 15;
                            break;
                    }
                    dom.redraw();
                }
                if (animCounter === 3) {
                    animBlock = false;
                    animType = 0;
                    self.run();
                }
                break;
            case self.ANIM_TYPE_EXCHANGE: // a <-> b
                let step = 5;
                animCounter++;
                if (animCounter <= 50 / step) {
                    gemA.x += animavx * step;
                    gemB.x -= animavx * step;
                    gemA.y += animavy * step;
                    gemB.y -= animavy * step;
                }
                if (!animExchangeHalf && animCounter > 50 / step) {
                    gemA.x -= animavx * step;
                    gemB.x += animavx * step;
                    gemA.y -= animavy * step;
                    gemB.y += animavy * step;
                }
                gemA.redraw();
                gemB.redraw();
                if ((animExchangeHalf && animCounter == 50 / step)
                    || animCounter == 50 / step * 2
                ) {
                    animBlock = false;
                    animType = 0;
                    gemA = null;
                    gemB = null;
                    self.redraw();
                    self.run();
                }
                break;
        }
    };


    this.exchangeGems = function (gemA, gemB) {
        let tmp;
        tmp = layerGems[gemB.fieldY][gemB.fieldX];
        layerGems[gemB.fieldY][gemB.fieldX] =
            layerGems[gemA.fieldY][gemA.fieldX];
        layerGems[gemA.fieldY][gemA.fieldX] = tmp;
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

    this.lock = function () {
        lock = true;
    };

    this.unlock = function () {
        lock = false;
    };
};