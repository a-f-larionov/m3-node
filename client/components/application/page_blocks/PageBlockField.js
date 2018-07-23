/**
 * Страница с игровым полем
 * @constructor
 */
PageBlockField = function PageBlockField() {
    var self = this;

    /**
     * Показывать ли страницу.
     * @type {boolean}
     */
    var showed = false;

    var elementDialogGoals = false;

    var elementField = null;

    let elementScore = null;

    let elementTurns = null;

    let gaolsImagesEls = {};

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
            srcRest: '/images/field-red.png',
            srcHover: '/images/field-green.png',
            srcActive: '/images/field-blue.png',
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
            x: 100,
            y: 100,
            fontSize: 36,
            bold: true,
            alignCenter: true,
            width: 30
        });

        elementScore.setText('score: ?');
        this.elements.push(elementScore);

        elementTurns = GUI.createElement(ElementText, {
            x: 300,
            y: 100,
            fontSize: 36,
            bold: true,
            aligntCenter: true,
            width: 30
        });

        elementTurns.setText('turns: ?');
        this.elements.push(elementTurns);

        element = GUI.createDom(undefined, {
            x: 600,
            y: 100,
            width: 200,
            height: 100
        });
        this.elements.push(element);

        elementDialogGoals = GUI.createElement(ElementDialogGoals, {
            src: '/images/window.png',
            width: 342,
            height: 200
        });
        self.elements.push(elementDialogGoals);
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
    };

    /**
     * Настройка перед отрисовкой.
     */
    this.preset = function () {

    };

    this.loadField = function () {
        let data;
        data = DataPoints.getById(DataPoints.getCurrentPointId());
        score = 0;
        turns = data.turns;
        elementField.setField(data.field);
    };

    this.firstShow = function () {
        // run fall down
        let data;
        elementField.fillRandom();
        elementField.fallDown();
        data = DataPoints.getById(DataPoints.getCurrentPointId());
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
        if (!showed)return;
        self.preset();
        elementScore.setText('score: ' + score);
        elementTurns.setText('turns: ' + turns);
        for (var i in self.elements) {
            self.elements[i].redraw();
        }
    };

    this.onDestroyLine = function (line) {
        score += line.coords.length * 100;
        self.redraw();
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