ElementDialogGoals = function () {
    let self = this;
    this.__proto__ = new ElementDialog();

    let goalsImagesEls = {};
    let goalsCounterEls = {};

    this.init = function () {
        this.__proto__.init.call(this);
        GUI.pushParent(self.dom);
        GUI.createElement(ElementText, {
            x: 50,
            y: 30,
            width: 250,
            height: 40,
            text: 'Ваши цели:'
        }).show();

        for (let i in DataPoints.objectImages) {
        // список целей - картинки
            goalsImagesEls[i] =
                GUI.createElement(ElementImage, {
                    x: 200 + i * (DataPoints.BLOCK_WIDTH + 5),
                    y: 50,
                    src: DataPoints.objectImages[i]
                });
        // список целей - кол-во
            goalsCounterEls[i] =
                GUI.createElement(ElementText, {
                    x: 100 + i * (DataPoints.BLOCK_WIDTH + 5),
                    y: 50 + DataPoints.BLOCK_HEIGHT + 5,
                    width: DataPoints.BLOCK_WIDTH
                });
        }
        GUI.popParent();
    };

    this.show = function () {
        this.__proto__.show.call(this);
    };

    this.hide = function () {
        this.__proto__.hide.call(this);
    };

    this.redraw = function () {

        this.__proto__.redraw.call(this);
    };

    this.setGoals = function (goals) {
        for (let i in this.elements) {
            this.elements[i].hide();
        }
        this.elements = [];
        let offsetX;
        offsetX = 0;
        for (let i in goals) {

            goalsImagesEls[goals[i].id].x = 100 + offsetX;
            goalsCounterEls[goals[i].id].x = 100 + 25 + offsetX;
            goalsCounterEls[goals[i].id].setText(goals[i].count);
            this.elements.push(goalsImagesEls[goals[i].id]);
            this.elements.push(goalsCounterEls[goals[i].id]);
            offsetX += DataPoints.BLOCK_WIDTH + 5;
        }
        for (let i in this.elements) {
            this.elements[i].redraw();
            this.elements[i].show();
        }
    };
};




