ElementDialogChestNeedStars = function () {
    let self = this;
    this.__proto__ = new ElementDialog();

    this.width = 342;
    this.height = 200;

    this.src = '/images/window.png';

    let elText;

    this.init = function () {
        this.__proto__.init.call(this);
        GUI.pushParent(self.dom);
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




