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
    let domCells = [];
    let domObjectsContainer = null;
    let domObjects = [];

    let field = null;


    let randomObjects = [
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
         * Create dom Cells
         */
        for (let y = 0; y < DataPoints.FIELD_MAX_HEIGHT; y++) {
            domCells[y] = [];
            for (let x = 0; x < DataPoints.FIELD_MAX_WIDTH; x++) {
                dom = GUI.createDom(undefined, {
                    x: self.x + x * DataPoints.BLOCK_WIDTH,
                    y: self.y + y * DataPoints.BLOCK_HEIGHT,
                    backgroundImage: '/images/field-cell.png'
                });
                domCells[y][x] = dom;
            }
        }

        domObjectsContainer = GUI.createDom(undefined, {
            x: self.x,
            y: self.y,
            width: DataPoints.FIELD_MAX_WIDTH * DataPoints.BLOCK_WIDTH,
            height: DataPoints.FIELD_MAX_HEIGHT * DataPoints.BLOCK_HEIGHT
        });
        /**
         * Create dom Objects
         */
        GUI.pushParent(domObjectsContainer);
        for (let y = -DataPoints.FIELD_MAX_HEIGHT; y < DataPoints.FIELD_MAX_HEIGHT; y++) {
            domObjects[y] = [];
            for (let x = 0; x < DataPoints.FIELD_MAX_WIDTH; x++) {
                dom = GUI.createDom(undefined, {
                    fieldX: x,
                    fieldY: y,
                    x: x * DataPoints.BLOCK_WIDTH,
                    y: y * DataPoints.BLOCK_HEIGHT,
                    backgroundImage: '/images/field-none.png',
                    animTracks: [
                        [
                            {type: GUI.ANIM_TYPE_MOVE, vX: 0, vY: 2, duration: 23, callback: this.onAnimFinish}
                        ]
                    ]
                });
                dom.bind(GUI.EVENT_MOUSE_CLICK, onGemClick, dom);
                dom.bind(GUI.EVENT_MOUSE_MOUSE_DOWN, onGemMouseDown, dom);
                dom.bind(GUI.EVENT_MOUSE_MOUSE_TOUCH_START, onGemTouchStart, dom);
                dom.bind(GUI.EVENT_MOUSE_MOUSE_TOUCH_END, onGemTouchEnd, dom);
                dom.bind(GUI.EVENT_MOUSE_MOUSE_UP, onGemMouseUp, dom);
                dom.bind(GUI.EVENT_MOUSE_OVER, onGemMouseOver, dom);
                domObjects[y][x] = dom;
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
        gemTouched = this;
    };

    let onGemTouchEnd = function (event) {
        try {
            event.stopPropagation();
            let changedTouch = event.changedTouches[0];
            let elem = document.elementFromPoint(changedTouch.clientX, changedTouch.clientY);

            if (gemTouched) {
                gemAct(gemTouched);
                gemAct(elem.__dom);
                gemTouched = null;
            }
        } catch (e) {
            gemTouched = null;
        }
    };

    let onGemClick = function () {
        gemAct(this);
    };

    /**
     * Обработка дейтсвия с камнем, при клике например
     * или другом любом действием аналогичным клику.
     * @param gem
     */
    let gemAct = function (gem) {

        if (lock) return;
        if (animBlock) return;
        if (randomObjects.indexOf(field[gem.fieldY][gem.fieldX]) === -1) {
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
                    animType = 2;
                    animavx = +1;
                    animavy = 0;
                }
                if (gemA.fieldX > gemB.fieldX) {
                    animType = 2;
                    animavx = -1;
                    animavy = 0;
                }
                if (gemA.fieldY < gemB.fieldY) {
                    animType = 2;
                    animavx = 0;
                    animavy = +1;
                }
                if (gemA.fieldY > gemB.fieldY) {
                    animType = 2;
                    animavx = 0;
                    animavy = -1;
                }
                if (mayExchange) {
                    self.exchangeGems(gemA, gemB);
                    animExchangeHalf = true;
                    self.onTurnUse();
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
        console.log('d');
        console.log(this);
        gemMouseDown = this;
        // 1 - при mousedown - ждём перехода в соседнию
        // 2 - если перешли - вызываем onclick дважды
    };

    let onGemMouseUp = function () {
        console.log('u');
        gemMouseDown = null;
        // 1 - при mousedown - ждём перехода в соседнию
        // 2 - если перешли - вызываем onclick дважды
    };

    let onGemMouseOver = function () {
        if (gemMouseDown) {
            gemAct(gemMouseDown);
            gemAct(this);
            gemMouseDown = null;
            console.log(1);
        } else {
            console.log(2);
        }
    };

    /**
     * Покажем картинку.
     */
    this.show = function () {
        if (showed == true) return;
        showed = true;
        domBackground.show();
        domObjectsContainer.show();
        for (let y = 0; y < fieldHeight; y++) {
            for (let x = 0; x < fieldWidth; x++) {
                domCells[y][x].show();
            }
        }
        for (let y = -fieldHeight; y < fieldHeight; y++) {
            for (let x = 0; x < fieldWidth; x++) {
                domObjects[y][x].show();
            }
        }
        self.redraw();
    };

    /**
     * Спрячем картинку.
     */
    this.hide = function () {
        if (showed == false) return;
        showed = false;
        domBackground.hide();
        domObjectsContainer.hide();
        for (let y = 0; y < DataPoints.FIELD_MAX_HEIGHT; y++) {
            for (let x = 0; x < DataPoints.FIELD_MAX_WIDTH; x++) {
                domCells[y][x].hide();
            }
        }
        for (let y = -DataPoints.FIELD_MAX_HEIGHT; y < DataPoints.FIELD_MAX_HEIGHT; y++) {
            for (let x = 0; x < DataPoints.FIELD_MAX_WIDTH; x++) {
                domObjects[y][x].hide();
            }
        }
    };

    /**
     * Перерисуем картинку.
     */
    this.redraw = function (skipAnimCheck) {
        if (!showed) return;
        if (animBlock && !skipAnimCheck) return;
        self.x = self.centerX - DataPoints.BLOCK_WIDTH * Math.floor(fieldWidth / 2);
        self.y = self.centerY - DataPoints.BLOCK_HEIGHT * Math.floor(fieldHeight / 2);
        domBackground.redraw();
        domObjectsContainer.redraw();
        domObjectsContainer.x = self.x;
        domObjectsContainer.y = self.y;
        for (let y = 0; y < fieldHeight; y++) {
            for (let x = 0; x < fieldWidth; x++) {
                if (field[y][x] === DataPoints.OBJECT_NONE) {
                    domCells[y][x].hide();
                } else {
                    domCells[y][x].x = self.x + x * DataPoints.BLOCK_WIDTH;
                    domCells[y][x].y = self.y + y * DataPoints.BLOCK_HEIGHT;
                    domCells[y][x].show();
                    domCells[y][x].redraw();
                }
            }
        }
        if (field) {
            for (let y = -fieldHeight; y < fieldHeight; y++) {
                for (let x = 0; x < fieldWidth; x++) {
                    if (field[y][x] === DataPoints.OBJECT_NONE) {
                        domObjects[y][x].hide();
                    } else {
                        domObjects[y][x].backgroundImage = DataPoints.objectImages[field[y][x]];
                        domObjects[y][x].y = y * DataPoints.BLOCK_HEIGHT;
                        domObjects[y][x].x = x * DataPoints.BLOCK_WIDTH;
                        domObjects[y][x].show();
                        domObjects[y][x].redraw();
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
    this.setField = function (newField) {
        field = [];
        fieldHeight = newField.length;
        fieldWidth = newField[0].length;
        for (let y = 0; y < fieldHeight; y++) {
            field[y] = [];
            for (let x = 0; x < fieldWidth; x++) {
                field[y][x] = newField[y][x];
            }
        }
        for (let y = -fieldHeight; y < 0; y++) {
            field[y] = [];
            for (let x = 0; x < fieldWidth; x++) {
                field[y][x] = DataPoints.OBJECT_RANDOM;
            }
        }
        this.fillRandom();
        this.fillReserved();
        this.redraw();
    };

    this.fillRandom = function () {
        for (let y = -fieldHeight; y < fieldHeight; y++) {
            for (let x = 0; x < fieldWidth; x++) {
                if (field[y][x] == DataPoints.OBJECT_RANDOM) {
                    field[y][x] = randomObjects[Math.floor(Math.random() * randomObjects.length)];
                }
            }
        }
        this.redraw();
    };

    this.fillReserved = function () {
        for (let y = -fieldHeight; y < 0; y++) {
            for (let x = 0; x < fieldWidth; x++) {

                field[y][x] = randomObjects[Math.floor(Math.random() * randomObjects.length)];

            }
        }
        this.redraw();
    };

    this.fallDown = function (nextStep) {
        let anyFound;
        self.redraw(true); // set coords
        if (animBlock && !nextStep) return;
        animObjects = [];
        animCounter = 0;
        anyFound = false;

        for (let y = fieldHeight - 1; y > -fieldHeight; y--) {
            for (let x = 0; x < fieldWidth; x++) {
                if (field[y][x] == DataPoints.OBJECT_EMPTY) {
                    if (fallDownObjects.indexOf(field[y - 1][x]) != -1) {
                        anyFound = true;
                        // exchange
                        field[y][x] = field[y - 1][x];
                        field[y - 1][x] = DataPoints.OBJECT_EMPTY;
                        animObjects.push(domObjects[y - 1][x]);
                    }
                }
            }
        }
        if (anyFound) {
            animType = 1;
            animBlock = true;
        } else {
            animType = 0;
            animBlock = false;
            this.fillReserved();
            this.destroyLines();
            this.redraw();
        }
    };

    this.destroyLines = function () {
        let lines;
        lines = this.findLines();
        // destory lines
        let p;
        let anyDestroy;
        anyDestroy = false;
        for (let i in lines) {
            for (let c in lines[i].coords) {
                p = lines[i].coords[c];
                field[p.y][p.x] = DataPoints.OBJECT_EMPTY;
            }
            anyDestroy = true;
            self.onDestroyLine(lines[i]);
        }
        //@todo animate it
        if (anyDestroy) {
            setTimeout(function () {
                self.fallDown();
            }, 500);
        }
        this.redraw();
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
        startId = field[y][x];
        if (fallDownObjects.indexOf(startId) == -1) return false;

        line = {
            coords: [],
            gemId: startId
        };
        if (orientation == 1) {
            for (let offset = 0; offset < 5; offset++) {
                if (y >= fieldHeight) continue;
                if (x + offset >= fieldWidth) continue;
                if (field[y][x + offset] == startId) {
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
                if (field[y + offset][x] == startId) {
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

        if (!animBlock) return;
        switch (animType) {
            case 1:// falldown
                animCounter++;
                for (let i in animObjects) {
                    dom = animObjects[i];
                    dom.y += 15;
                    dom.redraw();
                }
                if (animCounter == 3) {
                    self.fallDown(true);
                }
                break;
            case 2: // a <-> b
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
                    self.destroyLines();
                }
                break;
        }
    };


    this.exchangeGems = function (gemA, gemB) {
        let tmp;
        tmp = field[gemB.fieldY][gemB.fieldX];
        field[gemB.fieldY][gemB.fieldX] =
            field[gemA.fieldY][gemA.fieldX];
        field[gemA.fieldY][gemA.fieldX] = tmp;
    };

    this.lineCrossing = function (lines, x, y) {
        for (let i in lines) {
            for (let n in lines[i].coords) {
                if (x == lines[i].coords[n].x &&
                    y == lines[i].coords[n].y) {
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