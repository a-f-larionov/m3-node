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

    let elementField = null;

    let elementScore = null;

    let elementStar1 = null;
    let elementStar2 = null;
    let elementStar3 = null;

    let elementTurns = null;

    let stuffMode = null;

    let domStuff = null;

    let elPanelGoals;

    let buttonReloadField = null;

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
        el = GUI.createElement(ElementField, {
            centerX: 388.5, centerY: 250,
            onDestroyLine: self.onDestroyLine,
            beforeTurnUse: self.beforeTurnUse,
            afterStuffUse: self.afterStuffUse,
            onFieldSilent: self.onFieldSilent

        });
        elementField = el;
        self.elements.push(el);

        /** Кнопка выхода */
        el = GUI.createElement(ElementButton, {
            x: 720, y: 0,
            srcRest: '/images/button-quit-rest.png',
            srcHover: '/images/button-quit-hover.png',
            srcActive: '/images/button-quit-active.png',
            onClick: function () {
                if (turns === 0) {
                    PageBlockQDialogs.dialogTurnsLoose.reset();
                } else {
                    PageBlockQDialogs.dialogJustQuit.showDialog();
                }
            }
        });
        self.elements.push(el);

        /**
         * ПАНЕЛЬ ОЧКИ
         */
        {
            /** Панель */
            oX = 10;
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
            oX = 640;
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

        /** stuff lighting */
        el = GUI.createElement(ElementStuffButton, {
            x: 650, y: 280,
            fieldName: 'lightingQty',
            srcRest: '/images/button-lighting-rest.png',
            srcHover: '/images/button-lighting-hover.png',
            srcActive: '/images/button-lighting-active.png',
            onClick: function () {
                self.setStuffMode(LogicStuff.STUFF_LIGHTING);
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
            x: 312, y: 5,
            srcRest: '/images/button-reload-field-rest.png',
            srcHover: '/images/button-reload-field-hover.png',
            srcActive: '/images/button-reload-field-active.png',
            onClick: function () {
                CAPIMap.setCallbackOnMapsInfo(loadField);
                SAPIMap.reloadLevels();
                SAPIMap.sendMeMapInfo(DataMap.getCurent().id);
            }
        });

        /** Dom stuff */
        domStuff = GUI.createDom(null, {x: 190, y: 10});
        domStuff.__dom.style.zIndex = 10000;

        GUI.bind(domStuff, GUI.EVENT_MOUSE_CLICK, function (event, dom) {
            /** Передаем клик дальше, теоретически после анимации */
            domStuff.hide();
            el = document.elementFromPoint(event.clientX, event.clientY);
            console.log(el);
            /** Признак каменного поля :) */
            if (el.__dom.fieldX !== undefined && el.__dom.fieldY !== undefined) {
                el.dispatchEvent(new MouseEvent(event.type, event));
            }
            domStuff.show();
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
        if (LogicUser.getCurrentUser().id === 1) {
            buttonReloadField.show();
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
        PageBlockQDialogs.dialogGoals.setGoals(data.goals);
        PageBlockQDialogs.dialogGoals.showDialog();
        setTimeout(function () {
            PageBlockQDialogs.dialogGoals.closeDialog();
        }, 1750 * 100
        );
        noMoreGoals = false;
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
    };

    let noMoreGoals;

    this.onDestroyLine = function (line) {
        score += line.coords.length * 10;

        noMoreGoals = true;
        for (let g in goals) {
            if (goals[g].id === line.gemId) {
                goals[g].count -= line.coords.length;
                if (goals[g].count < 0) goals[g].count = 0;
            }
            if (goals[g].count > 0) {
                noMoreGoals = false;
            }
        }
        self.redraw();
    };

    this.onFieldSilent = function () {
        if (noMoreGoals) {
            elementField.lock();
            noMoreGoals = false;
            setTimeout(self.finishLevel, 500);
        }
    };

    this.finishLevel = function () {
        let pointId, user, lastScore;
        stuffMode = null;
        Logs.log("finishLevel", Logs.LEVEL_DETAIL);
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
        PageBlockQDialogs.dialogGoalsReached.showDialog(pointId);
        PageController.redraw();
    };

    this.beforeTurnUse = function () {
        turns--;
        // and goals
        if (turns === 0 && !noMoreGoals) {
            elementField.lock();
            PageBlockQDialogs.dialogTurnsLoose.showDialog();
        }
        self.redraw();
    };

    this.afterStuffUse = function () {

        switch (stuffMode) {
            case LogicStuff.STUFF_HUMMER:
                SAPIStuff.usedHummer();
                LogicStuff.usedHummer();
                break;
            case LogicStuff.STUFF_LIGHTING:
                SAPIStuff.usedLighting();
                LogicStuff.usedLighting();
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
                    PageBlockQDialogs.dialogStuffShop.showDialog(mode);
                    return;
                }
                domStuff.backgroundImage = '/images/button-hummer-active.png';
                break;
            case LogicStuff.STUFF_LIGHTING:
                if (LogicStuff.getStuff('lightingQty') < 1) {
                    PageBlockQDialogs.dialogStuffShop.showDialog(mode);
                    return;
                }
                domStuff.backgroundImage = '/images/button-lighting-active.png';
                break;
            case LogicStuff.STUFF_SHUFFLE:
                if (LogicStuff.getStuff('shuffleQty') < 1) {
                    PageBlockQDialogs.dialogStuffShop.showDialog(mode);
                    return;
                }
                domStuff.backgroundImage = '/images/button-shuffle-active.png';
                break;
        }
        stuffMode = mode;
        elementField.setStuffMode(mode);
        self.redraw();
    };
};

/** @type {PageBlockField} */
PageBlockField = new PageBlockField;