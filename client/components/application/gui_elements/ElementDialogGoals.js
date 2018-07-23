ElementDialogGoals = function () {
    let self = this;
    this.__proto__ = new ElementDialog();

    let goalsImagesEls = {};
    let goalsCounterEls = {};

    this.init = function () {
        this.__proto__.init.call(this);

        for (let i in DataPoints.objectImages) {

            goalsImagesEls[i] =
                GUI.createElement(ElementImage, {
                    x: 10 + i * (DataPoints.BLOCK_WIDTH + 5),
                    y: 10,
                    src: DataPoints.objectImages[i]
                }, self.dom)


            goalsCounterEls[i] =
                GUI.createElement(ElementText, {
                    x: 10 + i * (DataPoints.BLOCK_WIDTH + 5),
                    y: 10 + DataPoints.BLOCK_HEIGHT + 5,
                    width: DataPoints.BLOCK_WIDTH
                }, self.dom);

        }
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

            goalsImagesEls[goals[i].id].x = 10 + offsetX;
            goalsCounterEls[goals[i].id].x = 10 + offsetX;
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




