let DialogChestYouWin = function () {
    let self = this;
    this.__proto__ = new Dialog();

    let elText;

    let imagesEls = {};
    let countersEls = {};

    let chestId = null;

    this.init = function () {
        this.__proto__.init.call(this);
        GUI.pushParent(self.dom);

        this.elHeader.setText('Ты нашел!');

        elText = GUI.createElement(ElementText, {x: 40, y: 20, width: 240, height: 80});
        elText.show();

        for (let i = 0; i < 5; i++) {
            imagesEls[i] = GUI.createElement(ElementImage,
                {x: 40 + (i * 50), y: 90, src: ''});

            countersEls[i] = GUI.createElement(ElementText,
                {x: 60 + (i * 50), y: 80 + 60, width: 50});
        }
        GUI.popParent();
    };

    this.redraw = function () {
        let chest, prize;
        this.__proto__.redraw.call(this);
        if (!this.dialogShowed) return;
        chest = DataChests.getById(chestId);

        elText.setText('Собраны все звезды! Ты открыл сундук и нашел там:');

        for (let i = 0; i < 4; i++) {
            prize = chest.prizes[i];
            console.log(prize);
            if (prize) {
                imagesEls[i].src = DataObjects.images[prize.id];
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

    this.showDialog = function (newChestId) {
        chestId = newChestId;
        this.__proto__.showDialog.call(this);
        self.redraw();
    }
};




