/**
 * Элемент игрового поля.
 * @constructor
 */
ElementField = function () {
    let self = this;

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

    let fieldArray = null;
    let objectImages = {};
    objectImages[DataPoints.OBJECT_NONE] = '/images/field-none-2.png';
    objectImages[DataPoints.OBJECT_RANDOM] = '/images/field-none.png';
    objectImages[DataPoints.OBJECT_RED] = '/images/field-red.png';
    objectImages[DataPoints.OBJECT_GREEN] = '/images/field-green.png';
    objectImages[DataPoints.OBJECT_BLUE] = '/images/field-blue.png';
    objectImages[DataPoints.OBJECT_BLOCK] = '/images/field-block.png';

    let randomObjects = [
        DataPoints.OBJECT_RED,
        DataPoints.OBJECT_GREEN,
        DataPoints.OBJECT_BLUE
    ];

    let fallDownObjects = [
        DataPoints.OBJECT_RED,
        DataPoints.OBJECT_GREEN,
        DataPoints.OBJECT_BLUE
    ];

    let animType = null;
    let animBlock = false;
    let animObjects = [];
    let animCounter = 0;
    let animExchangeHalf = false;
    let animavx, animavy;

    let fieldWidth = 0;
    let fieldHeight = 0;

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
        for (let y = -1; y < DataPoints.FIELD_MAX_HEIGHT; y++) {
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
                dom.bind(GUI.EVENT_MOUSE_CLICK, function () {

                    if (animBlock)return;
                    if (randomObjects.indexOf(fieldArray[this.fieldY][this.fieldX]) == -1) {
                        return;
                    }
                    if (!gemA) {
                        gemA = this;
                    } else {
                        //if near
                        let isNear;
                        isNear = false;
                        if (gemA.fieldX == this.fieldX + 1 && gemA.fieldY == this.fieldY + 0) isNear = true;
                        if (gemA.fieldX == this.fieldX - 1 && gemA.fieldY == this.fieldY + 0) isNear = true;
                        if (gemA.fieldX == this.fieldX + 0 && gemA.fieldY == this.fieldY + 1) isNear = true;
                        if (gemA.fieldX == this.fieldX + 0 && gemA.fieldY == this.fieldY - 1) isNear = true;

                        if (isNear) {
                            domFrame.hide();
                            gemB = this;
                            animBlock = true;
                            let mayExchange = false;
                            if (gemA.fieldX < gemB.fieldX) {
                                animType = 2;
                                animavx = +10;
                                animavy = 0;
                            }
                            if (gemA.fieldX > gemB.fieldX) {
                                animType = 2;
                                animavx = -10;
                                animavy = 0;
                            }
                            if (gemA.fieldY < gemB.fieldY) {
                                animType = 2;
                                animavx = 0;
                                animavy = +10;
                            }
                            if (gemA.fieldY > gemB.fieldY) {
                                animType = 2;
                                animavx = 0;
                                animavy = -10;
                            }
                            if (mayExchange) {
                                let tmp;
                                tmp = fieldArray[gemB.fieldY][gemB.fieldX];
                                fieldArray[gemB.fieldY][gemB.fieldX] =
                                    fieldArray[gemA.fieldY][gemA.fieldX];
                                fieldArray[gemA.fieldY][gemA.fieldX] = tmp;
                                animExchangeHalf = true;
                            } else {
                                animExchangeHalf = false;
                            }
                            animCounter = 0;
                        } else {
                            gemA = this;
                        }
                    }
                    self.redraw();
                }, dom);
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
        for (let y = -1; y < fieldHeight; y++) {
            for (let x = 0; x < fieldWidth; x++) {
                domObjects[y][x].show();
            }
        }
        domFrame.show();
        domFrame.redraw();
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
        for (let y = -1; y < DataPoints.FIELD_MAX_HEIGHT; y++) {
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
        if (animBlock && !skipAnimCheck)return;
        self.x = self.centerX - DataPoints.BLOCK_WIDTH * Math.floor(fieldWidth / 2);
        self.y = self.centerY - DataPoints.BLOCK_HEIGHT * Math.floor(fieldHeight / 2);
        domBackground.redraw();
        domObjectsContainer.redraw();
        domObjectsContainer.x = self.x;
        domObjectsContainer.y = self.y;
        for (let y = 0; y < fieldHeight; y++) {
            for (let x = 0; x < fieldWidth; x++) {
                domCells[y][x].x = self.x + x * DataPoints.BLOCK_WIDTH;
                domCells[y][x].y = self.y + y * DataPoints.BLOCK_HEIGHT;
                domCells[y][x].redraw();
            }
        }
        if (fieldArray) {
            for (let y = -1; y < fieldHeight; y++) {
                for (let x = 0; x < fieldWidth; x++) {
                    domObjects[y][x].backgroundImage = objectImages[fieldArray[y][x]];
                    domObjects[y][x].y = y * DataPoints.BLOCK_HEIGHT;
                    domObjects[y][x].x = x * DataPoints.BLOCK_WIDTH;
                    domObjects[y][x].redraw();
                }
            }
        }
        if (gemA) {
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
     * @param field
     */
    this.setField = function (field) {
        fieldArray = [];
        fieldHeight = field.length;
        fieldWidth = field[0].length;
        for (let y = 0; y < fieldHeight; y++) {
            fieldArray[y] = [];
            for (let x = 0; x < fieldWidth; x++) {
                fieldArray[y][x] = field[y][x];
            }
        }
        fieldArray[-1] = [];
        for (let x = 0; x < fieldWidth; x++) {
            fieldArray[-1][x] = DataPoints.OBJECT_GREEN;
        }

        this.redraw();
    };

    this.fallDown = function (nextStep) {
        let anyFound;
        self.redraw(true); // set coords
        if (animBlock && !nextStep)return;
        animObjects = [];
        animCounter = 0;
        anyFound = false;
        for (let y = fieldHeight - 1; y >= 0; y--) {
            for (let x = 0; x < fieldWidth; x++) {
                if (fieldArray[y][x] == DataPoints.OBJECT_NONE) {
                    if (fallDownObjects.indexOf(fieldArray[y - 1][x]) != -1) {
                        anyFound = true;
                        // exchange
                        fieldArray[y][x] = fieldArray[y - 1][x];
                        fieldArray[y - 1][x] = DataPoints.OBJECT_NONE;
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
            this.redraw();
        }
    };

    this.randomField = function () {
        for (let y = -1; y < fieldHeight; y++) {
            for (let x = 0; x < fieldWidth; x++) {
                if (fieldArray[y][x] == DataPoints.OBJECT_RANDOM) {
                    fieldArray[y][x] = randomObjects[Math.floor(Math.random() * 3)];
                }
            }
        }
        this.redraw();
    };

    this.animate = function () {
        let dom;

        if (!animBlock)return;
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

                animCounter++;
                if (animCounter <= 5) {
                    gemA.x += animavx;
                    gemB.x -= animavx;
                    gemA.y += animavy;
                    gemB.y -= animavy;
                }
                if (!animExchangeHalf && animCounter > 5) {
                    gemA.x -= animavx;
                    gemB.x += animavx;
                    gemA.y -= animavy;
                    gemB.y += animavy;
                }
                gemA.redraw();
                gemB.redraw();
                if ((animExchangeHalf && animCounter == 5)
                    || animCounter == 10
                ) {
                    animBlock = false;
                    animType = 0;
                    gemA = null;
                    gemB = null;
                    self.redraw();
                }
                break;
        }
    };
};