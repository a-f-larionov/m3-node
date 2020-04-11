/**
 * Страница с игровым полем
 * @constructor
 */
PageBlockField = function PageBlockField() {
    let self = this;

    /**
     * Показывать ли страницу.
     * @type {boolean}
     */
    let showed = false;

    /** @type {ElementField} */
    let elementField = null;

    let elementScore = null;

    let elementStar1 = null;
    let elementStar2 = null;
    let elementStar3 = null;

    let elementTurns = null;

    /**
     *
     * @type {ElementText}
     */
    let elText = null;
    let elTextShadow = null;

    let stuffMode = null;

    let domStuff = null;

    let elPanelGoals;

    let buttonReloadField = null;
    let buttonChangeSpeed = null;

    let score;
    let turns;
    let goals;
    /**
     * Массив всех элементов страницы.
     * @type {Array}
     */
    this.elements = [];

    /**
     * Создадим тут все элементы страницы.
     */
    this.init = function () {
        let el, oX, oY;

        /** Игровое поле */
        elementField = GUI.createElement(ElementField, {
            centerX: 388.5, centerY: 250,

            onDestroyLine: self.onDestroyLine,

            onDestroyThing: self.onDestroyThing,

            beforeTurnUse: self.beforeTurnUse,
            beforeStuffUse: self.beforeStuffUse,
            onFieldSilent: self.onFieldSilent

        });
        self.elements.push(elementField);

        /** Кнопка выхода */
        el = GUI.createElement(ElementButton, {
            x: 730, y: 10,
            srcRest: '/images/button-quit-rest.png',
            srcHover: '/images/button-quit-hover.png',
            srcActive: '/images/button-quit-active.png',
            onClick: function () {
                if (turns === 0) {
                    PBZDialogs.dialogTurnsLoose.reset();
                } else {
                    PBZDialogs.dialogJustQuit.showDialog();
                }
            }
        });
        self.elements.push(el);

        /**
         * ПАНЕЛЬ ОЧКИ
         */
        {
            /** Панель */
            oX = 640;
            oY = 80;
            el = GUI.createElement(ElementImage, {
                x: oX, y: oY, src: '/images/panel-score.png'
            });
            self.elements.push(el);
            /** Надпись */
            el = GUI.createElement(ElementText, {
                x: oX, y: oY + 8, width: 125, text: 'ОЧКИ', alignCenter: true
            });
            self.elements.push(el);
            /** Текст */
            elementScore = GUI.createElement(ElementText, {
                x: oX, y: oY + 40, width: 125, bold: true, alignCenter: true
            });
            self.elements.push(elementScore);
            /** Звезда 1 */
            elementStar1 = GUI.createDom(undefined, {
                x: oX + 20, y: oY + 70
            });
            self.elements.push(elementStar1);
            /** Звезда 2 */
            elementStar2 = GUI.createDom(undefined, {
                x: oX + 20 + 30, y: oY + 70
            });
            self.elements.push(elementStar2);
            /** Звезда 3 */
            elementStar3 = GUI.createDom(undefined, {
                x: oX + 20 + 30 * 2, y: oY + 70
            });
            self.elements.push(elementStar3);
        }

        /**
         * ПАНЕЛЬ ХОДОВ
         */
        {
            oX = 10;
            oY = 80;
            /** Панель */
            el = GUI.createElement(ElementImage, {
                x: oX, y: oY, src: '/images/panel-turns.png'
            });
            self.elements.push(el);
            /** Надпись */
            el = GUI.createElement(ElementText, {
                x: oX, y: oY + 8, width: 125, text: 'ХОДЫ', alignCenter: true
            });
            self.elements.push(el);
            /** Текст */
            elementTurns = GUI.createElement(ElementText, {
                x: oX, y: oY + 40, width: 125, alignCenter: true
            });
            self.elements.push(elementTurns);
        }

        /**
         * ПАНЕЛЬ ЦЕЛИ
         */
        elPanelGoals = GUI.createElement(ElementPanelItems, {
            x: 10, y: 200, title: 'ЦЕЛИ'
        });
        self.elements.push(elPanelGoals);

        /** stuff hummer */
        el = GUI.createElement(ElementStuffButton, {
            x: 650, y: 200,
            fieldName: 'hummerQty',
            srcRest: '/images/button-hummer-rest.png',
            srcHover: '/images/button-hummer-hover.png',
            srcActive: '/images/button-hummer-active.png',
            onClick: function () {
                self.setStuffMode(LogicStuff.STUFF_HUMMER);
            }
        });
        self.elements.push(el);

        /** stuff lightning */
        el = GUI.createElement(ElementStuffButton, {
            x: 650, y: 280,
            fieldName: 'lightningQty',
            srcRest: '/images/button-lightning-rest.png',
            srcHover: '/images/button-lightning-hover.png',
            srcActive: '/images/button-lightning-active.png',
            onClick: function () {
                self.setStuffMode(LogicStuff.STUFF_LIGHTNING);
            }
        });
        self.elements.push(el);

        /** stuff shuffle */
        el = GUI.createElement(ElementStuffButton, {
            x: 650, y: 360,
            fieldName: 'shuffleQty',
            srcRest: '/images/button-shuffle-rest.png',
            srcHover: '/images/button-shuffle-hover.png',
            srcActive: '/images/button-shuffle-active.png',
            onClick: function () {
                self.setStuffMode(LogicStuff.STUFF_SHUFFLE);
            }
        });
        self.elements.push(el);

        /** Кнопка обновить поле, для админов */
        buttonReloadField = GUI.createElement(ElementButton, {
            x: 312, y: 5, width: 25, height: 25,
            srcRest: '/images/button-reload-field-rest.png',
            srcHover: '/images/button-reload-field-hover.png',
            srcActive: '/images/button-reload-field-active.png',
            onClick: function () {
                CAPIMap.setCallbackOnMapsInfo(function () {
                    PageController.showPage(PageMain);
                    PageController.showPage(PageField);
                });
                SAPIMap.reloadLevels();
                SAPIMap.sendMeMapInfo(DataMap.getCurent().id);
            }
        });

        /** Кнопка обновить поле, для админов */
        buttonChangeSpeed = GUI.createElement(ElementButton, {
            x: 312 + 30, y: 5, width: 25, height: 25,
            srcRest: '/images/field-red.png',
            srcHover: '/images/field-red.png',
            srcActive: '/images/field-red.png',
            onClick: function () {
                let standard = 33.33;
                switch (Config.OnIdle.animateInterval) {
                    case standard * 5:
                        buttonChangeSpeed.srcRest = '/images/field-yellow.png';
                        Config.OnIdle.animateInterval = standard;
                        break;
                    case standard :
                        buttonChangeSpeed.srcRest = '/images/field-red.png';
                        Config.OnIdle.animateInterval = standard / 20;
                        break;
                    case standard / 20:
                        buttonChangeSpeed.srcRest = '/images/field-green.png';
                        Config.OnIdle.animateInterval = standard * 5;
                        break;
                    default:
                        Config.OnIdle.animateInterval = standard;
                        break;
                }
                buttonChangeSpeed.redraw();
            }
        });

        /** Dom stuff */
        domStuff = GUI.createDom(null, {x: 190, y: 10});
        domStuff.__dom.style.zIndex = 10000;

        elText = GUI.createElement(ElementText, {
            x: DataCross.app.width / 2 - DataCross.app.width / 1.5 / 2,
            y: DataCross.app.height / 2 - 40 * 2 / 2,
            width: DataCross.app.width / 1.5,
            height: 20 * 2,
            fontSize: 36,
            alignCenter: true
        });

        elTextShadow = GUI.createDom(undefined, {
            x: 0, y: 0, width: DataCross.app.width, height: DataCross.app.height,
            background: "black",
            opacity: 0.3,
        });

        GUI.bind(domStuff, GUI.EVENT_MOUSE_CLICK, function (event, dom) {
            let el;
            /** Передаем клик дальше, теоретически после анимации */
            domStuff.hide();
            el = document.elementFromPoint(event.clientX, event.clientY);
            el.dispatchEvent(new MouseEvent(event.type, event));
            if (stuffMode) domStuff.show();
        });

        GUI.onMouseMove(function (x, y) {
            domStuff.x = x - 25;
            domStuff.y = y - 25;
            domStuff.redraw();
        });
    };

    /**
     * Покажем все элементы на странице.
     */
    this.show = function () {
        if (showed === true) return;
        showed = true;
        loadField();
        for (let i in self.elements) {
            self.elements[i].show();
        }
        self.firstShow();
        if (false
            || SocNet.getType() === SocNet.TYPE_STANDALONE
            || LogicUser.getCurrentUser().id === 1
            || LogicUser.getCurrentUser().socNetUserId === 1
        ) {
            buttonReloadField.show();
            buttonChangeSpeed.show();
        }
    };

    this.isShowed = function () {
        return showed;
    };

    /**
     * Спрачем все элементы на странице.
     */
    this.hide = function () {
        if (showed === false) return;
        showed = false;
        for (let i in self.elements) {
            self.elements[i].hide();
        }
        domStuff.hide();
        elPanelGoals.hide();
        buttonReloadField.hide();
        buttonChangeSpeed.hide();
    };

    /**
     * Загружает поле.
     */
    let loadField = function () {
        let data;
        data = DataPoints.getById(DataPoints.getPlayedId());
        score = 0;
        turns = data.turns;
        goals = DataPoints.copyGoals(data.goals);
        elementField.setLayers(data.layers);
        self.redraw();
    };

    this.firstShow = function () {
        let data;
        elementField.unlock();
        elementField.run();
        data = DataPoints.getById(DataPoints.getPlayedId());
        PBZDialogs.dialogGoals.setGoals(data.goals);
        PBZDialogs.dialogGoals.showDialog();
        noMoreGoals = false;
        LogicWizard.onFieldFirstShow();
    };

    this.redraw = function () {
        if (!showed) return;

        elementScore.setText(score.toString());

        let countStars = DataPoints.countStars(null, null, score);
        elementStar1.backgroundImage = '/images/star-off-middle.png';
        elementStar2.backgroundImage = '/images/star-off-middle.png';
        elementStar3.backgroundImage = '/images/star-off-middle.png';
        if (countStars >= 1) elementStar1.backgroundImage = '/images/star-on-middle.png';
        if (countStars >= 2) elementStar2.backgroundImage = '/images/star-on-middle.png';
        if (countStars >= 3) elementStar3.backgroundImage = '/images/star-on-middle.png';

        elementTurns.setText(turns.toString());
        for (let i in self.elements) {
            self.elements[i].redraw();
        }
        elPanelGoals.items = goals;
        elPanelGoals.redraw();

        if (stuffMode) {
            domStuff.show();
            domStuff.redraw();
        } else {
            domStuff.hide();
        }
        buttonReloadField.redraw();
        buttonChangeSpeed.redraw();
    };

    let noMoreGoals;

    let objectScores = {};
    objectScores[DataObjects.OBJECT_RED] = 10;
    objectScores[DataObjects.OBJECT_GREEN] = 10;
    objectScores[DataObjects.OBJECT_BLUE] = 10;
    objectScores[DataObjects.OBJECT_YELLOW] = 10;
    objectScores[DataObjects.OBJECT_PURPLE] = 10;
    objectScores[DataObjects.OBJECT_RED_SPIDER] = 100;
    objectScores[DataObjects.OBJECT_GREEN_SPIDER] = 100;
    objectScores[DataObjects.OBJECT_POLY_COLOR] = 300;
    objectScores[DataObjects.OBJECT_TREASURES] = 300;
    objectScores[DataObjects.OBJECT_BARREL] = 100;
    objectScores[DataObjects.OBJECT_BOX] = 100;

    this.onDestroyThing = function (objectId, cell) {
        /** Goals */
        decreaseGoal(objectId, 1);

        if (objectScores[objectId]) {
            score += objectScores[objectId];
            //@todo animate score here
        }
        self.redraw();
        LogicWizard.onDestroyThing(cell);
    };

    this.onDestroyLine = function (line) {
        LogicWizard.onDestroyLine(line);
    };

    let decreaseGoal = function (id, qty) {
        noMoreGoals = true;
        goals.forEach(function (goal) {
            if (goal.id === id) {
                goal.count -= qty;
            }
            if (goal.count > 0) noMoreGoals = false;
            if (goal.count < 0) goal.count = 0;
        });
        self.redraw();
    };

    this.onFieldSilent = function () {
        LogicWizard.onFieldSilent();
        if (noMoreGoals) {
            elementField.lock();
            noMoreGoals = false;
            setTimeout(self.finishLevel, Config.OnIdle.animateInterval * 15);
        } else if (turns === 0) {
            PBZDialogs.dialogTurnsLoose.showDialog();
        }
    };

    this.finishLevel = function () {
        let pointId, user, lastScore;
        stuffMode = null;
        Logs.log("finishLevel()", Logs.LEVEL_DETAIL);
        user = LogicUser.getCurrentUser();
        pointId = DataPoints.getPlayedId();
        lastScore = DataPoints.getScore(pointId);
        if (user.nextPointId < pointId + 1) {
            user.nextPointId = pointId + 1;
            LogicUser.updateUserInfo(user);
        }
        if (score > lastScore) {
            SAPIMap.finishLevel(pointId, score);
            DataPoints.setPointUserScore(
                user.id,
                pointId,
                score
            );
        }
        //@todo
        SAPIUser.onPlayFinish();
        //PageBlockPanel.oneHealthHide =false;
        PBZDialogs.dialogGoalsReached.showDialog(pointId);
        PageController.redraw();
    };

    this.beforeTurnUse = function () {
        turns--;
        if (turns === 0 && !noMoreGoals) elementField.lock();
        if (turns === 5) showText('Осталось 5 ходов!');
        self.redraw();
    };

    this.beforeStuffUse = function () {
        switch (stuffMode) {
            case LogicStuff.STUFF_HUMMER:
                SAPIStuff.usedHummer();
                LogicStuff.usedHummer();
                break;
            case LogicStuff.STUFF_LIGHTNING:
                SAPIStuff.usedlightning();
                LogicStuff.usedlightning();
                break;
            case LogicStuff.STUFF_SHUFFLE:
                SAPIStuff.usedShuffle();
                LogicStuff.usedShuffle();
                break;
        }
        stuffMode = null;
        elementField.setStuffMode(stuffMode);
        self.redraw();
    };

    this.setStuffMode = function (mode) {
        switch (mode) {
            case LogicStuff.STUFF_HUMMER:
                if (LogicStuff.getStuff('hummerQty') < 1) {
                    PBZDialogs.dialogStuffShop.showDialog(mode);
                    return;
                }
                domStuff.backgroundImage = '/images/button-hummer-active.png';
                break;
            case LogicStuff.STUFF_LIGHTNING:
                if (LogicStuff.getStuff('lightningQty') < 1) {
                    PBZDialogs.dialogStuffShop.showDialog(mode);
                    return;
                }
                domStuff.backgroundImage = '/images/button-lightning-active.png';
                break;
            case LogicStuff.STUFF_SHUFFLE:
                if (LogicStuff.getStuff('shuffleQty') < 1) {
                    PBZDialogs.dialogStuffShop.showDialog(mode);
                    return;
                }
                domStuff.backgroundImage = '/images/button-shuffle-active.png';
                break;
        }
        stuffMode = mode;
        elementField.setStuffMode(mode);
        self.redraw();
    };

    this.getElementField = function () {
        return elementField;
    };

    this.onWizardFinish = function () {
        showText('Теперь сами!');
    };

    let showText = function (text) {
        elTextShadow.show();
        elText.setText(text);
        elText.show();
        elText.redraw();
        setTimeout(function () {
            elTextShadow.hide();
            elText.hide();
        }, Config.OnIdle.second * 1.1);
    }
};

/** @type {PageBlockField} */
PageBlockField = new PageBlockField;