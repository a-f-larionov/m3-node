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

        elText = GUI.createElement(ElementText, {x: 10, y: 80, width: 480, height: 50});
        elText.setText('Собраны все звезды! \r\nТы открыл сундук и нашел там:');
        elText.show();

        for (let i = 0; i < 8; i++) {
            imagesEls[i] = GUI.createElement(ElementImage, {y: 155, width: 50, height: 50});

            countersEls[i] = GUI.createElement(ElementText, {y: 220, width: 50});
        }
        GUI.popParent();
    };

    this.redraw = function () {
        let chest;
        this.__proto__.redraw.call(this);
        if (!this.dialogShowed) return;
        chest = DataChests.getById(chestId);

        let sX;
        sX = Images.getWidth('window-2.png') / 2
            - ((chest.prizes.length) * 50) / 2
            - (chest.prizes.length - 1) * 25 / 2;

        chest.prizes.forEach(function (prize, i) {
            let img = imagesEls[i];
            let cnt = countersEls[i];
            img.src = DataObjects.images[prize.id];
            cnt.setText('x' + prize.count);


            img.x = sX + (i * 50) + (i) * 5;

            cnt.x = img.x;

            img.show();
            cnt.show();

            cnt.redraw();
            img.redraw();
        });

        elText.redraw();
    };

    this.showDialog = function (newChestId) {
        chestId = newChestId;
        this.__proto__.showDialog.call(this);
        self.redraw();
    }
};




