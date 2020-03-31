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

    let turnsCounted = false;

    this.ANIM_TYPE_FALL = 1;
    this.ANIM_TYPE_EXCHANGE = 2;
    this.ANIM_TYPE_HUMMER_DESTROY = 3;
    this.ANIM_TYPE_LIGHTNING_HORIZONTAL_DESTROY = 4;
    this.ANIM_TYPE_SHUFFLE = 5;

    /** Рамка и все что связано */
    let gemA = null,
        gemB = null,
        domA = null,
        domB = null,
        domFrame = null
    ;

    let domHummerDestroy = null,
        domLightingDestroy = null,
        domShuffleDestroy = null
    ;

    let domStuffMode = null;

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

    let layerGems = null,
        layerMask = null,
        layerSpecials = null
    ;

    let domContainer = null;
    let maskDoms = [];
    let gemDoms = [];
    let specialsDoms = [];

    let animType = null,
        animBlock = false,
        animObjects = [],
        animCounter = 0,
        animExchangeHalf = false,
        animavx, animavy
    ;

    let fieldWidth = 0,
        fieldHeight = 0,
        visibleWidth = 0,
        visibleHeight = 0,
        visibleOffsetX = 0,
        visibleOffsetY = 0
    ;

    /**
     * Каллбек
     * @type {null}
     */
    this.onDestroyLine = null;
    /**
     * Каллбек
     * @type {null}
     */
    this.onFieldSilent = null;

    /**
     * Создадим дом и настроем его.
     */
    this.init = function () {
        let dom;

        domBackground = GUI.createDom(undefined, {});

        domContainer = GUI.createDom(undefined, {
            width: DataPoints.FIELD_MAX_WIDTH * DataPoints.BLOCK_WIDTH,
            height: DataPoints.FIELD_MAX_HEIGHT * DataPoints.BLOCK_HEIGHT
        });
        GUI.pushParent(domContainer);

        /**
         * Create mask layer cells
         */
        LogicField.eachLayerMask(function (x, y) {
            if (!maskDoms[x]) maskDoms[x] = [];
            maskDoms[x][y] = GUI.createDom(undefined, {
                opacity: 0.4,
            });

            if (!gemDoms[x]) gemDoms[x] = [];
            dom = GUI.createDom(undefined, {
                fieldX: x, fieldY: y,
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
            gemDoms[x][y] = dom;
        });

        domFrame = GUI.createDom(undefined, {
            x: self.x, y: self.y,
            width: DataPoints.BLOCK_WIDTH,
            height: DataPoints.BLOCK_HEIGHT,
            backgroundImage: '/images/field-frame.png'
        });

        domHummerDestroy = GUI.createDom(undefined, {
            x: 30, y: 10,
            backgroundImage: '/images/anim-hd-1.png',
            animPlayed: false,
            animTracks: [
                [
                    {
                        type: GUI.ANIM_TYPE_MOVIE,
                        images: [
                            '/images/anim-hd-1.png',
                            '/images/anim-hd-2.png',
                            '/images/anim-hd-3.png',
                            '/images/anim-hd-4.png',
                            '/images/anim-hd-5.png',
                            '/images/anim-hd-6.png',
                            '/images/anim-hd-7.png',
                            '/images/anim-hd-8.png',
                            '/images/anim-hd-9.png',
                            '/images/anim-hd-10.png',
                            '/images/anim-hd-11.png',
                            '/images/anim-hd-12.png',
                            '/images/anim-hd-13.png',
                            '/images/anim-hd-14.png',
                            '/images/anim-hd-15.png',
                        ],
                        duration: 15,
                        callback: function () {
                            domHummerDestroy.animData = [{
                                frameN: 0,
                                counter: 0
                            }];
                            domHummerDestroy.animPlayed = false;
                            self.afterStuffUse();
                            animBlock = false;
                            animType = 0;
                            domHummerDestroy.hide();
                            self.run();
                        }
                    },
                ]
            ]
        });

        domLightingDestroy = GUI.createDom(undefined, {
            x: 30, y: 10, height: GUI.getImageHeight('/images/anim-light-1.png'),
            backgroundImage: '/images/anim-light-1.png',
            animPlayed: false,
            animTracks: [
                [
                    {
                        type: GUI.ANIM_TYPE_MOVIE,
                        images: [
                            '/images/anim-light-1.png',
                            '/images/anim-light-1.png',
                            '/images/anim-light-1.png',
                            '/images/anim-light-2.png',
                            '/images/anim-light-2.png',
                            '/images/anim-light-2.png',
                            '/images/anim-light-3.png',
                            '/images/anim-light-3.png',
                            '/images/anim-light-3.png',
                            '/images/anim-light-4.png',
                            '/images/anim-light-4.png',
                            '/images/anim-light-4.png',
                            '/images/anim-light-5.png',
                            '/images/anim-light-5.png',
                            '/images/anim-light-5.png',
                        ],
                        duration: 15,
                        callback: function () {
                            domLightingDestroy.animData = [{
                                frameN: 0,
                                counter: 0
                            }];
                            domLightingDestroy.animPlayed = false;
                            self.afterStuffUse();
                            animBlock = false;
                            animType = 0;
                            domLightingDestroy.hide();
                            self.run();
                        }
                    },
                ]
            ]
        });

        GUI.popParent();

        domShuffleDestroy = GUI.createDom(undefined, {
            x: self.centerX - GUI.getImageWidth('/images/anim-shuffle-1.png') / 2,
            y: self.centerY - GUI.getImageHeight('/images/anim-shuffle-1.png') / 2,
            backgroundImage: '/images/anim-shuffle-1.png',
            opacity: 0.7,
            animPlayed: false,
            animTracks: [
                [
                    {
                        type: GUI.ANIM_TYPE_ROTATE,
                        angle: 12,
                        duration: 20,
                        callback: function () {
                            domShuffleDestroy.animData = [{
                                frameN: 0,
                                counter: 0
                            }];
                            domShuffleDestroy.animPlayed = false;
                            self.afterStuffUse();
                            animBlock = false;
                            animType = 0;
                            domShuffleDestroy.hide();
                            self.run();
                        }
                    },
                ]
            ]
        });

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
        if (lock) return;
        if (animBlock) return;

        switch (domStuffMode) {
            case LogicStuff.STUFF_HUMMER:
                gemHummerAct(gemDoms[x][y]);
                break;
            case LogicStuff.STUFF_SHUFFLE:
                gemShuffleAct(gemDoms[x][y]);
                break;
            case LogicStuff.STUFF_LIGHTING:
                gemLightingAct(gemDoms[x][y]);
                break;
        }
        gemChangeAct(gemDoms[x][y]);
    };

    let gemHummerAct = function (gem) {
        if (lock) return;
        if (animBlock) return;
        if (LogicField.isNotGem(layerGems[gem.fieldY][gem.fieldX])) {
            return;
        }
        layerGems[gem.fieldY][gem.fieldX] = DataObjects.OBJECT_EMPTY;
        self.redraw();
        animBlock = true;
        animType = self.ANIM_TYPE_HUMMER_DESTROY;
        animCounter = 0;
        domHummerDestroy.animPlayed = true;
        domHummerDestroy.x = gem.fieldX * DataPoints.BLOCK_WIDTH - (GUI.getImageWidth('/images/anim-hd-1.png') - DataPoints.BLOCK_WIDTH) / 2;
        domHummerDestroy.y = gem.fieldY * DataPoints.BLOCK_HEIGHT - (GUI.getImageHeight('/images/anim-hd-1.png') - DataPoints.BLOCK_HEIGHT) / 2;
        domHummerDestroy.show();
        domHummerDestroy.redraw();
        self.redraw();
    };

    let gemShuffleAct = function (gem) {
        if (lock) return;
        if (animBlock) return;

        funcShuffleField();
        /** Еще попытки, если не получилось */
        for (let i = 0; i < 500; i++) {
            if (LogicField.findLines(fieldHeight, fieldWidth, layerMask, layerGems).length) break;
            funcShuffleField();
        }

        animBlock = true;
        animType = self.ANIM_TYPE_SHUFFLE;
        animCounter = 0;
        domShuffleDestroy.animPlayed = true;
        domShuffleDestroy.show();
        domShuffleDestroy.redraw();
        self.redraw();
    };

    let funcShuffleField = function () {
        let tmp, x2, y2;
        for (let y1 = 0; y1 < fieldHeight; y1++) {
            for (let x1 = 0; x1 < fieldWidth; x1++) {
                if (LogicField.isNotGem(layerGems[y1][x1])) {
                    continue;
                }
                x2 = Math.floor(Math.random() * fieldWidth);
                y2 = Math.floor(Math.random() * fieldHeight);
                if (LogicField.isNotGem(layerGems[y2][x2])) {
                    continue;
                }
                tmp = layerGems[y2][x2];
                layerGems[y2][x2] = layerGems[y1][x1];
                layerGems[y1][x1] = tmp;
            }
        }
    };

    let gemLightingAct = function (gem) {
        if (lock) return;
        if (animBlock) return;
        if (LogicField.isNotGem(layerGems[gem.fieldY][gem.fieldX])) {
            return;
        }
        for (let x = 0; x < fieldWidth; x++) {
            if (LogicField.isGem(layerGems[gem.fieldY][x])) {
                layerGems[gem.fieldY][x] = DataObjects.OBJECT_EMPTY;
            }
        }
        self.redraw();
        animBlock = true;
        animType = self.ANIM_TYPE_LIGHTNING_HORIZONTAL_DESTROY;
        animCounter = 0;
        domLightingDestroy.animPlayed = true;
        let leftX = Infinity, rightX = -Infinity;
        /** Получить длину текущей линии */
        for (let x = 0; x < fieldWidth; x++) {
            if (layerMask[gem.fieldY][x] !== DataObjects.OBJECT_NONE) {
                leftX = Math.min(leftX, x);
                rightX = Math.max(rightX, x);
            }
        }
        domLightingDestroy.x = leftX * DataPoints.BLOCK_WIDTH;
        domLightingDestroy.y = gem.fieldY * DataPoints.BLOCK_HEIGHT - (GUI.getImageHeight('/images/anim-light-1.png') - DataPoints.BLOCK_HEIGHT) / 2;
        domLightingDestroy.width = (rightX - leftX + 1) * DataPoints.BLOCK_WIDTH;
        domLightingDestroy.show();
        domLightingDestroy.redraw();
        self.redraw();
    };

    /**
     * Обработка дейтсвия с камнем, при клике например
     * или другом любом действием аналогичным клику.
     * @param dom {Object}
     */
    let gemChangeAct = function (dom) {
        let gem,
            mayLineDestroy,
            lines;
        if (lock) return;
        if (animBlock) return;
        gem = {
            x: dom.fieldX,
            y: dom.fieldY
        };

        if (LogicField.isNotGem(layerGems[gem.y][gem.x])) {
            return;
        }

        if (!gemA || !LogicField.isNear(gemA, gem)) {
            gemA = gem;
            domA = dom;
            self.redraw();
            return;
        }

        domFrame.hide();
        gemB = gem;
        domB = dom;

        animBlock = true;

        LogicField.exchangeGems(gemA, gemB, layerGems);
        lines = LogicField.findLines(fieldHeight, fieldWidth, layerMask, layerGems);
        mayLineDestroy =
            LogicField.lineCrossing(lines, gemA.x, gemA.y)
            | LogicField.lineCrossing(lines, gemB.x, gemB.y);
        LogicField.exchangeGems(gemA, gemB, layerGems);

        if (gemA.x < gemB.x) {
            animType = self.ANIM_TYPE_EXCHANGE;
            animavx = +1;
            animavy = 0;
        }
        if (gemA.x > gemB.x) {
            animType = self.ANIM_TYPE_EXCHANGE;
            animavx = -1;
            animavy = 0;
        }
        if (gemA.y < gemB.y) {
            animType = self.ANIM_TYPE_EXCHANGE;
            animavx = 0;
            animavy = +1;
        }
        if (gemA.y > gemB.y) {
            animType = self.ANIM_TYPE_EXCHANGE;
            animavx = 0;
            animavy = -1;
        }
        if (mayLineDestroy) {
            LogicField.exchangeGems(gemA, gemB, layerGems);
            animExchangeHalf = true;
            self.beforeTurnUse();
        } else {
            animExchangeHalf = false;
        }
        animCounter = 0;

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
        domContainer.show();
        for (let y = 0; y < fieldHeight; y++) {
            for (let x = 0; x < fieldWidth; x++) {
                maskDoms[x][y].show();
            }
        }
        for (let y = 0; y < fieldHeight; y++) {
            for (let x = 0; x < fieldWidth; x++) {
                gemDoms[x][y].show();
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
        domContainer.hide();
        for (let y = 0; y < DataPoints.FIELD_MAX_HEIGHT; y++) {
            for (let x = 0; x < DataPoints.FIELD_MAX_WIDTH; x++) {
                maskDoms[x][y].hide();
            }
        }
        for (let y = 0; y < DataPoints.FIELD_MAX_HEIGHT; y++) {
            for (let x = 0; x < DataPoints.FIELD_MAX_WIDTH; x++) {
                gemDoms[x][y].hide();
            }
        }
        domFrame.hide();
        domHummerDestroy.hide();
    };

    /**
     * Перерисуем картинку.
     */
    this.redraw = function () {
        if (!showed) return;
        if (animBlock) return;
        self.x = self.centerX - DataPoints.BLOCK_WIDTH / 2
            - (visibleWidth - 1) / 2 * DataPoints.BLOCK_WIDTH
            - visibleOffsetX * DataPoints.BLOCK_WIDTH
        ;
        self.y = self.centerY - DataPoints.BLOCK_HEIGHT / 2
            - (visibleHeight - 1) / 2 * DataPoints.BLOCK_HEIGHT
            - visibleOffsetY * DataPoints.BLOCK_HEIGHT
            + DataPoints.BLOCK_HEIGHT / 2 // выравнивание от панель
        ;
        domContainer.x = self.x;
        domContainer.y = self.y;
        domContainer.redraw();
        domBackground.redraw();

        LogicField.eachLayerMask(function (x, y, mask, gem) {

            /** Layer.mask redraw */
            switch (mask) {
                case DataObjects.OBJECT_EMPTY:
                    mask = DataObjects.OBJECT_CELL;
                default:
                    maskDoms[x][y].x = x * DataPoints.BLOCK_WIDTH;
                    maskDoms[x][y].y = y * DataPoints.BLOCK_HEIGHT;
                    maskDoms[x][y].backgroundImage = DataPoints.objectImages[mask];
                    maskDoms[x][y].show();
                    maskDoms[x][y].redraw();
                    break;
                case DataObjects.OBJECT_NONE:
                    maskDoms[x][y].hide();
                    break;
            }
        }, layerMask, layerGems);

        if (layerGems) {
            for (let y = 0; y < fieldHeight; y++) {
                for (let x = 0; x < fieldWidth; x++) {
                    if (LogicField.isGem({x: x, y: y}, layerGems) &&
                        LogicField.isVisilbe({x: x, y: y}, layerMask)) {
                        gemDoms[x][y].opacity = '';
                        gemDoms[x][y].backgroundImage = DataPoints.objectImages[layerGems[y][x]];
                        gemDoms[x][y].y = y * DataPoints.BLOCK_HEIGHT;
                        gemDoms[x][y].x = x * DataPoints.BLOCK_WIDTH;
                        gemDoms[x][y].height = DataPoints.BLOCK_HEIGHT;
                        gemDoms[x][y].backgroundPositionY = null;
                        gemDoms[x][y].show();
                        gemDoms[x][y].redraw();
                    } else {
                        gemDoms[x][y].hide();
                    }
                }
            }
        }
        if (gemA && !animBlock) {
            //@todo
            domFrame.x = domA.x;
            domFrame.y = domA.y;
            domFrame.show();
            domFrame.redraw();
        } else {
            domFrame.hide();
        }
    };

    /**
     * Set the field data.
     * @param layers {Object}
     */
    this.setLayers = function (layers) {
        layerMask = [];
        layerGems = [];
        layerSpecials = [];

        layers.gems.forEach(function (row, y) {
            layerGems[y] = [];
            row.forEach(function (cell, x) {
                if (cell === DataObjects.OBJECT_RANDOM) cell = LogicField.getRandomGemId();
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
            layerSpecials[y] = [];
            row.forEach(function (cell, x) {
                layerSpecials[y][x] = cell;
            });
        });

        /**
         * Взять самый левый из всех слоёв
         */
        fieldWidth = layers.gems[0].length;
        fieldHeight = layers.gems.length;
        /**
         * Corners schema
         * a____
         * \    \
         * \____b
         */
        let aCorner, bCorner;
        aCorner = {x: Infinity, y: Infinity};
        bCorner = {x: -Infinity, y: -Infinity};
        for (let y = 0; y < fieldHeight; y++) {
            for (let x = 0; x < fieldWidth; x++) {
                if (layers.mask[y][x] !== DataObjects.OBJECT_NONE) {
                    aCorner.x = Math.min(aCorner.x, x);
                    aCorner.y = Math.min(aCorner.y, y);
                    bCorner.x = Math.max(bCorner.x, x);
                    bCorner.y = Math.max(bCorner.y, y);
                }
            }
        }
        visibleWidth = bCorner.x - aCorner.x + 1;
        visibleHeight = bCorner.y - aCorner.y + 1;
        visibleOffsetX = aCorner.x;
        visibleOffsetY = aCorner.y;
        this.redraw();
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
                self.fall();
                break;
            case 2:
                runNext = 0;
                self.destroyLines();
                break;
        }

        if (self.isFieldSilent()) {
            if (!turnsCounted) {
                turnsCounted = true;
                let allTurns = LogicField.countTurns(layerMask, layerGems, fieldHeight, fieldWidth);
                if (allTurns.length === 0) {
                    gemShuffleAct();
                }
            }
            self.onFieldSilent();
        } else {
            turnsCounted = false;
        }
    };

    this.isFieldSilent = function () {
        return !(animBlock ||
            self.hasDestroyLines() ||
            self.hasFall() ||
            self.hasProcesSpecialLayer()
        );
    };

    this.hasProcesSpecialLayer = function () {
        layerSpecials.forEach(function (row, y) {
            row.forEach(function (cell, x) {
                //if emitter and empty layerGems, set random gem
                if (cell === DataObjects.OBJECT_EMITTER &&
                    layerGems[y][x] === DataObjects.OBJECT_EMPTY
                ) {
                    return true;
                }
            });
        });
        return false;
    };

    this.processSpecialLayer = function () {
        layerSpecials.forEach(function (row, y) {
            row.forEach(function (cell, x) {
                //if emitter and empty layerGems, set random gem
                if (cell === DataObjects.OBJECT_EMITTER &&
                    layerGems[y][x] === DataObjects.OBJECT_EMPTY
                ) {
                    layerGems[y][x] = LogicField.getRandomGemId();
                    gemDoms[x][y].height = DataPoints.BLOCK_HEIGHT;
                }
            });
        });
        self.run();
    };

    this.hasFall = function () {
        if (animObjects.length) return true;

        for (let y = fieldHeight - 1; y > 0; y--) {
            for (let x = 0; x < fieldWidth; x++) {
                if (LogicField.mayFall(x, y, layerGems)) {
                    return true;
                }
            }
        }
        return false;
    };

    this.fall = function () {
        if (animBlock) return;
        self.redraw(); // reset coords and other states
        animObjects = [];
        animCounter = 0;

        for (let y = fieldHeight - 1; y > 0; y--) {
            for (let x = 0; x < fieldWidth; x++) {
                let dom;
                if (LogicField.mayFall(x, y, layerGems)) {
                    dom = gemDoms[x][y - 1];
                    dom.mode = '';
                    // if dom now on NONE and below IS NOT NONE, set flag - showUp
                    // if dom now is NOT NONE and below IS NONE, set flag hideDown
                    if (layerMask[y - 1][x] === DataObjects.OBJECT_EMPTY &&
                        layerMask[y][x] !== DataObjects.OBJECT_EMPTY
                    ) dom.mode = 'tohide';

                    if (layerMask[y - 1][x] !== DataObjects.OBJECT_EMPTY &&
                        layerMask[y][x] === DataObjects.OBJECT_EMPTY
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
                    /** Falling one gem */
                    layerGems[y][x] = layerGems[y - 1][x];
                    layerGems[y - 1][x] = DataObjects.OBJECT_EMPTY;

                    animObjects.push(dom);
                }
            }
        }

        if (animObjects.length) {
            animType = self.ANIM_TYPE_FALL;
            animBlock = true;
        } else {
            self.run();
        }
    };

    this.hasDestroyLines = function () {
        let lines;
        lines = LogicField.findLines(fieldHeight, fieldWidth, layerMask, layerGems);
        return lines.length > 0;
    };

    /**
     * Уничтожение лений 3+ длинной.
     */
    this.destroyLines = function () {
        let lines;
        lines = LogicField.findLines(fieldHeight, fieldWidth, layerMask, layerGems);
        let p;
        if (lines.length)
            for (let i in lines) {
                for (let c in lines[i].coords) {
                    p = lines[i].coords[c];
                    layerGems[p.y][p.x] = DataObjects.OBJECT_EMPTY;
                }
                self.onDestroyLine(lines[i]);
            }
        this.redraw();

        setTimeout(function () {
            /** Animate here before run */
            self.run();
        }, 1);
    };

    this.animate = function () {
        let dom;
        if (lock) return;
        if (!animBlock) return;

        switch (animType) {
            case self.ANIM_TYPE_HUMMER_DESTROY:
                animCounter++;
                /** Смотри domHummerDestroy.animTracks*/
                break;
            case self.ANIM_TYPE_SHUFFLE:
                animCounter++;
                /** Смотри domLightingDestroy.animTracks */
                break;
            case self.ANIM_TYPE_LIGHTNING_HORIZONTAL_DESTROY:
                animCounter++;
                /** Смотри domShuffleDestroy.animTracks */
                break;
            case self.ANIM_TYPE_FALL:
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
                    domA.x += animavx * step;
                    domB.x -= animavx * step;
                    domA.y += animavy * step;
                    domB.y -= animavy * step;
                }
                if (!animExchangeHalf && animCounter > 50 / step) {
                    domA.x -= animavx * step;
                    domB.x += animavx * step;
                    domA.y -= animavy * step;
                    domB.y += animavy * step;
                }
                domA.redraw();
                domB.redraw();
                if ((animExchangeHalf && animCounter === 50 / step)
                    || animCounter === 50 / step * 2
                ) {
                    animBlock = false;
                    animType = 0;
                    gemA = gemB = domA = domB = null;
                    self.redraw();
                    self.run();
                }
                break;
        }
    };

    this.lock = function () {
        lock = true;
    };

    this.unlock = function () {
        lock = false;
    };

    this.setStuffMode = function (mode) {
        gemA = null;
        domA = null;
        domStuffMode = mode;
        self.redraw();
    };
};