DialogMoneyShop = function () {
    let self = this;
    this.__proto__ = new Dialog();

    this.init = function () {
        let el, offsetX, stepX, offsetY;
        this.__proto__.init.call(this);

        offsetX = 25;
        offsetY = 60;
        stepX = 150;

        GUI.pushParent(self.dom);
        // заголовок диалога
        el = GUI.createElement(ElementText, {
            x: 135, y: 11, width: 230, height: 40,
            text: 'ПОКУПКА ГОЛОСОВ'
        });
        self.elements.push(el);

        for (let i = 0; i < 3; i++) {
            el = GUI.createElement(ElementButton, {
                x: offsetX + stepX * i, y: offsetY,
                srcRest: '/images/money_' + (i + 1) + '.png',
                srcHover: '/images/money_' + (i + 1) + '.png',
                srcActive: '/images/money_' + (i + 1) + '.png',
                onClick: function () {
                    SocNet.openOrderDialog(DataShop.gold[i].votes);
                    self.closeDialog();
                }
            });
            self.elements.push(el);

            el = GUI.createElement(ElementButton, {
                x: offsetX + stepX * i + 45, y: offsetY + 150 - 45,
                srcRest: '/images/button-add-rest.png',
                srcHover: '/images/button-add-hover.png',
                srcActive: '/images/button-add-active.png',
                onClick: function () {
                    SocNet.openOrderDialog(DataShop.gold[i].votes);
                    self.closeDialog();
                }
            });
            //self.elements.push(el);
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
};




