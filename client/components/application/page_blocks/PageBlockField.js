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

    let elementDialogGoals = false;

    let elementDialogGoalsReached = false;

    let elementDialogTurnsLoose = false;

    let elementDialogJustQuit = false;

    let elementField = null;

    let elementScore = null;

    let elementStars = null;

    let elementTurns = null;

    let stuffMode = null;

    let domStuff = null;

    let elPanelGoals;

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
        let el;

        // игровое поле
        el = GUI.createElement(ElementField, {
            centerX: 378, centerY: 250,
            onDestroyLine: self.onDestroyLine,
            beforeTurnUse: self.beforeTurnUse,
            afterStuffUse: self.afterStuffUse
        });
        elementField = el;
        this.elements.push(el);

        // кнопка выхода
        el = GUI.createElement(ElementButton, {
            x: 720, y: 0,
            srcRest: '/images/button-quit-rest.png',
            srcHover: '/images/button-quit-hover.png',
            srcActive: '/images/button-quit-active.png',
            onClick: function () {
                if (turns === 0) {
                    elementDialogTurnsLoose.reset();
                } else {
                    elementDialogJustQuit.showDialog();
                }
            }
        });
        this.elements.push(el);

        // очки
        elementScore = GUI.createElement(ElementText, {
            x: 20, y: 100, width: 100,
            bold: true,
            alignCenter: false
        });
        this.elements.push(elementScore);

        // звезды
        elementStars = GUI.createElement(ElementText, {
            x: 20, y: 120,
            bold: true,
            alignCenter: false,
            width: 100
        });
        this.elements.push(elementStars);

        // панель ходов
        el = GUI.createElement(ElementImage, {
            x: 650, y: 80, src: '/images/panel-turns.png'
        });
        this.elements.push(el);

        // текст - ХОДЫ:
        el = GUI.createElement(ElementText, {
            x: 663, y: 90, width: 80, text: 'ХОДЫ'
        });
        this.elements.push(el);

        // ходы
        elementTurns = GUI.createElement(ElementText, {
            x: 663, y: 123, width: 80
        });
        this.elements.push(elementTurns);
        /*
                el = GUI.createDom(undefined, {
                    x: 600, y: 100,
                    width: 200, height: 100
                });
                this.elements.push(el);
                */
//@todo move it to ElementGoaldsElement
        elPanelGoals = GUI.createElement(ElementPanelItems, {
            x: 10, y: 160, title: 'ЦЕЛИ'
        });
        self.elements.push(elPanelGoals);

        elementDialogGoals = GUI.createElement(ElementDialogGoals, {});
        self.elements.push(elementDialogGoals);

        elementDialogGoalsReached = GUI.createElement(ElementDialogGoalsReached, {});
        self.elements.push(elementDialogGoalsReached);

        elementDialogTurnsLoose = GUI.createElement(ElementDialogTurnLoose, {});

        elementDialogJustQuit = GUI.createElement(ElementDialogJustQuit, {});

        // stuff hummer
        el = GUI.createElement(ElementStuffButton, {
            x: 680, y: 200,
            fieldName: 'hummerQty',
            srcRest: '/images/button-hummer-rest.png',
            srcHover: '/images/button-hummer-hover.png',
            srcActive: '/images/button-hummer-active.png',
            onClick: function () {
                self.setStuffMode(LogicStuff.STUFF_HUMMER);
            }
        });
        this.elements.push(el);
        // stuff shuffle
        el = GUI.createElement(ElementStuffButton, {
            x: 680, y: 300,
            fieldName: 'shuffleQty',
            srcRest: '/images/button-shuffle-rest.png',
            srcHover: '/images/button-shuffle-hover.png',
            srcActive: '/images/button-shuffle-active.png',
            onClick: function () {
                self.setStuffMode(LogicStuff.STUFF_SHUFFLE);
            }
        });
        this.elements.push(el);
        // stuff lighting
        el = GUI.createElement(ElementStuffButton, {
            x: 680, y: 400,
            fieldName: 'lightingQty',
            srcRest: '/images/button-lighting-rest.png',
            srcHover: '/images/button-lighting-hover.png',
            srcActive: '/images/button-lighting-active.png',
            onClick: function () {
                self.setStuffMode(LogicStuff.STUFF_LIGHTING);
            }
        });
        this.elements.push(el);

        // dom stuff
        domStuff = GUI.createDom(null, {
            x: 190, y: 10
        });
        GUI.bind(domStuff, GUI.EVENT_MOUSE_CLICK, function (event, dom) {
            // передаем клик дальше, теоретически после анимации
            domStuff.hide();
            el = document.elementFromPoint(event.clientX, event.clientY);
            el.dispatchEvent(new MouseEvent(event.type, event));
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
        this.loadField();
        for (let i in self.elements) {
            self.elements[i].show();
        }
        this.firstShow();
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
    };

    this.loadField = function () {
        let data;
        data = DataPoints.getById(DataPoints.getPlayedId());
        score = 0;
        turns = data.turns;
        goals = DataPoints.copyGoals(data.goals);
        elementField.setLayers(data.layers);
        this.redraw();
    };

    this.firstShow = function () {
        // run fall down
        let data;
        elementField.unlock();
        //elementField.fillRandom();
        elementField.run();
        data = DataPoints.getById(DataPoints.getPlayedId());
        elementDialogGoals.setGoals(data.goals);
        elementDialogGoals.showDialog();
        setTimeout(function () {
            elementDialogGoals.closeDialog();
        }, 1750 * 100
        );
    };

    /**
     *
     */
    this.redraw = function () {
        if (!showed) return;
        elementScore.setText('очки: ' + score);
        elementStars.setText('звёзд: ' + DataPoints.countStars(null, null, score));
        elementTurns.setText(turns.toString());
        for (let i in self.elements) {
            self.elements[i].redraw();
        }
        elPanelGoals.items  = goals;
        elPanelGoals.redraw();

        if (stuffMode) {
            domStuff.show();
            domStuff.redraw();
        } else {
            domStuff.hide();
        }
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
        if (noMoreGoals) {
            elementField.lock();
            setTimeout(self.finishLevel, 1000);
        }
    };

    this.finishLevel = function () {
        let pointId, user, lastScore;
        Logs.log("finishLevel", Logs.LEVEL_DETAIL);
        user = LogicUser.getCurrentUser();
        pointId = DataPoints.getPlayedId();
        lastScore = DataPoints.getScore(pointId);
        if (user.currentPoint < pointId + 1) {
            user.currentPoint = pointId + 1;
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
        elementDialogGoalsReached.showDialog();
    };

    this.beforeTurnUse = function () {
        turns--;
        // and goals
        if (turns === 0 && !noMoreGoals) {
            elementField.lock();
            elementDialogTurnsLoose.showDialog();
            LogicUser.onTurnsLoose();
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
        stuffMode = mode;
        switch (stuffMode) {
            case LogicStuff.STUFF_HUMMER:
                if (LogicStuff.getStuff('hummerQty') < 1) return;
                domStuff.backgroundImage = '/images/button-hummer-active.png';
                break;
            case LogicStuff.STUFF_LIGHTING:
                if (LogicStuff.getStuff('lightingQty') < 1) return;
                domStuff.backgroundImage = '/images/button-lighting-active.png';
                break;
            case LogicStuff.STUFF_SHUFFLE:
                if (LogicStuff.getStuff('shuffleQty') < 1) return;
                domStuff.backgroundImage = '/images/button-shuffle-active.png';
                break;
        }
        elementField.setStuffMode(mode);
        self.redraw();
    };
};

PageBlockField = new PageBlockField;