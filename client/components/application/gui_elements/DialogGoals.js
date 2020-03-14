DialogGoals = function () {
    let self = this;
    this.__proto__ = new Dialog();

    let goalsImagesEls = {};
    let goalsCounterEls = {};

    this.init = function () {
        this.__proto__.init.call(this);
        GUI.pushParent(self.dom);
        // заголовок
        GUI.createElement(ElementText, {
            x: 150, y: 13,
            width: 200, height: 40,
            text: 'ЦЕЛИ'
        }).show();

        // список целей
        for (let i in DataPoints.objectImages) {
            // список целей - картинки
            goalsImagesEls[i] =
                GUI.createElement(ElementImage, {
                    x: 200 + i * (DataPoints.BLOCK_WIDTH + 5),
                    y: 125,
                    src: DataPoints.objectImages[i]
                });
            // список целей - кол-во
            goalsCounterEls[i] =
                GUI.createElement(ElementText, {
                    x: 100 + i * (DataPoints.BLOCK_WIDTH + 5),
                    y: 125 + DataPoints.BLOCK_HEIGHT + 5,
                    width: DataPoints.BLOCK_WIDTH
                });
        }

        // кнопка закрыть
        GUI.createElement(ElementButton, {
                x: 452, y: 3,
                srcRest: '/images/button-close-rest.png',
                srcHover: '/images/button-close-hover.png',
                srcActive: '/images/button-close-active.png',
                onClick: function () {
                    self.closeDialog();
                }
            }, this.dom
        ).show();

        GUI.popParent();
    };

    this.setGoals = function (goals) {
        for (let i in this.elements) {
            this.elements[i].hide();
        }
        this.elements = [];
        let offsetX;
        offsetX = 0;
        for (let i in goals) {

            goalsImagesEls[goals[i].id].x = 175 + offsetX;
            goalsCounterEls[goals[i].id].x = 175  + offsetX;
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