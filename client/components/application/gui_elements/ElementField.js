/**
 * Элемент игрового поля.
 * @constructor
 */
ElementField = function () {
    let self = this;

    let lock = true;

    let lockHint = false;

    /**
     * Показывать ли элемент.
     * @type {boolean}
     */
    let showed = false;

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

    let container = null;
    let maskDoms = [],
        specDoms1 = [],
        gemDoms = [],
        specDoms2 = [],
        animDoms = [];
    let specDomsLimit = 100;
    let animDomsLimit = 100;

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

    this.onDestroyThing = null;

    this.beforeStuffUse = null;
    /**
     * Каллбек
     * @type {function}
     */
    this.onFieldSilent = null;

    let lastExchangeGems = null;

    let polyColorCell = false;

    /**
     * Создадим дом и настроем его.
     */
    this.init = function () {
        let dom;

        container = GUI.createDom(undefined, {
            width: DataPoints.FIELD_MAX_WIDTH * DataPoints.BLOCK_WIDTH,
            height: DataPoints.FIELD_MAX_HEIGHT * DataPoints.BLOCK_HEIGHT,
            overflow: 'visible'
        });
        GUI.pushParent(container);

        container.bind(GUI.EVENT_MOUSE_CLICK, onGemClick, container);
        container.bind(GUI.EVENT_MOUSE_MOUSE_DOWN, onGemMouseDown, container);
        container.bind(GUI.EVENT_MOUSE_MOUSE_UP, onGemMouseUp, container);
        //container.bind(GUI.EVENT_MOUSE_OVER, onGemMouseOver, container);
        //container.bind(GUI.EVENT_MOUSE_OUT, onGemMouseOut, container);
        container.bind(GUI.EVENT_MOUSE_MOVE, onGemMouseMove, container);

        /**
         * Create mask layer cells
         */
        Field.eachCell(function (x, y) {
            if (!maskDoms[x]) maskDoms[x] = [];
            maskDoms[x][y] = GUI.createDom(undefined, {
                opacity: 0.4,
            });
        });

        for (let i = 0; i < specDomsLimit; i++) {
            dom = GUI.createDom(undefined, {width: DataPoints.BLOCK_WIDTH, height: DataPoints.BLOCK_HEIGHT});
            //@todo shit it!
            OnIdle.register(dom.animate);
            specDoms1.push(dom);
        }

        Field.eachCell(function (x, y) {
            if (!gemDoms[x]) gemDoms[x] = [];
            dom = GUI.createDom(undefined, {
                p: {x: x, y: y},
                noScale: true,
                height: DataPoints.BLOCK_HEIGHT,
                width: DataPoints.BLOCK_WIDTH,
                backgroundImage: '/images/field-none.png'
            });
            gemDoms[x][y] = dom;
        });
        for (let i = 0; i < specDomsLimit; i++) {
            dom = GUI.createDom(undefined, {width: DataPoints.BLOCK_WIDTH, height: DataPoints.BLOCK_HEIGHT});
            //@todo shit it!
            OnIdle.register(dom.animate);
            specDoms2.push(dom);
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
        let cell;
        if (lock) return;
        if (AnimLocker.busy()) return;
        if (stopHint) stopHint();
        cell = Field.getCell(p);
        if (!cell.isVisible) return;
        if (!cell.object.isCanMoved) return;

        switch (stuffMode) {
            case LogicStuff.STUFF_HUMMER:
                hummerAct(p);
                break;
            case LogicStuff.STUFF_SHUFFLE:
                shuffleAct(p);
                break;
            case LogicStuff.STUFF_LIGHTNING:
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
        self.cellAttack(p);
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
        console.log(self);
        console.log({
            visibleHeight: visibleHeight,
            visibleOffsetY: visibleOffsetY
        });
        animate(animShuffle,
            self.x - (visibleOffsetX * DataPoints.BLOCK_WIDTH),
            self.centerY
        );
    };

    let funcShuffleField = function () {
        let p1, p2, cell2;
        Field.eachCell(function (x1, y1, cell1) {
            p1 = {x: x1, y: y1};
            p2 = {
                x: Math.floor(Math.random() * DataPoints.FIELD_MAX_WIDTH),
                y: Math.floor(Math.random() * DataPoints.FIELD_MAX_HEIGHT)
            };
            cell2 = Field.getCell(p2);
            if (cell1.isVisible && cell1.object.isCanMoved && cell2.isVisible && cell2.object.isCanMoved) {
                Field.exchangeObjects(p1, p2)
            }
        });
    };

    let lightningAct = function (p, orientation) {
        if (lock || AnimLocker.busy() || !Field.isVisible(p)) return;
        if (!orientation) orientation = DataObjects.WITH_LIGHTNING_HORIZONTAL;
        self.beforeStuffUse();
        lightningDo(p, orientation);
    };

    let lightningDo = function (p, specId) {
        if (specId === DataObjects.WITH_LIGHTNING_CROSS) {
            Field.eachVisibleLine(p, DataObjects.WITH_LIGHTNING_VERTICAL, self.cellAttack);
            Field.eachVisibleLine(p, DataObjects.WITH_LIGHTNING_HORIZONTAL, self.cellAttack);
            self.redraw();
            animate(animLightning, p, DataObjects.WITH_LIGHTNING_VERTICAL);
            animate(animLightning, p, DataObjects.WITH_LIGHTNING_HORIZONTAL);
        } else {
            Field.eachVisibleLine(p, specId, self.cellAttack);
            self.redraw();
            animate(animLightning, p, specId);
        }
    };

    /**
     * Обработка дейтсвия с камнем, при клике например
     * или другом любом действием аналогичным клику.
     * @param gemB {Object}
     */
    let gemChangeAct = function (gemB) {
        let gemA = gemFramed, cell, pList;

        if (lock || AnimLocker.busy() || !Field.isFallObject(gemB)) return;

        /** Set frame */
        if (!gemA || (gemA && !Field.isNear(gemA, gemB))) {
            gemFramed = gemB;
            cell = Field.getCell(gemFramed);
            polyColorCell = cell && cell.isVisible && cell.object.isPolyColor && cell;
            self.redraw();
        }
        /** Near gems */
        if (gemA && Field.isNear(gemA, gemB)) {
            gemFramed = null;
            self.redraw();

            if (polyColorCell) {
                pList = [];
                Field.eachCell(function (x, y, cell, object) {
                    if (cell.isVisible && object.isGem && object.objectId === Field.getCell(gemB).object.objectId && cell.object.isCanMoved) {
                        pList.push({x: x, y: y, cell: cell});
                    }
                });
                pList.push({x: polyColorCell.x, y: polyColorCell.y, cell: polyColorCell});
                pList.forEach(function (p) {
                    self.cellAttack(p, p.cell);
                });
                stopPolyColorAnim();
                polyColorCell = false;
                gemA = gemB = gemFramed = null;
                return;
            }

            /** Change and back */
            if (!Field.isLinePossiblyDestroy(gemA, gemB)) {
                animate(animChangeAndBack, gemA, gemB);
                animate(animChangeAndBack, gemB, gemA);
            }

            /** Change and destroy */
            if (Field.isLinePossiblyDestroy(gemA, gemB)) {
                lastExchangeGems = {a: gemA, b: gemB};
                self.beforeTurnUse();
                Field.exchangeObjects(gemA, gemB);
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

    let stopPolyColorAnim = false;

    let lastMouseMoveP;

    let onGemMouseMove = function (event) {
        let p;
        p = pointFromEvent(event);
        if (lastMouseMoveP && (lastMouseMoveP.x !== p.x || lastMouseMoveP.y !== p.y)) {
            onGemMouseOut(event);
            onGemMouseOver(event);
        }
        lastMouseMoveP = p;
    };

    let onGemMouseOver = function (event) {
        let p, mousedCell, pList;
        if (polyColorCell) {
            p = pointFromEvent(event);
            mousedCell = Field.getCell(p);
            if (Field.isNear(p, gemFramed) && mousedCell.isVisible && mousedCell.object.isGem && mousedCell.object.isCanMoved) {
                if (stopHint) stopHint();
                if (stopPolyColorAnim === false) {
                    pList = [];
                    Field.eachCell(function (x, y, cell, object) {
                        if (cell.isVisible && object.isGem && object.objectId === mousedCell.object.objectId && cell.object.isCanMoved) {
                            pList.push({x: x, y: y});
                        }
                    });
                    stopPolyColorAnim = animate(animHint, pList);
                }
            }
        }
        if (gemMouseDown) {
            fieldAct(gemMouseDown);
            fieldAct(pointFromEvent(event));
            gemMouseDown = null;
        }
    };

    let onGemMouseOut = function (event) {
        if (polyColorCell) {
            if (stopPolyColorAnim) {
                stopPolyColorAnim();
                stopPolyColorAnim = false;
            }
        }
    };

    /**
     * Покажем картинку.
     */
    this.show = function () {
        if (showed === true) return;
        showed = true;
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
        container.hide();
        Field.eachCell(function (x, y) {
            maskDoms[x][y].hide();
            gemDoms[x][y].hide();
        });
        domFrame.hide();
        if (stopHint) stopHint();
    };

    let drawDom = function (p, dom, objectId, opacity) {
        dom.x = p.x * DataPoints.BLOCK_WIDTH;
        dom.y = p.y * DataPoints.BLOCK_HEIGHT;
        let borderRadius = '';
        let nV = function (p) {
            return !Field.isVisible(p);
        };
        //dom.borderRadius = '10px 10px 10px 10px';
        borderRadius += (nV({x: p.x - 1, y: p.y}) && nV({x: p.x, y: p.y - 1})) ? '8px ' : '0px ';
        borderRadius += (nV({x: p.x, y: p.y - 1}) && nV({x: p.x + 1, y: p.y})) ? '8px ' : '0px ';
        borderRadius += (nV({x: p.x + 1, y: p.y}) && nV({x: p.x, y: p.y + 1})) ? '8px ' : '0px ';
        borderRadius += (nV({x: p.x, y: p.y + 1}) && nV({x: p.x - 1, y: p.y})) ? '8px ' : '0px ';
        //borderRadius = '8px 8px 8px 8px';
        dom.borderRadius = borderRadius;
        if (DataPoints.objectImages[objectId]) dom.backgroundImage = DataPoints.objectImages[objectId];
        if (DataPoints.objectAnims[objectId]) {
            dom.animPlayed = true;
            dom.animTracks = GUI.copyAnimTracks(DataPoints.objectAnims[objectId]);
            GUI.updateAnimTracks(dom);
        } else {
            dom.animPlayed = false;
        }
        if (opacity !== undefined) dom.opacity = opacity;
        dom.show();
        dom.redraw();
    };

    /**
     * Перерисуем картинку.
     */
    this.redraw = function () {
        if (!showed) return;
        if (AnimLocker.busy()) return;

        container.redraw();

        let spec1Index = 0;
        let spec2Index = 0;
        Field.eachCell(function (x, y, cell, object) {
                let maskDom, gemDom, specDom;
                maskDom = maskDoms[x][y];
                gemDom = gemDoms[x][y];

                gemDom.bindedDoms = null;

                /** Layer.mask redraw */
                cell.isVisible ?
                    drawDom({x: x, y: y}, maskDom, DataObjects.CELL_VISIBLE) :
                    maskDom.hide();

                /**
                 * Draw any
                 */
                if (cell.isVisible && (object.isGem || object.isRedSpider || object.isBarrel || object.isPolyColor)) {
                    drawDom({x: x, y: y}, gemDom, object.objectId, '')
                } else {
                    gemDom.hide();
                }

                /** Gems */
                if (cell.isVisible && object.isGem) {
                    /** Lightning */
                    if (object.lightningId) {
                        specDom = specDoms2[spec2Index++];
                        drawDom({x: x, y: y}, specDom, object.lightningId, 0.5);
                        gemDom.bindedDoms = specDom;
                    }
                }

                /** Spider red health */
                if (cell.isVisible && object.isRedSpider) {
                    specDom = specDoms2[spec2Index++];
                    specDom.backgroundImage = DataPoints.healthImages[object.health];
                    drawDom({x: x, y: y}, specDom, '', '');
                    gemDom.bindedDoms = specDom;
                }

                /** Box */
                if (cell.isVisible && object.withBox) {
                    specDom = specDoms2[spec2Index++];
                    drawDom({x: x, y: y}, specDom, DataObjects.OBJECT_BOX, '');
                    gemDom.hide();
                }

                /** Chain */
                if (cell.isVisible && object.withChain) {
                    specDom = specDoms2[spec2Index++];
                    drawDom({x: x, y: y}, specDom, DataObjects.OBJECT_CHAIN, '');
                }

                /** Treasure */
                if (cell.isVisible && cell.withTreasures) {
                    specDom = specDoms1[spec1Index++];
                    drawDom({x: x, y: y}, specDom, DataObjects.OBJECT_TREASURES, '');
                }

                /** Spider green */
                if (cell.isVisible && object.withOctopus) {
                    specDom = specDoms2[spec2Index++];
                    drawDom({x: x, y: y}, specDom, DataObjects.OBJECT_GREEN_SPIDER, '');
                    gemDom.bindedDoms = specDom;
                }
            }
        );

        /** Спрячем не используемые специальные домы */
        for (let i = spec1Index; i < specDomsLimit; i++) {
            specDoms1[i].hide();
        }
        for (let i = spec2Index; i < specDomsLimit; i++) {
            specDoms2[i].hide();
        }

        if (gemFramed) {
            drawDom({x: gemFramed.x, y: gemFramed.y}, domFrame);
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

        let specialLayers = [];
        layers.special.forEach(function (specLayer) {
            specialLayers.push(copyLayer(specLayer));
        });
        Field.setLayers(
            copyLayer(layers.mask),
            copyLayer(layers.gems, function (value) {
                if (value === DataObjects.OBJECT_RANDOM) return Field.getRandomGemId();
                return value;
            }),
            specialLayers
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
        let minCorner, maxCorner;
        minCorner = {x: Infinity, y: Infinity};
        maxCorner = {x: -Infinity, y: -Infinity};
        Field.eachCell(function (x, y, cell) {
            if (cell.isVisible) {
                minCorner.x = Math.min(minCorner.x, x);
                minCorner.y = Math.min(minCorner.y, y);
                maxCorner.x = Math.max(maxCorner.x, x);
                maxCorner.y = Math.max(maxCorner.y, y);
            }
        });
        visibleWidth = maxCorner.x - minCorner.x + 1;
        visibleHeight = maxCorner.y - minCorner.y + 1;
        visibleOffsetX = minCorner.x;
        visibleOffsetY = minCorner.y;

        /** Update some coords */
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

        this.redraw();
    };

    this.run = function () {
        if (AnimLocker.busy()) return;

        if (self.hasProcesSpecialLayer()) return self.processSpecialLayer();
        if (self.hasFall()) return self.fall();
        if (self.hasDestroyLines()) return self.destroyLines();
        if (self.hasNoTurns()) return shuffleDo();
        if (self.isFieldSilent()) return onFieldSilent();
    };

    let onFieldSilent = function () {
        self.onFieldSilent();
        tryShowHint();
    };

    let stopHint;

    let tryShowHint = function () {
        setTimeout(function () {
            console.log('tryShowHint', self.isFieldSilent(), !lock, showed, !stopHint, !stopPolyColorAnim, !lockHint);
            if (self.isFieldSilent() && !lock && showed && !stopHint && !stopPolyColorAnim && !lockHint) {
                let allTurns = Field.countTurns();
                if (allTurns.length) {
                    let stopFunc = animate(animHint, [allTurns[0].a, allTurns[0].b]);
                    stopHint = function () {
                        stopHint = null;
                        stopFunc();
                        tryShowHint();
                    }
                }
            }
        }, Config.OnIdle.second * 3);
    };

    this.isFieldSilent = function () {
        return !(AnimLocker.busy() ||
            self.hasDestroyLines() ||
            self.hasFall() ||
            self.hasProcesSpecialLayer() ||
            self.hasNoTurns()
        );
    };

    this.hasProcesSpecialLayer = function (out) {
        Field.eachCell(function (x, y, cell) {
            out |= (cell.isEmitter && cell.object.isHole);
            out |= (cell.isVisible && cell.object.isBarrel && !Field.isVisible({x: x, y: y + 1}));
        });
        return out;
    };

    this.processSpecialLayer = function () {
        Field.eachCell(function (x, y, cell) {
            if (cell.isEmitter && Field.isHole({x: x, y: y})) {
                Field.setObject({x: x, y: y}, Field.getRandomGemId());
                if (Field.isVisible({x: x, y: y})) animate(animGemFader, {x: x, y: y});
            }
            if (cell.isVisible && cell.object.isBarrel && !Field.isVisible({x: x, y: y + 1})) {
                /** Destroy barrel */
                self.onDestroyThing(DataObjects.OBJECT_BARREL, cell);
                Field.setObject({x: x, y: y}, DataObjects.OBJECT_HOLE, false);
                cell.object.isBarrel = false;
                //@todo animBarrelGoOut
                animate(animHummerDestroy, {x: x, y: y});
            }
        });
        self.run();
    };

    this.hasFall = function (out = false) {
        Field.eachCell(function (x, y) {
            if (Field.mayFall(x, y)) out = true;
        });
        return out;
    };

    this.fall = function () {
        let hole;
        if (AnimLocker.busy()) return;

        let fallDoms = [];

        /** Собираем камни и меняем поле */
        Field.eachCell(function (x, y) {
            y = DataPoints.FIELD_MAX_HEIGHT - y - 1;
            hole = Field.mayFall(x, y);
            if (!hole) return;
            Field.exchangeObjects({x: x, y: y}, hole);

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
        let lines, actGem;
        lines = Field.findLines();

        lines.forEach(function (line) {
            actGem = null;
            if (line.coords.length > 3) {
                if (lastExchangeGems && Field.lineCrossing([line], lastExchangeGems.a.x, lastExchangeGems.a.y)) {
                    actGem = lastExchangeGems.a;
                }
                if (lastExchangeGems && Field.lineCrossing([line], lastExchangeGems.b.x, lastExchangeGems.b.y)) {
                    actGem = lastExchangeGems.b;
                }
                if (actGem && line.coords.length === 4) {
                    Field.setObject(actGem, Field.getCell(actGem).object.objectId, line.orientation);
                }
                if (actGem && line.coords.length === 5) {
                    Field.setObject(actGem, DataObjects.OBJECT_POLY_COLOR, false);
                }
            }

            line.coords.forEach(function (p) {
                if (actGem && p.x === actGem.x && p.y === actGem.y) return;
                self.cellAttack(p);
            });
            self.onDestroyLine(line);
        });

        animate(animDestroyLines);
    };

    this.hasNoTurns = function () {
        return Field.countTurns().length === 0;
    };

    this.lock = function () {
        lock = true;
    };

    this.unlock = function () {
        lock = false;
    };

    this.setStuffMode = function (mode) {
        gemFramed = null;
        polyColorCell = false;
        stuffMode = mode;
        self.redraw();
    };

    let removeBlock = function (nearP, nearCell) {
        //@todo animBoxDetroyed
        if (nearCell.object.withBox && !nearCell.object.withChain) {
            nearCell.object.withBox = false;
            Field.updateIsCanMoved(nearCell.object);
            animate(animHummerDestroy, nearP);
        }
        //@todo animChainDestroyd
        if (nearCell.object.withChain) {
            nearCell.object.withChain = false;
            Field.updateIsCanMoved(nearCell.object);
            animate(animHummerDestroy, nearP);
        }
    };

    this.cellAttack = function (p, cell) {
        let lightningId;
        cell = cell ? cell : Field.getCell(p);

        lightningId = cell.object.lightningId;

        if (cell.isVisible && cell.object.isGem && !cell.object.isCanMoved) {
            //@todo
            // problem with lightgning!
            //removeBlock(p, cell);
        }

        if (cell.isVisible && (cell.object.isGem || cell.object.isPolyColor) && cell.object.isCanMoved) {
            /** Destroy any gem */
            self.onDestroyThing(cell.object.objectId, cell);
            Field.setObject(p, DataObjects.OBJECT_HOLE, false);
            animate(animHummerDestroy, p);

            if (cell.withTreasures) {
                /** Destroy treasures */
                self.onDestroyThing(DataObjects.OBJECT_TREASURES, cell);
                cell.withTreasures = false;
                animate(animHummerDestroy, p);
            }

            if (cell.object.withGreenSpider) {
                /** Destroy green spider */
                self.onDestroyThing(DataObjects.OBJECT_GREEN_SPIDER, cell);
                cell.object.withOctopus = false;
                animate(animHummerDestroy, p);
            }

            /** Any near objects */
            Field.eachNears(p, function (nearP, nearCell) {
                //@todo animSpiderAtacked
                //@todo animSpiderKilled
                if (nearCell.object.isRedSpider) {
                    nearCell.object.health--;
                    if (nearCell.object.health) {
                        animate(animHummerDestroy, nearP);
                    } else {
                        /** Destoy red spider */
                        self.onDestroyThing(DataObjects.OBJECT_RED_SPIDER, nearCell);
                        Field.setObject(nearP, DataObjects.OBJECT_HOLE);
                        animate(animHummerDestroy, nearP);
                    }
                }
                removeBlock(nearP, nearCell);
            });

            if (lightningId) lightningDo(p, lightningId);
        }
    };

    this.getCoords = function () {
        return {
            x: self.x + (visibleOffsetX) * DataPoints.BLOCK_WIDTH,
            y: self.y + (visibleOffsetY - 1) * DataPoints.BLOCK_HEIGHT,
            cellX: visibleOffsetX,
            cellY: visibleOffsetY,
        }
    };

    this.lockHint = function () {
        lockHint = true;
        if (stopHint) {
            stopHint();
            tryShowHint();
        }
    };

    this.unlockHint = function () {
        lockHint = false;
        if (stopHint) {
            stopHint();
            tryShowHint();
        }
    };

    this.showHint = function (pList) {
        if (stopHint) stopHint();
        let stopFunc = animate(animHint, pList);
        stopHint = function () {
            stopHint = null;
            stopFunc();
        };
        return stopHint;
    };

    let animate = function (animClass) {
        let args;

        args = Array.from(arguments);
        args.shift();
        /** Insert context */
        args.unshift({
            gemDoms: gemDoms,
            specDoms2: specDoms2,
            animDoms: animDoms,
            onFinish: function () {
                if (animClass.name === animHint.name && stopHint) stopHint();
                self.redraw();
                self.run();
            }
        });
        /** Insert animClass back */
        args.unshift(animClass);

        return Animate.anim.apply(null, args);
    }
};