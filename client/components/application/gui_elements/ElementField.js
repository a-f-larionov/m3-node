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

    /** Рамка и все что связано */
    let gemFramed = null,
        domFrame = null
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

    let container = null;
    let maskDoms = [],
        gemDoms = [],
        specDoms = [],
        animDoms = [];
    let specDomsLimit = 100;
    let animDomsLimit = 10;

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
    this.beforeStuffUse = null;
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

        container = GUI.createDom(undefined, {
            width: DataPoints.FIELD_MAX_WIDTH * DataPoints.BLOCK_WIDTH,
            height: DataPoints.FIELD_MAX_HEIGHT * DataPoints.BLOCK_HEIGHT,
            overflow: 'visible'
        });
        GUI.pushParent(container);

        container.bind(GUI.EVENT_MOUSE_CLICK, onGemClick, container);
        container.bind(GUI.EVENT_MOUSE_MOUSE_DOWN, onGemMouseDown, container);
        container.bind(GUI.EVENT_MOUSE_MOUSE_UP, onGemMouseUp, container);
        container.bind(GUI.EVENT_MOUSE_OVER, onGemMouseOver, container);
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
                noScale: true,
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

        for (let i = 0; i < specDomsLimit; i++) {
            dom = GUI.createDom(undefined, {
                width: DataPoints.BLOCK_WIDTH,
                height: DataPoints.BLOCK_HEIGHT
            });
            OnIdle.register(dom.animate);
            specDoms.push(dom);
        }
        /** Anim Doms Pool */
        for (let i = 0; i < animDomsLimit; i++) {
            animDoms.push(GUI.createDom(undefined, {}));
        }
        /** Frame dom */
        domFrame = GUI.createDom(undefined, {backgroundImage: '/images/field-frame.png'});

        GUI.popParent();

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
        console.log(lock, AnimLocker.busy());
        if (lock) return;
        if (AnimLocker.busy()) return;
        //@todo
        //Config.OnIdle.animateInterval = 33 * 5;
        switch (stuffMode) {
            case LogicStuff.STUFF_HUMMER:
                hummerAct(p);
                break;
            case LogicStuff.STUFF_SHUFFLE:
                shuffleAct(p);
                break;
            case LogicStuff.STUFF_LIGHTING:
                lightningAct(p);
                break;
            default:
                gemChangeAct(p);
                break;
        }
    };

    let hummerAct = function (p) {
        if (lock || AnimLocker.busy() || Field.isNotGem(p)) return;
        self.beforeStuffUse();
        self.destroyGem(p);
        animate(animHummerDestroy, p);
    };

    let shuffleAct = function () {
        if (lock) return;
        if (AnimLocker.busy()) return;

        self.beforeStuffUse();
        shuffleDo();
    };

    let shuffleDo = function () {
        funcShuffleField();
        /** Еще попытки, если не получилось */
        for (let i = 0; i < 500; i++) {
            if (Field.findLines().length) break;
            funcShuffleField();
        }
        animate(animShuffle,
            visibleWidth * DataPoints.BLOCK_WIDTH / 2,
            visibleHeight * DataPoints.BLOCK_HEIGHT / 2
        );
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
                Field.isVisible(p1) && Field.isGem(p1) &&
                Field.isVisible(p2) && Field.isGem(p2)
            ) {
                Field.exchangeGems({x: x1, y: y1}, p2)
            }
        });
    };

    let lightningAct = function (p, orientation) {
        if (lock || AnimLocker.busy() || !Field.isVisible(p)) return;
        if (!orientation) orientation = 'h';
        self.beforeStuffUse();
        lightningDo(p, orientation);
    };

    let lightningDo = function (p, orientation) {
        Field.destroyLine(p, orientation, self.destroyGem);
        self.redraw();
        if (orientation === 'c') {
            animate(animLightning, p, 'v');
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
        console.log(lock, AnimLocker.busy(), Field.isNotGem(gemB));
        if (lock || AnimLocker.busy() || Field.isNotGem(gemB)) return;
        console.log(1);
        /** Set frame */
        if (!gemA || (gemA && !Field.isNear(gemA, gemB))) {
            console.log(2);
            gemFramed = gemB;
            self.redraw();
        }
        console.log(3);
        /** Near gems */
        if (gemA && Field.isNear(gemA, gemB)) {
            console.log(4);
            gemFramed = null;
            self.redraw();

            /** Change and back */
            if (!Field.isLinePossiblyDestroy(gemA, gemB)) {
                animate(animChangeAndBack, gemA, gemB);
                animate(animChangeAndBack, gemB, gemA);
                if (Field.isLightningSpec(gemA)) {

                    //animate(animChangeAndBack, gemA, gemB);
                }
            }

            /** Change and destroy */
            if (Field.isLinePossiblyDestroy(gemA, gemB)) {
                self.beforeTurnUse();
                Field.exchangeGems(gemA, gemB);
                animate(animChangeAndDestroy, gemA, gemB);
                animate(animChangeAndDestroy, gemB, gemA);
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
        container.show();
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
        container.hide();
        Field.eachCell(function (x, y) {
            maskDoms[x][y].hide();
            gemDoms[x][y].hide();
        });
        domFrame.hide();
    };

    /**
     * Перерисуем картинку.
     */
    this.redraw = function () {
        if (!showed) return;
        if (AnimLocker.busy()) return;
        self.x = self.centerX - DataPoints.BLOCK_WIDTH / 2
            - (visibleWidth - 1) / 2 * DataPoints.BLOCK_WIDTH
            - visibleOffsetX * DataPoints.BLOCK_WIDTH
        ;
        self.y = self.centerY - DataPoints.BLOCK_HEIGHT / 2
            - (visibleHeight - 1) / 2 * DataPoints.BLOCK_HEIGHT
            - visibleOffsetY * DataPoints.BLOCK_HEIGHT
            + DataPoints.BLOCK_HEIGHT / 2 // выравнивание от панель
        ;
        container.x = self.x;
        container.y = self.y;
        container.redraw();
        domBackground.redraw();

        let specIndex = 0;
        Field.eachCell(function (x, y, maskId, gemId) {
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
                Field.isVisible({x: x, y: y})) {
                gemDom.opacity = '';
                gemDom.backgroundImage = DataPoints.objectImages[gemId];
                gemDom.y = y * DataPoints.BLOCK_HEIGHT;
                gemDom.x = x * DataPoints.BLOCK_WIDTH;
                gemDom.height = DataPoints.BLOCK_HEIGHT;
                gemDom.backgroundPositionY = 0;
                gemDom.show();
                gemDom.redraw();
            } else {
                gemDom.hide();
            }

            /** Specials layers **/

            Field.getSpecIds({x: x, y: y}).forEach(function (specId) {
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
            });
        });

        /** Спрячем не используемые специальные домы */
        for (let i = specIndex; i < specDomsLimit; i++) {
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
            if (Field.isVisible({x: x, y: y})) {
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
        if (self.isFieldSilent()) {
            if (!turnsCounted) {
                turnsCounted = true;
                let allTurns = Field.countTurns();
                if (allTurns.length === 0) {
                    shuffleDo();
                }
            }
            //self.redraw();//@todo some strange...but
            self.onFieldSilent();
            return;
        } else {
            turnsCounted = false;
        }

        switch (runNext) {
            case 0:
                runNext = 1;
                self.fall();
                break;
            case 1:
                runNext = 2;
                self.processSpecialLayer();
                break;
            case 2:
                runNext = 0;
                self.destroyLines();
                break;
        }
    };

    this.isFieldSilent = function () {
        return !(AnimLocker.busy() ||
            self.hasDestroyLines() ||
            self.hasFall() ||
            self.hasProcesSpecialLayer()
        );
    };

    this.hasProcesSpecialLayer = function (out) {
        Field.eachCell(function (x, y) {
            out |= Field.specPresent({x: x, y: y}, DataObjects.OBJECT_EMITTER);
        });
        return out;
    };

    this.processSpecialLayer = function () {
        Field.eachCell(function (x, y) {
            if (Field.specPresent({x: x, y: y}, DataObjects.OBJECT_EMITTER) &&
                Field.isHole({x: x, y: y})
            ) {
                Field.setGem({x: x, y: y}, Field.getRandomGemId());
                if (Field.isVisible({x: x, y: y})) animate(animGemFader, {x: x, y: y});
            }
        });
        self.run();
    };

    this.hasFall = function (out) {
        Field.eachCell(function (x, y) {
            if (Field.mayFall(x, y)) out = true;
        });
        return out;
    };

    this.fall = function () {
        if (AnimLocker.busy()) return;

        let fallDoms = [];

        /** Собираем камни и меняем поле */
        Field.eachCell(function (x, y) {
            y = DataPoints.FIELD_MAX_HEIGHT - y - 1;
            if (!Field.mayFall(x, y)) return;

            Field.exchangeGems({x: x, y: y}, {x: x, y: y + 1});
            fallDoms.push(gemDoms[x][y]);
        });
        if (fallDoms.length) animate(animFallGems, fallDoms);
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
        if (Field.isLightningSpec(p)) {
            lightningDo(p, Field.isLightningSpec(p));
        }
    };

    let animate = function (animClass) {
        let args, animObj, counter;
        AnimLocker.lock();

        counter = 0;
        animObj = new animClass();
        animObj.continue = true;
        animObj.gemDoms = gemDoms;
        animObj.animDoms = animDoms;

        args = Array.from(arguments);
        args.shift();

        animObj.init.apply(animObj, args);

        let iterate = function () {
            if (!animObj.continue) {
                if (animObj.finish) animObj.finish();
                AnimLocker.release();
                if (AnimLocker.free()) {
                    self.redraw();
                    self.run();
                }
            } else {
                animObj.continue = animObj.iterate(counter++);
                setTimeout(iterate, Config.OnIdle.animateInterval);
            }
        };
        iterate();
    };
};

let animChangeAndBack = function animChangeAndBack() {
    let dom, v, velocity, counterHalf, counterStop;
    velocity = 5;
    counterStop = Math.floor(100 / velocity);
    counterHalf = Math.floor(counterStop / 2);

    this.init = function (a, b) {
        v = {x: (b.x - a.x) * velocity, y: (b.y - a.y) * velocity};
        dom = this.gemDoms[a.x][a.y];
        //
    };

    this.iterate = function (counter) {
        if (counter === counterHalf) {
            v.x = -v.x;
            v.y = -v.y;
        }
        dom.x += v.x;
        dom.y += v.y;
        dom.redraw();
        return counter + 1 < counterStop;
    };
};

let animLightning = function () {
    let dom;
    this.init = function (p, orientation) {
        console.log('init', p, orientation);
        dom = this.animDoms.pop();
        let lineData = Field.getVisibleLength(p, orientation);
        console.log(p, lineData);
        dom.width = lineData.length * DataPoints.BLOCK_WIDTH;
        dom.height = GUI.getImageHeight('/images/anim-light-1.png');
        if (orientation === 'v') {
            dom.rotate = 90;
            dom.x = (p.x) * DataPoints.BLOCK_WIDTH;
            dom.y = (lineData.lower) * DataPoints.BLOCK_HEIGHT
                - (GUI.getImageHeight('/images/anim-light-1.png') - DataPoints.BLOCK_HEIGHT) / 2;
            /** rotate from center like a cos&sin*/
            dom.x -= (dom.width - DataPoints.BLOCK_WIDTH) / 2;
            dom.y += (dom.width - DataPoints.BLOCK_WIDTH) / 2;
        }
        if (orientation === 'h') {
            dom.rotate = 0;
            dom.x = lineData.lower * DataPoints.BLOCK_WIDTH;
            dom.y = p.y * DataPoints.BLOCK_HEIGHT
                - (GUI.getImageHeight('/images/anim-light-1.png') - DataPoints.BLOCK_HEIGHT) / 2;
        }
        console.log('x1', dom.x, p.x);
        dom.show();
        dom.redraw();
    };

    this.iterate = function (counter) {
        console.log('x2', dom.x, dom.width, dom.height);
        window.m = dom;
        dom.backgroundImage =
            '/images/anim-light-' + ((counter - Math.floor(counter / 5) * 5) + 1) + '.png';
        dom.redraw();
        if (counter < 15) return true;
    };

    this.finish = function () {
        dom.hide();
        this.animDoms.push(dom);
    }
};

let animHummerDestroy = function () {
    let dom, imageUrl = '/images/anim-hd-1.png';

    this.init = function (p) {
        dom = this.animDoms.pop();
        dom.x = p.x * DataPoints.BLOCK_WIDTH
            - (GUI.getImageWidth(imageUrl) - DataPoints.BLOCK_WIDTH) / 2;
        dom.y = p.y * DataPoints.BLOCK_HEIGHT
            - (GUI.getImageHeight(imageUrl) - DataPoints.BLOCK_HEIGHT) / 2;
        dom.width = null;
        dom.height = null;
        dom.backgroundImage = imageUrl;
        dom.show();
        dom.redraw();
    };

    this.iterate = function (counter) {
        dom.backgroundImage = '/images/anim-hd-' + (counter + 1) + '.png';
        dom.redraw();
        return counter < 15 - 1;
    };

    this.finish = function () {
        this.animDoms.push(dom);
        dom.hide();
    }
};

let animChangeAndDestroy = function () {
    let dom, v, velocity, counterStop;
    velocity = 5;
    counterStop = Math.floor(50 / velocity) - 1;

    this.init = function (a, b) {
        v = {x: (b.x - a.x) * velocity, y: (b.y - a.y) * velocity};
        dom = this.gemDoms[a.x][a.y];
    };

    this.iterate = function (counter) {
        dom.x += v.x;
        dom.y += v.y;
        dom.redraw();
        return counter < counterStop;
    };
};

let animGemFader = function () {
    let dom;
    this.init = function (p) {
        dom = this.gemDoms[p.x][p.y];
        dom.x = p.x * DataPoints.BLOCK_WIDTH;
        dom.y = p.y * DataPoints.BLOCK_HEIGHT;
        dom.backgroundImage = DataPoints.objectImages[Field.getGemId(p)];
        dom.width = null;//DataPoints.BLOCK_WIDTH;
        dom.height = null;//DataPoints.BLOCK_HEIGHT;
        dom.redraw();
        dom.show();
    };
    this.iterate = function (counter) {
        dom.opacity = (counter / 10);
        dom.redraw();
        return counter < 10;
    };
};

let animFallGems = function () {
    let fallDoms;
    let velocity = 10;

    this.init = function (doms) {
        fallDoms = doms;
        fallDoms.forEach(function (dom) {
            dom.fallMode = 'just';

            if (Field.isVisible({x: dom.p.x, y: dom.p.y + 1}) &&
                !Field.isVisible(dom.p)) dom.fallMode = 'to-show';
            if (!Field.isVisible({x: dom.p.x, y: dom.p.y + 1}) &&
                Field.isVisible(dom.p)) dom.fallMode = 'to-hide';

            if (dom.fallMode === 'to-show') {
                /** Его уже ранее спустили  */
                dom.x = dom.p.x * DataPoints.BLOCK_WIDTH;
                dom.y = (dom.p.y + 1) * DataPoints.BLOCK_HEIGHT;
                dom.height = 0;
                dom.width = DataPoints.BLOCK_WIDTH;
                dom.backgroundImage = DataPoints.objectImages[Field.getGemId({x: dom.p.x, y: dom.p.y + 1})];
                /** Перерисовка backgroundPositionY это хитрый хак и костыль :) */
                dom.backgroundPositionY = DataPoints.BLOCK_HEIGHT;
                dom.show();
            }
        });
    };

    this.iterate = function (counter) {
        fallDoms.forEach(function (dom) {
            switch (dom.fallMode) {
                case 'to-hide':
                    dom.y += velocity;
                    dom.height -= velocity;
                    break;
                case 'to-show':
                    dom.height += velocity;
                    dom.backgroundPositionY -= velocity;
                    break;
                case 'just':
                    dom.y += velocity;
                    break;
            }
            dom.redraw();
        });
        return counter + 1 < DataPoints.BLOCK_HEIGHT / velocity;
    };
};

let animShuffle = function () {
    let dom;

    this.init = function (x, y) {
        dom = this.animDoms.pop();
        dom.x = x - GUI.getImageWidth('/images/anim-shuffle-1.png') / 2;
        dom.y = y + DataPoints.BLOCK_HEIGHT / 2 - GUI.getImageHeight('/images/anim-shuffle-1.png') / 2;
        dom.width = GUI.getImageWidth('/images/anim-shuffle-1.png');
        dom.height = GUI.getImageHeight('/images/anim-shuffle-1.png');
        dom.backgroundImage = '/images/anim-shuffle-1.png';
        dom.opacity = 0.7;
        dom.rotate = 0;
        dom.show();
    };

    this.iterate = function (counter) {
        dom.rotate += 10 * 2;
        dom.redraw();
        return counter < 36 / 2;
    };

    this.finish = function () {
        dom.hide();
        this.animDoms.push(dom);
    }
};

let AnimLocker = {
    locks: 0,
    lock: function () {
        AnimLocker.locks++;
    },
    release: function () {
        AnimLocker.locks--;
    },
    free: function () {
        return AnimLocker.locks === 0;
    },
    busy: function () {
        return !AnimLocker.free();
    }
};