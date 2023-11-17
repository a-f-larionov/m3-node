let DialogHealthShop = function () {
    let self = this;
    this.__proto__ = new Dialog();

    let elHealth5 = null;

    let elButton = null;

    let locked = false;

    let elResetButton = null;

    /**
     * Чтобы пользователь на купил 2ыйнм кликом
     * @returns {boolean}
     * @todo to tlock
     */
    let lock = function () {
        if (locked) return true;
        locked = true;
        setTimeout(function () {
            locked = false;
        }, 1000);
    };

    this.init = function () {
        let offsetX, stepX, offsetY;
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
            productCount: LogicHealth.getMaxHealth(), goldCount: DataShop.healthGoldPrice,
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


        elResetButton = GUI.createElement(ElementButton, {
            x: offsetX + stepX * 2, y: offsetY,
            srcRest: 'anim-hd-1.png',
            srcHover: 'anim-hd-1.png',
            srcActive: 'anim-hd-1.png',
            title: 'сброс',
            onClick: function () {
                if (lock()) return;
                SAPIUser.zeroLife();
            }
        });

        self.elements.push(elResetButton);

        GUI.popParent();
    };

    this.redraw = function () {
        let user;
        user = LogicUser.getCurrent();
        elHealth5.enabled = LogicHealth.getHealths(user) === 0;
        elButton.enabled = LogicHealth.getHealths(user) === 0;
        if (user && user.socNetTypeId === SocNet.TYPE_STANDALONE && user.socNetUserId > 10000) {
            elResetButton.show();
        } else {
            elResetButton.hide();
        }
        this.__proto__.redraw.call(this);
    };

    this.buyHealth5 = function () {
        let gold, user;
        gold = LogicStuff.getStuff('goldQty');
        user = LogicUser.getCurrent();

        if (LogicHealth.getHealths(user) > 0) return;

        if (gold < DataShop.healthGoldPrice) {
            PBZDialogs.dialogMoneyShop.showDialog(this, 'не хватило на жизни');
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