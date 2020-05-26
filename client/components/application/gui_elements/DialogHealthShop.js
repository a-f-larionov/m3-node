let DialogHealthShop = function () {
    let self = this;
    this.__proto__ = new Dialog();

    let elHealth5 = null;

    let elButton = null;

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
        let el, offsetX, stepX, offsetY, user;
        this.__proto__.init.call(this);

        offsetX = 30;
        offsetY = 80;
        stepX = 145;

        GUI.pushParent(self.dom);

        this.setTitle('МАГАЗИН');

        let onClick = function () {
            if (lock()) return;
            self.buyHealth5();
        };

        elHealth5 = GUI.createElement(ElementMoneyCount, {
            x: offsetX + stepX - 60, y: offsetY + 10,
            productImg: 'hearth-big.png',
            productCount: 5, goldCount: 300,
            type: 'B',
            onClick: onClick
        });
        self.elements.push(elHealth5);

        elButton = GUI.createElement(ElementButton, {
            x: 185, y: 215,
            srcRest: 'button-red-rest.png',
            srcHover: 'button-red-hover.png',
            srcActive: 'button-red-active.png',
            title: 'КУПИТЬ',
            onClick: onClick
        });
        self.elements.push(elButton);

        user = LogicUser.getCurrent();

        if (SocNet.getType() === SocNet.TYPE_STANDALONE &&
            (user && user.id > 1000)
        ) {

            el = GUI.createElement(ElementButton, {
                x: offsetX + stepX * 2, y: offsetY,
                srcRest: 'shop-health-2.png',
                onClick: function () {
                    if (lock()) return;
                    SAPIUser.zeroLife();
                }
            });
            self.elements.push(el);
        }

        GUI.popParent();
    };

    this.redraw = function () {
        let user;
        user = LogicUser.getCurrent();
        elHealth5.enabled = LogicHealth.getHealths(user) === 0;
        elButton.enabled = LogicHealth.getHealths(user) === 0;
        this.__proto__.redraw.call(this);
    };

    this.buyHealth5 = function () {
        let gold, user;
        gold = LogicStuff.getStuff('goldQty');
        user = LogicUser.getCurrent();

        if (LogicHealth.getHealths(user) > 0) return;

        if (gold < DataShop.healthGoldPrice) {
            PBZDialogs.dialogMoneyShop.showDialog(this);
            self.closeDialog();
        } else {
            SAPIStuff.buyHealth();
            LogicStuff.giveAHealth(LogicHealth.getMaxHealth());
            LogicStuff.usedGold(DataShop.healthGoldPrice);
            self.closeDialog();
        }
        PageController.redraw();
    };
};