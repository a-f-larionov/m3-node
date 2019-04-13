ElementDialogPointInfo = function () {
    let self = this;
    this.__proto__ = new ElementDialog();

    /**
     * Точка с которой нажали
     * @type {null}
     */
    this.elementPoint = null;

    /**
     * Кол-во очков на точке
     * @type {null}
     */
    let elTextScore = null;

    /**
     * Номер точки
     * @type {null}
     */
    let elTextPointNumber = null;

    /**
     * Текст : кол-во звёзд на точке
     * @type {null}
     */
    let elTextStarsCount = null;

    /**
     * Точка с которой нажали.
     * @type {null}
     */
    let pointId = null;

    this.init = function () {
        this.__proto__.init.call(this);
        GUI.pushParent(self.dom);
        // кол-во очков на точке
        elTextScore = GUI.createElement(ElementText, {
            x: 50, y: 30, width: 250, height: 40,
            text: ''
        });
        elTextScore.show();

        // номер точки
        elTextPointNumber = GUI.createElement(ElementText, {
            x: 50, y: 50, width: 250, height: 40,
            text: ''
        });
        elTextPointNumber.show();
        // кол-во звёзд
        // номер точки
        elTextStarsCount = GUI.createElement(ElementText, {
            x: 50, y: 70, width: 250, height: 40,
            text: ''
        });
        elTextStarsCount.show();

        // кнопка играть
        GUI.createElement(ElementButton, {
            x: 50, y: 120,
            srcRest: '/images/button-close-rest.png',
            srcHover: '/images/button-close-hover.png',
            srcActive: '/images/button-close-active.png',
            onClick: function () {
                DataPoints.setPlayedId(pointId);
                self.closeDialog();
                PageController.showPage(PageField);
            }
        }).show();

        // кнопка закрыть
        GUI.createElement(ElementButton, {
            x: 280, y: 10, width: 100, height: 40,
            srcRest: '/images/button-close-rest.png',
            srcHover: '/images/button-close-hover.png',
            srcActive: '/images/button-close-active.png',
            onClick: function () {
                self.closeDialog();
            }
        }).show();

        GUI.popParent();
    };

    this.show = function () {
        this.__proto__.show.call(this);
    };

    this.hide = function () {
        this.__proto__.hide.call(this);
    };

    this.redraw = function () {
        let point;
        this.__proto__.redraw.call(this);
        console.log(1);

        if (!this.dialogShowed) return;

        point = DataPoints.getById(pointId);
        console.log(point);
        elTextPointNumber.text = 'point number:' + pointId;
        elTextStarsCount.text = 'stars: ' + DataPoints.countStars(point.id);
        elTextScore.text = 'score: ' + DataPoints.getScore(point.id);

        elTextPointNumber.redraw();
        elTextStarsCount.redraw();
        elTextScore.redraw();
    };

    this.showDialog = function (element) {
        if (element.stateId === ElementPoint.STATE_CLOSE) return;
        pointId = element.pointId;
        this.__proto__.showDialog.call(this);
        self.redraw();
    }
};




