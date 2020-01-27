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

    let goalsImagesEls = {};

    let goalsCounterEls = {};

    let stuffMode = null;

    let domStuff = null;

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

        el = GUI.createElement(ElementField, {
            centerX: 388, centerY: 250,
            onDestroyLine: self.onDestroyLine,
            beforeTurnUse: self.beforeTurnUse,
            afterStuffUse: self.afterStuffUse
        });
        elementField = el;
        this.elements.push(el);

        // close
        el = GUI.createElement(ElementButton, {
            x: 720, y: 0,
            srcRest: '/images/button-close-rest.png',
            srcHover: '/images/button-close-hover.png',
            srcActive: '/images/button-close-active.png',
            onClick: function () {
                if (turns === 0) {
                    elementDialogTurnsLoose.reset();
                } else {
                    elementDialogJustQuit.showDialog();
                }
            }
        });
        this.elements.push(el);

        elementScore = GUI.createElement(ElementText, {
            x: 20, y: 100,
            bold: true,
            alignCenter: false,
            width: 100
        });
        elementScore.setText('score: ?');
        this.elements.push(elementScore);

        elementStars = GUI.createElement(ElementText, {
            x: 20, y: 120,
            bold: true,
            alignCenter: false,
            width: 100
        });
        elementStars.setText('stars: ?');
        this.elements.push(elementStars);

        elementTurns = GUI.createElement(ElementText, {
            x: 20, y: 150,
            bold: true,
            alignCenter: false,
            width: 100
        });

        elementTurns.setText('');
        this.elements.push(elementTurns);

        el = GUI.createDom(undefined, {
            x: 600, y: 100,
            width: 200,
            height: 100
        });
        this.elements.push(el);

        for (let id in DataPoints.objectImages) {
            el = GUI.createElement(ElementImage, {
                x: 10 + (id - 1) * DataPoints.BLOCK_WIDTH,
                y: 200,
                width: 50, height: 50,
                src: DataPoints.objectImages[id]
            });
            goalsImagesEls[id] = el;
            el = GUI.createElement(ElementText, {
                x: 10 + (id - 1) * DataPoints.BLOCK_WIDTH,
                y: 200 + DataPoints.BLOCK_HEIGHT,
                width: DataPoints.BLOCK_WIDTH,
                alignCenter: true
            });
            goalsCounterEls[id] = el;
        }

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
        for (let i in goalsImagesEls) {
            goalsImagesEls[i].hide();
        }
        for (let i in goalsCounterEls) {
            goalsCounterEls[i].hide();
        }
        domStuff.hide();
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
            }, 1750 *100
        );
    };

    /**
     *
     */
    this.redraw = function () {
        if (!showed) return;
        elementScore.setText('очки: ' + score);
        elementStars.setText('звёзд: ' + DataPoints.countStars(null, null, score));
        elementTurns.setText('ходы: ' + turns);
        for (var i in self.elements) {
            self.elements[i].redraw();
        }

        // goals indicatios
        for (let i in goalsImagesEls) {
            goalsImagesEls[i].hide();
        }
        for (let i in goalsCounterEls) {
            goalsCounterEls[i].hide();
        }
        let offsetX;
        offsetX = 0;

        for (let i in goals) {

            goalsImagesEls[goals[i].id].x = 10 + offsetX;
            goalsImagesEls[goals[i].id].show();

            goalsCounterEls[goals[i].id].x = 10 + offsetX;
            goalsCounterEls[goals[i].id].setText(goals[i].count);
            goalsCounterEls[goals[i].id].show();

            offsetX += DataPoints.BLOCK_WIDTH + 5;
        }
        if (stuffMode) {
            domStuff.show();
            domStuff.redraw();
        } else {
            domStuff.hide();
        }
    };

    let noMoreGoals;

    this.onDestroyLine = function (line) {
        let objId, p;
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
        var pointId, user, lastScore;
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