let DialogChestNeedStars = function () {
    let self = this;
    this.__proto__ = new Dialog();

    let elText;

    this.init = function () {
        this.__proto__.init.call(this);
        GUI.pushParent(self.dom);
        /** Кнопка закрыть */
        GUI.createElement(ElementButton, {
            x: 452, y: 3,
            width: 100, height: 40,
            srcRest: 'button-close-rest.png',
            srcHover: 'button-close-hover.png',
            srcActive: 'button-close-active.png',
            onClick: function () {
                self.closeDialog();
            }
        }).show();

        elText = GUI.createElement(ElementText, {
            x: 50, y: 70, width: 260, height: 80, text: ''
        });
        elText.show();

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

        elText.setText('Нужно собрать еще :' + (this.goalStars - this.mapStars) + ' звезд(ы)');
        elText.redraw();
    };

    this.showDialog = function () {
        this.__proto__.showDialog.call(this);
        self.redraw();
    }
};




