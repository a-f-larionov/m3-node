ElementDialogMoneyMagazine = function () {
    let self = this;
    this.__proto__ = new ElementDialog();

    this.init = function () {
        let el, offsetX, stepX, offsetY;
        this.__proto__.init.call(this);

        offsetX = 25;
        offsetY = 80;
        stepX = 150;

        GUI.pushParent(self.dom);
        // заголовок диалога
        el = GUI.createElement(ElementText, {
            x: 135, y: 11, width: 230, height: 40,
            text: 'МАГАЗИН'
        });
        self.elements.push(el);

        for (let i = 0; i < 3; i++) {
            el = GUI.createElement(ElementButton, {
                x: offsetX + stepX * i, y: offsetY,
                srcRest: '/images/money_' + (i + 1) + '.png',
                srcHover: '/images/money_' + (i + 1) + '.png',
                srcActive: '/images/money_' + (i + 1) + '.png',
                onClick: function () {
                    SocNet.openOrderDialog(Config.Magazine.items[i].votes);
                }
            });
            self.elements.push(el);

            self.elements.push(GUI.createElement(ElementButton, {
                x: offsetX + stepX * i + 45, y: offsetY + 150 - 45,
                srcRest: '/images/button-add-rest.png',
                srcHover: '/images/button-add-hover.png',
                srcActive: '/images/button-add-active.png',
                onClick: function () {
                    SocNet.openOrderDialog(Config.Magazine.items[i].votes);
                }
            }));
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
        this.__proto__.redraw.call(this);
    };
};




