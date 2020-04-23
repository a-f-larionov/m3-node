let DialogGoals = function DialogGoals() {
    let self = this;
    this.__proto__ = new Dialog();

    let goalsImagesEls = {};
    let goalsCounterEls = {};

    this.init = function () {
        this.__proto__.width = 250;
        this.__proto__.height = 150;
        this.__proto__.src = '/images/window-3.png';
        this.__proto__.bottomPosition = 100 + 172 / 2;

        this.__proto__.init.call(this);
        this.__proto__.onShowComplete = this.onShowComplete;

        GUI.pushParent(self.dom);
        /** Заголовок */
        //GUI.createElement(ElementText, {x: 150, y: 13, width: 200, height: 40, text: 'ЦЕЛИ'}).show();

        /** Список целей */
        for (let i in DataPoints.objectImages) {
            /** Список целей - картинки */
            goalsImagesEls[i] = GUI.createElement(ElementImage, {
                x: 200 + i * (DataPoints.BLOCK_WIDTH + 5),
                y: 30,
                src: DataPoints.objectImages[i]
            });
            /** Список целей - кол-во */
            goalsCounterEls[i] = GUI.createElement(ElementText, {
                x: 100 + i * (DataPoints.BLOCK_WIDTH + 5),
                y: 30 + DataPoints.BLOCK_HEIGHT + 5,
                width: DataPoints.BLOCK_WIDTH
            });
        }

        /** Кнопка закрыть */
        GUI.createElement(ElementButton, {
                x: 195, y: 0,
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

    this.onShowComplete = function () {
        setTimeout(function () {
            self.closeDialog();
        }, Config.OnIdle.second * 1.2);
    };

    this.setGoals = function (goals) {
        let offsetX, startX;
        for (let i in this.elements) {
            this.elements[i].hide();
        }
        this.elements = [];
        startX = Images.getWidth(this.src) / 2
            - goals.length * (DataPoints.BLOCK_WIDTH + 5) / 2
        ;

        offsetX = 0;
        for (let i in goals) {

            goalsImagesEls[goals[i].id].x = startX + offsetX;
            goalsCounterEls[goals[i].id].x = startX + offsetX;
            goalsCounterEls[goals[i].id].setText(goals[i].count);
            this.elements.push(goalsImagesEls[goals[i].id]);
            this.elements.push(goalsCounterEls[goals[i].id]);
            offsetX += DataPoints.BLOCK_WIDTH + 5;
        }
        for (let i in this.elements) {
            this.elements[i].show();
            this.elements[i].redraw();
        }
    };
};