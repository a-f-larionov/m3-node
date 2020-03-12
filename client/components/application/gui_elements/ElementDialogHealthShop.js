ElementDialogHealthShop = function () {
    let self = this;
    this.__proto__ = new ElementDialog();

    let stuffId = null;

    let items = [];

    this.init = function () {
        let el, offsetX, stepX, offsetY;
        this.__proto__.init.call(this);

        offsetX = 30;
        offsetY = 80;
        stepX = 145;

        GUI.pushParent(self.dom);

        /** Заголовок диалога */
        el = GUI.createElement(ElementText, {
            x: 135, y: 11, width: 230, height: 40,
            text: 'МАГАЗИН'
        });
        self.elements.push(el);

        for (let i = 0; i < 3; i++) {
            el = GUI.createElement(ElementButton, {
                x: offsetX + stepX * i, y: offsetY,
                srcRest: '/images/shop-health-' + (i+1) + '.png',
                srcHover: '/images/shop-health-' + (i+1) + '.png',
                srcActive: '/images/shop-health-' + (i+1) + '.png',
                onClick: function () {
                    self.buyHealth(i);
                }
            });
            items.push(el);
            self.elements.push(el);
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


    this.buyHealth = function (itemIndex) {

        let userGold, buyFunc, giveFunc, item;
        userGold = LogicStuff.getStuff('goldQty');

        buyFunc = SAPIStuff.buyHealth;
        giveFunc = LogicStuff.giveAHealth;
        item = DataShop.health[itemIndex];

        if (userGold < item.gold) {
            PageBlockPanel.showDialogMoneyShop();
            self.reset();
            self.showDialog();
        } else {
            buyFunc(itemIndex);
            giveFunc(item.quantity);
            LogicStuff.usedGold(item.gold);
            self.closeDialog();
        }
        PageController.redraw();
    };
};




