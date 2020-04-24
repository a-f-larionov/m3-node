let DialogChestYouWin = function () {
    let self = this;
    this.__proto__ = new Dialog();

    let elText;

    let imagesEls = {};
    let countersEls = {};

    this.init = function () {
        this.__proto__.init.call(this);
        GUI.pushParent(self.dom);
        /** Кнопка закрыть */
        GUI.createElement(ElementButton, {
            x: 452, y: 3,
            width: 100, height: 40,
            srcRest: 'button-close-rest.png',
            onClick: function () {
                self.closeDialog();
            }
        }).show();

        elText = GUI.createElement(ElementText, {
            x: 40, y: 20, width: 240, height: 80, text: ''
        });
        elText.show();

        for (let i = 0; i < 4; i++) {
            imagesEls[i] = GUI.createElement(ElementImage, {
                x: 40 + (i * 50), y: 90, src: ''
            });

            countersEls[i] = GUI.createElement(ElementText, {
                x: 60 + (i * 50), y: 80 + 60, width: 50
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

        if (!this.dialogShowed) return;

        let chest, prize;
        chest = DataChests.getById(self.chestId);

        elText.setText('Собраны все звезды! Ты открыл сундук и нашел там:');
        for (let i = 0; i < 4; i++) {
            prize = chest.prizes[i];
            if (prize) {
                imagesEls[i].src = DataPrizes.getImageFor(prize);
                countersEls[i].setText(prize.count);

                imagesEls[i].show();
                countersEls[i].show();
                countersEls[i].redraw();
                imagesEls[i].redraw();
            } else {
                imagesEls[i].hide();
                countersEls[i].hide();
            }
        }

        elText.redraw();
    };

    this.showDialog = function () {
        this.__proto__.showDialog.call(this);
        self.redraw();
    }
};




