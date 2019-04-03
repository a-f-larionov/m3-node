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

    let elementDialogTurnLoose = false;

    let elementField = null;

    let elementScore = null;

    let elementTurns = null;

    let goalsImagesEls = {};

    let goalsCounterEls = {};

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
        let element;

        element = GUI.createElement(ElementField, {
            centerX: 388,
            centerY: 250,
            onDestroyLine: self.onDestroyLine,
            onTurnUse: self.onTurnUse
        });
        elementField = element;
        this.elements.push(element);

        // close
        element = GUI.createElement(ElementButton, {
            x: 10,
            y: 10,
            srcRest: '/images/button-close-rest.png',
            srcHover: '/images/button-close-hover.png',
            srcActive: '/images/button-close-active.png',
            onClick: function () {
                PageController.showPage(PageMain);
            }
        });
        this.elements.push(element);

        // fall
        element = GUI.createElement(ElementButton, {
            x: 100,
            y: 10,
            srcRest: '/images/field-red.png',
            srcHover: '/images/field-green.png',
            srcActive: '/images/field-blue.png',
            onClick: function () {
                elementField.fallDown();
            }
        });
        this.elements.push(element);

        // destroy lines
        element = GUI.createElement(ElementButton, {
            x: 200,
            y: 10,
            srcRest: '/images/field-red.png',
            srcHover: '/images/field-green.png',
            srcActive: '/images/field-blue.png',
            onClick: function () {
                elementField.destroyLines();
            }
        });
        this.elements.push(element);

        elementScore = GUI.createElement(ElementText, {
            x: 20,
            y: 100,
            fontSize: 42,
            bold: true,
            alignCenter: false,
            width: 100
        });

        elementScore.setText('score: ?');
        this.elements.push(elementScore);

        elementTurns = GUI.createElement(ElementText, {
            x: 20,
            y: 150,
            fontSize: 42,
            bold: true,
            alignCenter: false,
            width: 100
        });

        elementTurns.setText('');
        this.elements.push(elementTurns);

        element = GUI.createDom(undefined, {
            x: 600,
            y: 100,
            width: 200,
            height: 100
        });
        this.elements.push(element);

        for (let id in DataPoints.objectImages) {
            element = GUI.createElement(ElementImage, {
                x: 10 + (id - 1) * DataPoints.BLOCK_WIDTH,
                y: 200,
                width: 50,
                height: 50,
                src: DataPoints.objectImages[id]
            });
            goalsImagesEls[id] = element;
            element = GUI.createElement(ElementText, {
                x: 10 + (id - 1) * DataPoints.BLOCK_WIDTH,
                y: 200 + DataPoints.BLOCK_HEIGHT,
                width: DataPoints.BLOCK_WIDTH,
                alignCenter: true
            });
            goalsCounterEls[id] = element;
        }

        elementDialogGoals = GUI.createElement(ElementDialogGoals, {
            src: '/images/window.png',
            width: 342,
            height: 200
        });
        self.elements.push(elementDialogGoals);

        elementDialogGoalsReached = GUI.createElement(ElementDialogGoalsReached, {
            src: '/images/window.png',
            width: 342,
            height: 200
        });
        self.elements.push(elementDialogGoalsReached);
    };

    /**
     * Покажем все элементы на странице.
     */
    this.show = function () {
        if (showed === true) return;
        showed = true;
        this.loadField();
        for (var i in self.elements) {
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
        for (var i in self.elements) {
            self.elements[i].hide();
        }
        for (let i in goalsImagesEls) {
            goalsImagesEls[i].hide();
        }
        for (let i in goalsCounterEls) {
            goalsCounterEls[i].hide();
        }
    };

    /**
     * Настройка перед отрисовкой.
     */
    this.preset = function () {

    };

    this.loadField = function () {
        let data;
        data = DataPoints.getById(DataPoints.getPlayedId());
        score = 0;
        turns = data.turns;
        goals = DataPoints.copyGoals(data.goals);
        elementField.setField(data.field);
        this.redraw();
    };

    this.firstShow = function () {
        // run fall down
        let data;
        elementField.unlock();
        elementField.fillRandom();
        elementField.fallDown();
        data = DataPoints.getById(DataPoints.getPlayedId());
        elementDialogGoals.setGoals(data.goals);
        elementDialogGoals.showDialog();
        setTimeout(function () {
                elementDialogGoals.closeDialog();
            }, 1750
        );
    };

    /**
     *
     */
    this.redraw = function () {
        if (!showed) return;
        self.preset();
        elementScore.setText('очки: ' + score);
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
    };

    this.onDestroyLine = function (line) {
        let objId, p;
        score += line.coords.length * 10;
        let noMoreGoals;

        noMoreGoals = true;
        for (let g in goals) {
            if (goals[g].id == line.gemId) {
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
        console.log(user, pointId);
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

    this.onTurnUse = function () {
        turns--;
        if (turns == 0) {
            //@Todo
        }
        self.redraw();
    }
};

PageBlockField = new PageBlockField;