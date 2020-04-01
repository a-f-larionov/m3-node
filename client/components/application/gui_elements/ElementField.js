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
    //@todo
    this.ANIM_TYPE_SHUFFLE = 5;

    /** Рамка и все что связано */
    let gemFramed = null,
        pB = null,
        domFrame = null
    ;

    let domHummerDestroy = null,
        domLightningDestroy = null,
        domShuffleDestroy = null
    ;

    let stuffMode = null;

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
        animCounter = 0
    ;

    let visibleWidth = 0,
        visibleHeight = 0,
        visibleOffsetX = 0,
        visibleOffsetY = 0
    ;

    /**
     * Каллбек
     * @type {function}
     */
    this.onDestroyLine = null;
    /**
     *
     * @type {function}
     */
    this.afterStuffUse = null;
    /**
     * Каллбек
     * @type {function}
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

        domContainer.bind(GUI.EVENT_MOUSE_CLICK, onGemClick, domContainer);
        domContainer.bind(GUI.EVENT_MOUSE_MOUSE_DOWN, onGemMouseDown, domContainer);
        domContainer.bind(GUI.EVENT_MOUSE_MOUSE_UP, onGemMouseUp, domContainer);
        domContainer.bind(GUI.EVENT_MOUSE_OVER, onGemMouseOver, domContainer);
        //@todo
        //domContainer.bind(GUI.EVENT_MOUSE_MOUSE_TOUCH_START, onGemTouchStart, domContainer);
        //domContainer.bind(GUI.EVENT_MOUSE_MOUSE_TOUCH_END, onGemTouchEnd, domContainer);
        /**
         * Create mask layer cells
         */
        Field.eachCell(function (x, y) {
            if (!maskDoms[x]) maskDoms[x] = [];
            maskDoms[x][y] = GUI.createDom(undefined, {
                opacity: 0.4,
            });
        });

        Field.eachCell(function (x, y) {
            if (!gemDoms[x]) gemDoms[x] = [];
            dom = GUI.createDom(undefined, {
                p: {x: x, y: y},
                height: DataPoints.BLOCK_HEIGHT,
                width: DataPoints.BLOCK_WIDTH,
                backgroundImage: '/images/field-none.png'
            });
            //dom.bind(GUI.EVENT_MOUSE_CLICK, onGemClick, dom);
            //dom.bind(GUI.EVENT_MOUSE_MOUSE_DOWN, onGemMouseDown, dom);
            //dom.bind(GUI.EVENT_MOUSE_MOUSE_TOUCH_START, onGemTouchStart, dom);
            //dom.bind(GUI.EVENT_MOUSE_MOUSE_TOUCH_END, onGemTouchEnd, dom);
            //dom.bind(GUI.EVENT_MOUSE_MOUSE_UP, onGemMouseUp, dom);
            //dom.bind(GUI.EVENT_MOUSE_OVER, onGemMouseOver, dom);
            gemDoms[x][y] = dom;
        });

        for (let i = 0; i < specDomLimit; i++) {
            dom = GUI.createDom(undefined, {
                width: DataPoints.BLOCK_WIDTH,
                height: DataPoints.BLOCK_HEIGHT
            });
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
                        duration: 15
                    },
                    {type: GUI.ANIM_TYPE_GOTO, pos: 0}
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
                        duration: 15
                    },
                    {type: GUI.ANIM_TYPE_GOTO, pos: 0}
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
                            return;
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

    let onGemTouchStart = function (event) {
        Sounds.play(Sounds.PATH_CHALK);
        gemTouched = pointFromEvent(event);
    };

    let onGemTouchEnd = function (event) {
        try {
            event.stopPropagation();
            let changedTouch = event.changedTouches[0];
            let elem = document.elementFromPoint(changedTouch.clientX, changedTouch.clientY);
            if (gemTouched) {
                //fieldAct(gemTouched);
                //fieldAct(pointFromEvent(event.changedTouches[0]));
                gemTouched = null;
            }
        } catch (e) {
            gemTouched = null;
        }
    };

    let pointFromEvent = function (event) {
        return {
            x: Math.floor((event.clientX - self.x) / DataPoints.BLOCK_WIDTH),
            y: Math.floor((event.clientY - self.y) / DataPoints.BLOCK_HEIGHT)
        }
    };

    let onGemClick = function (event) {
        fieldAct(pointFromEvent(event));
    };

    let fieldAct = function (p) {
        if (lock) return;
        if (animBlock) return;

        switch (stuffMode) {
            case LogicStuff.STUFF_HUMMER:
                gemHummerAct(p);
                break;
            case LogicStuff.STUFF_SHUFFLE:
                gemShuffleAct(p);
                break;
            case LogicStuff.STUFF_LIGHTING:
                gemLightingAct(p);
                break;
            default:
                gemChangeAct(p);
                break;
        }
    };

    let gemHummerAct = function (p) {
        if (lock || animBlock || Field.isNotGem(p)) return;
        self.afterStuffUse();
        self.destroyGem(p);
        animate(animHummerDestroy, p);
    };

    let gemShuffleAct = function () {
        if (lock) return;
        if (animBlock) return;

        funcShuffleField();
        /** Еще попытки, если не получилось */
        for (let i = 0; i < 500; i++) {
            if (Field.findLines().length) break;
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
        Field.eachCell(function (x1, y1) {
            p1 = {x: x1, y: y1};
            p2 = {
                x: Math.floor(Math.random() * DataPoints.FIELD_MAX_WIDTH),
                y: Math.floor(Math.random() * DataPoints.FIELD_MAX_HEIGHT)
            };
            if (
                Field.isVisilbe(p1) && Field.isGem(p1) &&
                Field.isVisilbe(p2) && Field.isGem(p2)
            ) {
                Field.exchangeGems({x: x1, y: y1}, p2)
            }
        });
    };

    let gemLightingAct = function (p, orientation) {
        if (!orientation) orientation = 'h';
        if (lock || animBlock || !Field.isVisilbe(p)) return;
        Field.destroyLine(p, orientation, self.destroyGem);
        self.afterStuffUse();
        self.redraw();
        if (orientation === 'c') {
            //animate(animLightning, p, 'v');
            animate(animLightning, p, 'h');
        } else {
            animate(animLightning, p, orientation);
        }
    };

    /**
     * Обработка дейтсвия с камнем, при клике например
     * или другом любом действием аналогичным клику.
     * @param gemB {Object}
     */
    let gemChangeAct = function (gemB) {
        let gemA = gemFramed;
        if (lock || animBlock || Field.isNotGem(gemB)) return;

        /** Set frame */
        if (!gemA || (gemA && !Field.isNear(gemA, gemB))) {
            gemFramed = gemB;
            self.redraw();
        }

        /** Near gems */
        if (gemA && Field.isNear(gemA, gemB)) {
            gemFramed = null;

            /** Change and back */
            if (!Field.isLinePossiblyDestroy(gemA, gemB)) {
                animate(animChangeAndBack, gemA, gemB, gemDoms);
            }

            /** Change and destroy */
            if (Field.isLinePossiblyDestroy(gemA, gemB)) {
                self.beforeTurnUse();
                Field.exchangeGems(gemA, gemB);
                animate(animChangeAndDestroy, gemA, gemB, gemDoms);
            }
        }
    };

    let gemMouseDown = null;

    let onGemMouseDown = function (event) {
        Sounds.play(Sounds.PATH_CHALK);
        gemMouseDown = pointFromEvent(event);
        // 1 - при mousedown - ждём перехода в соседнию
        // 2 - если перешли - вызываем onclick дважды
    };

    let onGemMouseUp = function () {
        gemMouseDown = null;
        // 1 - при mousedown - ждём перехода в соседнию
        // 2 - если перешли - вызываем onclick дважды
    };

    let onGemMouseOver = function (event) {
        if (gemMouseDown) {
            fieldAct(gemMouseDown);
            fieldAct(pointFromEvent(event));
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
        Field.eachCell(function (x, y) {
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
        Field.eachCell(function (x, y) {
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
        Field.eachCell(function (x, y, maskId, gemId, specId) {
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
            if (Field.isGem({x: x, y: y}) &&
                Field.isVisilbe({x: x, y: y})) {
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

        if (gemFramed) {
            domFrame.x = gemDoms[gemFramed.x][gemFramed.y].x;
            domFrame.y = gemDoms[gemFramed.x][gemFramed.y].y;
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

        Field.setLayers(
            copyLayer(layers.mask),
            copyLayer(layers.gems, function (value) {
                if (value === DataObjects.OBJECT_RANDOM) return Field.getRandomGemId();
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
        Field.eachCell(function (x, y) {
            if (Field.isVisilbe({x: x, y: y})) {
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
                let allTurns = Field.countTurns();
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
        Field.eachCell(function (x, y, maskId, gemId, specId) {
            if (specId === DataObjects.OBJECT_EMITTER &&
                Field.isHole({x: x, y: y})
            ) {
                return true;
            }
        });
        return false;
    };

    this.processSpecialLayer = function () {
        Field.eachCell(function (x, y, maskId, gemId, specId) {
            if (specId === DataObjects.OBJECT_EMITTER &&
                Field.isHole({x: x, y: y})
            ) {
                Field.setGem({x: x, y: y}, Field.getRandomGemId());
                gemDoms[x][y].height = DataPoints.BLOCK_HEIGHT;
            }
        });
        self.run();
    };

    this.hasFall = function () {
        let out = false;
        Field.eachCell(function (x, y) {
            if (Field.mayFall(x, y + 1)) out = true;
        });
        return out;
    };

    this.fall = function () {
        if (animBlock) return;
        self.redraw(); // reset coords and other states
        animObjects = [];
        animCounter = 0;

        Field.eachCell(function (x, y) {
            let dom;
            y = DataPoints.FIELD_MAX_HEIGHT - y;

            if (!Field.mayFall(x, y)) return;

            dom = gemDoms[x][y - 1];
            dom.mode = '';
            // if dom now on NONE and below IS NOT NONE, set flag - showUp
            // if dom now is NOT NONE and below IS NONE, set flag hideDown

            if (Field.isVisilbe({x: x, y: y - 1}) && !Field.isVisilbe({x: x, y: y})
            ) dom.mode = 'tohide';

            if (!Field.isVisilbe({x: x, y: y - 1}) && Field.isVisilbe({x: x, y: y})
            ) {
                dom.mode = 'toshow';
                dom.backgroundImage = DataPoints.objectImages[Field.getGemId({x: x, y: y - 1})];
                // перерисовка backgroundPositionY это хитрый хак и костыль :)
                dom.backgroundPositionY = DataPoints.BLOCK_HEIGHT;
                dom.height = 0;
                dom.y = y * DataPoints.BLOCK_HEIGHT;
                dom.x = x * DataPoints.BLOCK_WIDTH;
                dom.show();
            }
            /** Falling one gem */
            Field.exchangeGems({x: x, y: y}, {x: x, y: y - 1});
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
        lines = Field.findLines();
        return lines.length > 0;
    };

    /**
     * Уничтожение лений 3+ длинной.
     */
    this.destroyLines = function () {
        let lines, p;
        lines = Field.findLines();
        if (lines.length)
            for (let i in lines) {
                for (let c in lines[i].coords) {
                    p = lines[i].coords[c];
                    //@destroy
                    self.destroyGem({x: p.x, y: p.y});
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
            case self.ANIM_TYPE_SHUFFLE:    /** Смотри domLightningDestroy.animTracks */
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
        }
    };

    this.lock = function () {
        lock = true;
    };

    this.unlock = function () {
        lock = false;
    };

    this.setStuffMode = function (mode) {
        gemFramed = null;
        stuffMode = mode;
        self.redraw();
    };

    this.destroyGem = function (p) {
        Field.setGem(p, DataObjects.OBJECT_HOLE);
        if (Field.isLightningGem(p)) {
            gemLightingAct(p, Field.isLightningGem(p));
        }
    };

    let animate = function (animClass) {
        let args, animObj, counter;

        animBlock = true;

        counter = 0;
        animObj = new animClass();
        animObj.continue = true;
        animObj.gemDoms = gemDoms;
        animObj.domShuffleDestroy = domShuffleDestroy;
        animObj.domLightningDestroy = domLightningDestroy;
        animObj.domHummerDestroy = domHummerDestroy;

        args = Array.from(arguments);
        args.shift();

        animObj.init.apply(animObj, args);

        let iterate = function () {
            if (!animObj.continue) {
                animBlock = false;
                self.redraw();
                self.run();
                return;
            }
            animObj.continue = animObj.iterate(counter++);
            setTimeout(iterate, Config.OnIdle.animateInterval);
        };

        iterate();
    };
};

let animChangeAndBack = function animChangeAndBack() {
    let pA, pB, domA, domB, v, velocity, counterHalf, counterStop;
    velocity = 5;
    counterStop = Math.floor(100 / velocity);
    counterHalf = Math.floor(counterStop / 2);

    this.init = function (a, b) {
        pA = a;
        pB = b;
        v = {x: (pB.x - pA.x) * velocity, y: (pB.y - pA.y) * velocity};
        domA = this.gemDoms[pA.x][pA.y];
        domB = this.gemDoms[pB.x][pB.y];
    };

    this.iterate = function (counter) {
        if (counter === counterHalf) {
            v.x = -v.x;
            v.y = -v.y;
        }
        domA.x += v.x;
        domA.y += v.y;
        domB.x -= v.x;
        domB.y -= v.y;
        domA.redraw();
        domB.redraw();
        return counter < counterStop;
    };
};

let animLightning = function () {

    this.init = function (p, orientation) {
        let lineData = Field.getVisibleLength(p, orientation);
        this.domLightningDestroy.animPlayed = true;
        if (orientation === 'v') {
            this.domLightningDestroy.x = (p.x - 1) * DataPoints.BLOCK_WIDTH;
            this.domLightningDestroy.y = (lineData.higher - 1) * DataPoints.BLOCK_HEIGHT - (GUI.getImageHeight('/images/anim-light-1.png') - DataPoints.BLOCK_HEIGHT) / 2;
        } else {
            this.domLightningDestroy.x = lineData.lower * DataPoints.BLOCK_WIDTH;
            this.domLightningDestroy.y = p.y * DataPoints.BLOCK_HEIGHT - (GUI.getImageHeight('/images/anim-light-1.png') - DataPoints.BLOCK_HEIGHT) / 2;
        }
        this.domLightningDestroy.width = (lineData.length) * DataPoints.BLOCK_WIDTH;
        if (orientation === 'v') this.domLightningDestroy.rotate = 90;
        if (orientation === 'h') this.domLightningDestroy.rotate = 0;
        this.domLightningDestroy.show();
        this.domLightningDestroy.redraw();
    };

    this.iterate = function (counter) {
        if (counter <= 50) return true;
        this.domLightningDestroy.animData = [{
            frameN: 0,
            counter: 0
        }];
        this.domLightningDestroy.animPlayed = false;
        this.domLightningDestroy.hide();
    };
};

let animHummerDestroy = function () {

    this.init = function (p) {
        this.domHummerDestroy.animPlayed = true;
        this.domHummerDestroy.x = p.x * DataPoints.BLOCK_WIDTH - (GUI.getImageWidth('/images/anim-hd-1.png') - DataPoints.BLOCK_WIDTH) / 2;
        this.domHummerDestroy.y = p.y * DataPoints.BLOCK_HEIGHT - (GUI.getImageHeight('/images/anim-hd-1.png') - DataPoints.BLOCK_HEIGHT) / 2;
        this.domHummerDestroy.show();
        this.domHummerDestroy.redraw();
    };

    this.iterate = function (counter) {
        if (counter <= 30) return true;
        this.domHummerDestroy.animData = [{
            frameN: 0,
            counter: 0
        }];
        this.domHummerDestroy.animPlayed = false;
        this.domHummerDestroy.hide();
    };
};

let animChangeAndDestroy = function animChangeAndDestroy() {
    let pA, pB, domA, domB, v, velocity, counterStop;
    velocity = 5;
    counterStop = Math.floor(50 / velocity);

    this.init = function (a, b) {
        pA = a;
        pB = b;
        v = {x: (pB.x - pA.x) * velocity, y: (pB.y - pA.y) * velocity};
        domA = this.gemDoms[pA.x][pA.y];
        domB = this.gemDoms[pB.x][pB.y];
    };

    this.iterate = function (counter) {
        domA.x += v.x;
        domA.y += v.y;
        domB.x -= v.x;
        domB.y -= v.y;
        domA.redraw();
        domB.redraw();
        return counter < counterStop;
    };
};