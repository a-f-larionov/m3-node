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
        domLightningDestroy = null,
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

    let domContainer = null;
    let maskDoms = [],
        gemDoms = [],
        specDoms = [];
    let specDomLimit = 150;

    let animType = null,
        animBlock = false,
        animObjects = [],
        animCounter = 0,
        animExchangeHalf = false,
        animavx, animavy
    ;

    let visibleWidth = 0,
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
        LogicField.eachCell(function (x, y) {
            if (!maskDoms[x]) maskDoms[x] = [];
            maskDoms[x][y] = GUI.createDom(undefined, {
                opacity: 0.4,
            });

            if (!gemDoms[x]) gemDoms[x] = [];
            dom = GUI.createDom(undefined, {
                p: {x: x, y: y},
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

        for (let i = 0; i < specDomLimit; i++) {
            dom = GUI.createDom(undefined, {
                width: DataPoints.BLOCK_WIDTH,
                height: DataPoints.BLOCK_HEIGHT
            });
            //GUI.bind(dom, GUI.EVENT_MOUSE_MOUSE_DOWN, onMouseDown, self);
            OnIdle.register(dom.animate);
            specDoms.push(dom);
        }

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

        domLightningDestroy = GUI.createDom(undefined, {
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
                            domLightningDestroy.animData = [{
                                frameN: 0,
                                counter: 0
                            }];
                            domLightningDestroy.animPlayed = false;
                            self.afterStuffUse();
                            animBlock = false;
                            animType = 0;
                            domLightningDestroy.hide();
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
                fieldAct(gemTouched.p);
                fieldAct(elem.__dom.p);
                gemTouched = null;
            }
        } catch (e) {
            gemTouched = null;
        }
    };

    let onGemClick = function () {
        fieldAct(this.p);
    };

    let fieldAct = function (p) {
        if (lock) return;
        if (animBlock) return;

        switch (domStuffMode) {
            case LogicStuff.STUFF_HUMMER:
                gemHummerAct(p);
                break;
            case LogicStuff.STUFF_SHUFFLE:
                gemShuffleAct(p);
                break;
            case LogicStuff.STUFF_LIGHTING:
                gemLightingAct(p);
                break;
        }
        gemChangeAct(p);
    };

    let gemHummerAct = function (p) {
        if (lock) return;
        if (animBlock) return;
        if (LogicField.isNotGem(p)) return;
        //@destroygem
        LogicField.setGem(p, DataObjects.OBJECT_HOLE);

        self.redraw();
        animBlock = true;
        animType = self.ANIM_TYPE_HUMMER_DESTROY;
        animCounter = 0;
        domHummerDestroy.animPlayed = true;
        domHummerDestroy.x = p.x * DataPoints.BLOCK_WIDTH - (GUI.getImageWidth('/images/anim-hd-1.png') - DataPoints.BLOCK_WIDTH) / 2;
        domHummerDestroy.y = p.y * DataPoints.BLOCK_HEIGHT - (GUI.getImageHeight('/images/anim-hd-1.png') - DataPoints.BLOCK_HEIGHT) / 2;
        domHummerDestroy.show();
        domHummerDestroy.redraw();
        self.redraw();
    };

    let gemShuffleAct = function () {
        if (lock) return;
        if (animBlock) return;

        funcShuffleField();
        /** Еще попытки, если не получилось */
        for (let i = 0; i < 500; i++) {
            if (LogicField.findLines().length) break;
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
        let p1, p2;
        LogicField.eachCell(function (x1, y1) {
            p1 = {x: x1, y: y1};
            p2 = {
                x: Math.floor(Math.random() * DataPoints.FIELD_MAX_WIDTH),
                y: Math.floor(Math.random() * DataPoints.FIELD_MAX_HEIGHT)
            };
            if (
                LogicField.isVisilbe(p1) && LogicField.isGem(p1) &&
                LogicField.isVisilbe(p2) && LogicField.isGem(p2)
            ) {
                LogicField.exchangeGems({x: x1, y: y1}, p2)
            }
        });
    };

    let gemLightingAct = function (p) {
        if (lock) return;
        if (animBlock) return;
        if (LogicField.isNotGem(p)) return;
        for (let x = 0; x < DataPoints.FIELD_MAX_WIDTH; x++) {
            p.x = x;
            if (LogicField.isGem(p)) {
                //@destroy
                LogicField.setGem(p, DataObjects.OBJECT_HOLE);
            }
        }
        self.redraw();
        animBlock = true;
        animType = self.ANIM_TYPE_LIGHTNING_HORIZONTAL_DESTROY;
        animCounter = 0;
        domLightningDestroy.animPlayed = true;
        let leftX = Infinity, rightX = -Infinity;
        /** Получить длину текущей линии */
        for (let x = 0; x < DataPoints.FIELD_MAX_WIDTH; x++) {
            p.x = x;
            if (LogicField.isVisilbe(p)) {
                leftX = Math.min(leftX, x);
                rightX = Math.max(rightX, x);
            }
        }
        domLightningDestroy.x = leftX * DataPoints.BLOCK_WIDTH;
        domLightningDestroy.y = p.y * DataPoints.BLOCK_HEIGHT - (GUI.getImageHeight('/images/anim-light-1.png') - DataPoints.BLOCK_HEIGHT) / 2;
        domLightningDestroy.width = (rightX - leftX + 1) * DataPoints.BLOCK_WIDTH;
        domLightningDestroy.show();
        domLightningDestroy.redraw();
        self.redraw();
    };

    /**
     * Обработка дейтсвия с камнем, при клике например
     * или другом любом действием аналогичным клику.
     * @param dom {Object}
     */
    let gemChangeAct = function (p) {
        let mayLineDestroy,
            lines;
        if (lock) return;
        if (animBlock) return;

        if (LogicField.isNotGem(p)) {
            return;
        }

        if (!gemA || !LogicField.isNear(gemA, p)) {
            gemA = p;
            domA = gemDoms[p.x][p.y];
            self.redraw();
            return;
        }

        domFrame.hide();
        gemB = p;
        domB = gemDoms[p.x][p.y];

        animBlock = true;

        LogicField.exchangeGems(gemA, gemB);
        lines = LogicField.findLines();
        mayLineDestroy =
            LogicField.lineCrossing(lines, gemA.x, gemA.y)
            | LogicField.lineCrossing(lines, gemB.x, gemB.y);
        LogicField.exchangeGems(gemA, gemB);

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
            LogicField.exchangeGems(gemA, gemB);
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
            fieldAct(gemMouseDown.p);
            fieldAct(this.p);
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
        LogicField.eachCell(function (x, y) {
            maskDoms[x][y].show();
            gemDoms[x][y].show();
        });
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
        LogicField.eachCell(function (x, y) {
            maskDoms[x][y].hide();
            gemDoms[x][y].hide();
        });
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

        let specIndex = 0;
        LogicField.eachCell(function (x, y, maskId, gemId, specId) {
            let maskDom, gemDom;
            maskDom = maskDoms[x][y];
            gemDom = gemDoms[x][y];

            /** Layer.mask redraw */
            switch (maskId) {
                case DataObjects.OBJECT_VISIBLE:
                    maskId = DataObjects.OBJECT_CELL;
                default:
                    maskDom.x = x * DataPoints.BLOCK_WIDTH;
                    maskDom.y = y * DataPoints.BLOCK_HEIGHT;
                    maskDom.backgroundImage = DataPoints.objectImages[maskId];
                    maskDom.show();
                    maskDom.redraw();
                    break;
                case DataObjects.OBJECT_INVISIBLE:
                case undefined:
                    maskDom.hide();
                    break;
            }

            /** Layer.gems redraw */
            if (LogicField.isGem({x: x, y: y}) &&
                LogicField.isVisilbe({x: x, y: y})) {
                gemDom.opacity = '';
                gemDom.backgroundImage = DataPoints.objectImages[gemId];
                gemDom.y = y * DataPoints.BLOCK_HEIGHT;
                gemDom.x = x * DataPoints.BLOCK_WIDTH;
                gemDom.height = DataPoints.BLOCK_HEIGHT;
                gemDom.backgroundPositionY = null;
                gemDom.show();
                gemDom.redraw();
            } else {
                gemDom.hide();
            }

            window.jkl = specDoms;
            /** Specials layers **/
            if (specId) {
                switch (specId) {
                    case DataObjects.OBJECT_LIGHTNING_VERTICAL:
                    case DataObjects.OBJECT_LIGHTNING_HORIZONTAL:
                    case DataObjects.OBJECT_LIGHTNING_CROSS:
                        /**
                         * 1 - взять свободный дом
                         * 2 - присвоить картинкиу\анимацию
                         */
                        let dom = specDoms[specIndex];
                        if (dom.specId !== specId || dom.x !== x * DataPoints.BLOCK_WIDTH || dom.y !== y * DataPoints.BLOCK_HEIGHT) {
                            console.log('set:', specId);
                            dom.specId = specId;
                            dom.opacity = 0.88;
                            dom.x = x * DataPoints.BLOCK_WIDTH;
                            dom.y = y * DataPoints.BLOCK_HEIGHT;
                            dom.animPlayed = true;
                            dom.animTracks = GUI.copyAnimTracks(DataPoints.objectAnims[specId]);
                            GUI.updateAnimTracks(dom);
                            dom.show();
                        }
                        break;
                    default:
                        specIndex--;
                        break;
                }
                specIndex++;
            }
        });

        /** Спрячем не используемые специальные домы */
        for (let i = specIndex; i < specDomLimit; i++) {
            specDoms[i].hide();
        }

        if (gemA && !animBlock) {
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

        let copyLayer = function (source, callback) {
            let out;
            out = [];
            source.forEach(function (row, x) {
                out[x] = [];
                row.forEach(function (value, y) {
                    out[x][y] = callback ? callback(value) : value;
                });
            });
            return out;
        };

        LogicField.setLayers(
            copyLayer(layers.mask),
            copyLayer(layers.gems, function (value) {
                if (value === DataObjects.OBJECT_RANDOM) return LogicField.getRandomGemId();
                return value;
            }),
            copyLayer(layers.special)
        );

        /**
         * Взять самый левый из всех слоёв
         */
        /**
         * Corners schema
         * a____
         * \    \
         * \____b
         */
        let aCorner, bCorner;
        aCorner = {x: Infinity, y: Infinity};
        bCorner = {x: -Infinity, y: -Infinity};
        LogicField.eachCell(function (x, y) {
            if (LogicField.isVisilbe({x: x, y: y})) {
                aCorner.x = Math.min(aCorner.x, x);
                aCorner.y = Math.min(aCorner.y, y);
                bCorner.x = Math.max(bCorner.x, x);
                bCorner.y = Math.max(bCorner.y, y);
            }
        });
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
                let allTurns = LogicField.countTurns();
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
        LogicField.eachCell(function (x, y, maskId, gemId, specId) {
            if (specId === DataObjects.OBJECT_EMITTER &&
                LogicField.isHole({x: x, y: y})
            ) {
                return true;
            }
        });
        return false;
    };

    this.processSpecialLayer = function () {
        LogicField.eachCell(function (x, y, maskId, gemId, specId) {
            if (specId === DataObjects.OBJECT_EMITTER &&
                LogicField.isHole({x: x, y: y})
            ) {
                LogicField.setGem({x: x, y: y}, LogicField.getRandomGemId());
                gemDoms[x][y].height = DataPoints.BLOCK_HEIGHT;
            }
        });
        self.run();
    };

    this.hasFall = function () {
        let out = false;
        LogicField.eachCell(function (x, y) {
            if (LogicField.mayFall(x, y + 1)) out = true;
        });
        return out;
    };

    this.fall = function () {
        if (animBlock) return;
        self.redraw(); // reset coords and other states
        animObjects = [];
        animCounter = 0;

        LogicField.eachCell(function (x, y) {
            let dom;
            y = DataPoints.FIELD_MAX_HEIGHT - y;

            if (!LogicField.mayFall(x, y)) return;

            dom = gemDoms[x][y - 1];
            dom.mode = '';
            // if dom now on NONE and below IS NOT NONE, set flag - showUp
            // if dom now is NOT NONE and below IS NONE, set flag hideDown

            if (LogicField.isVisilbe({x: x, y: y - 1}) && !LogicField.isVisilbe({x: x, y: y})
            ) dom.mode = 'tohide';

            if (!LogicField.isVisilbe({x: x, y: y - 1}) && LogicField.isVisilbe({x: x, y: y})
            ) {
                dom.mode = 'toshow';
                dom.backgroundImage = DataPoints.objectImages[LogicField.getGemId({x: x, y: y - 1})];
                // перерисовка backgroundPositionY это хитрый хак и костыль :)
                dom.backgroundPositionY = DataPoints.BLOCK_HEIGHT;
                dom.height = 0;
                dom.y = y * DataPoints.BLOCK_HEIGHT;
                dom.x = x * DataPoints.BLOCK_WIDTH;
                dom.show();
            }
            /** Falling one gem */
            LogicField.exchangeGems({x: x, y: y}, {x: x, y: y - 1});
            animObjects.push(dom);
        });

        if (animObjects.length) {
            animType = self.ANIM_TYPE_FALL;
            animBlock = true;
        } else {
            self.run();
        }
    };

    this.hasDestroyLines = function () {
        let lines;
        lines = LogicField.findLines();
        return lines.length > 0;
    };

    /**
     * Уничтожение лений 3+ длинной.
     */
    this.destroyLines = function () {
        let lines;
        lines = LogicField.findLines();
        let p;
        if (lines.length)
            for (let i in lines) {
                for (let c in lines[i].coords) {
                    p = lines[i].coords[c];
                    //@destroy
                    LogicField.setGem({x: p.x, y: p.y}, DataObjects.OBJECT_HOLE);
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
            case self.ANIM_TYPE_HUMMER_DESTROY: /** Смотри domHummerDestroy.animTracks*/
            case self.ANIM_TYPE_SHUFFLE:    /** Смотри domLightningDestroy.animTracks */
            case self.ANIM_TYPE_LIGHTNING_HORIZONTAL_DESTROY:   /** Смотри domShuffleDestroy.animTracks */
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
}
;