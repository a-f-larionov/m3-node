let DialogStuffShop = function () {
    let self = this;
    this.__proto__ = new Dialog();

    let stuffId = null;

    let items = [];

    let locked = false;

    /**
     * Чтобы пользователь на купил 2ыйнм кликом
     * @returns {boolean}
     */
    let lock = function () {
        if (locked) return true;
        locked = true;
        setTimeout(function () {
            locked = false;
        }, 1000);
    };

    this.init = function () {
        let el, offsetX, stepX, offsetY;
        this.__proto__.init.call(this);

        offsetX = 30;
        offsetY = 80;
        stepX = 145;

        GUI.pushParent(self.dom);

        this.setTitle('МАГАЗИН');

        for (let i = 0; i < 3; i++) {
            el = GUI.createElement(ElementMoneyCount, {
                x: offsetX + stepX * i, y: offsetY,
                productImg: '', productCount: 0, goldCount: 0,
                counterOffset: 20,
                onClick: function () {
                    self.buyStuff(i);
                }
            });
            items.push(el);
            self.elements.push(el);
        }

        GUI.popParent();
    };

    this.showDialog = function (newStuffId) {
        this.__proto__.showDialog.call(this);
        stuffId = newStuffId;
        self.redraw();
        SAPILogs.showStuffShopDialog(newStuffId);
    };

    this.redraw = function () {
        let data;
        if (stuffId) {
            switch (stuffId) {
                case LogicStuff.STUFF_HUMMER:
                    data = DataShop.hummers;
                    break;
                case LogicStuff.STUFF_LIGHTNING:
                    data = DataShop.lightning;
                    break;
                case LogicStuff.STUFF_SHUFFLE:
                    data = DataShop.shuffle;
                    break;
            }
            /** Обновить картинки товаров */
            for (let i = 0; i < 3; i++) {
                items[i].productImg = data[i].imageSrc;
                items[i].goldCount = data[i].gold;
                items[i].productCount = data[i].quantity;
                items[i].redraw();
            }
        }
        this.__proto__.redraw.call(this);
    };

    this.buyStuff = function (itemIndex) {

        if (lock()) return;

        let userGold, buyFunc, giveFunc, shopItem;
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
            case LogicStuff.STUFF_LIGHTNING:
                buyFunc = SAPIStuff.buyLightning;
                giveFunc = LogicStuff.giveALighnting;
                shopItem = DataShop.lightning[itemIndex];
                break;
        }

        if (userGold < shopItem.gold) {
            PBZDialogs.dialogMoneyShop.showDialog();
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




