ElementDialogBuyStuff = function () {
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
        // заголовок диалога
        el = GUI.createElement(ElementText, {
            x: 135, y: 11, width: 230, height: 40,
            text: 'МАГАЗИН'
        });
        self.elements.push(el);

        for (let i = 0; i < 3; i++) {
            el = GUI.createElement(ElementButton, {
                x: offsetX + stepX * i, y: offsetY,
                srcRest: '/images/shop-hummer-2.png',
                srcHover: '/images/shop-hummer-2.png',
                srcActive: '/images/shop-hummer-2.png',
                onClick: function () {
                    self.buyStuff(i);
                }
            });
            items.push(el);
            self.elements.push(el);

            el = GUI.createElement(ElementButton, {
                x: offsetX + stepX * i + 45, y: offsetY + 150 - 25,
                srcRest: '/images/button-add-rest.png',
                srcHover: '/images/button-add-hover.png',
                srcActive: '/images/button-add-active.png',
                itemNumber: i,
                onClick: function () {
                    self.buyStuff(i);
                }
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
        }).show();

        GUI.popParent();
    };

    this.showDialog = function (newStuffId) {
        stuffId = newStuffId;
        self.redraw();
        this.__proto__.showDialog.call(this);
    };

    this.redraw = function () {
        let data;
        if (stuffId) {
            switch (stuffId) {
                case LogicStuff.STUFF_HUMMER:
                    data = DataShop.hummers;
                    break;
                case LogicStuff.STUFF_LIGHTING:
                    data = DataShop.lighting;
                    break;
                case LogicStuff.STUFF_SHUFFLE:
                    data = DataShop.shuffle;
                    break;
            }
            // бновить картинки товаров
            for (let i = 0; i < 3; i++) {
                items[i].srcRest = data[i].imageSrc;
                items[i].srcHover = data[i].imageSrc;
                items[i].srcActive = data[i].imageSrc;
            }
        }
        this.__proto__.redraw.call(this);
    };

    this.buyStuff = function (itemIndex) {

        let userGold, quantity, buyFunc, giveFunc;
        userGold = LogicStuff.getStuff('goldQty');

        switch (stuffId) {
            case LogicStuff.STUFF_HUMMER:
                buyFunc = SAPIStuff.buyHummer;
                giveFunc = LogicStuff.giveAHummer;
                shopItem = DataShop.hummers[itemIndex];
                break;
            case LogicStuff.STUFF_SHUFFLE:
                buyFunc = SAPIStuff.buyShuffle;
                giveFunc = LogicStuff.giveAShuffle;
                shopItem = DataShop.shuffle[itemIndex];
                break;
            case LogicStuff.STUFF_LIGHTING:
                buyFunc = SAPIStuff.buyLighting;
                giveFunc = LogicStuff.giveALighting;
                shopItem = DataShop.lighting[itemIndex];
                break;
        }

        if (userGold < shopItem.gold) {
            PageBlockPanel.showDialogMoneyShop();
            self.reset();
            self.showDialog(stuffId);
        } else {
            buyFunc(itemIndex);
            giveFunc(shopItem.quantity);
            LogicStuff.usedGold(shopItem.gold);
            self.closeDialog();
        }
        PageController.redraw();
    };
};




