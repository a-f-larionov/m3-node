let  DialogHealthShop = function () {
    let self = this;
    this.__proto__ = new Dialog();

    let elHealth5 = null;

    this.init = function () {
        let el, offsetX, stepX, offsetY;
        this.__proto__.init.call(this);

        offsetX = 30;
        offsetY = 80;
        stepX = 145;

        GUI.pushParent(self.dom);

        this.setTitle('МАГАЗИН');

        elHealth5 = GUI.createElement(ElementButton, {
            x: offsetX + stepX, y: offsetY,
            srcRest: 'shop-health-1.png',
            onClick: function () {
                self.buyHealth5();
            }
        });
        self.elements.push(elHealth5);

        el = GUI.createElement(ElementButton, {
            x: offsetX + stepX * 2, y: offsetY,
            srcRest: 'shop-health-2.png',
            onClick: function () {
                SAPIUser.zeroLife();
            }
        });
        self.elements.push(el);

        GUI.popParent();
    };

    this.redraw = function () {
        let user;
        user = LogicUser.getCurrent();
        elHealth5.enabled = LogicHealth.getHealths(user) === 0;
        this.__proto__.redraw.call(this);
    };

    this.buyHealth5 = function () {
        let gold, user;
        gold = LogicStuff.getStuff('goldQty');
        user = LogicUser.getCurrent();

        if (LogicHealth.getHealths(user) > 0) return;

        if (gold < DataShop.healthPrice) {
            PBZDialogs.dialogMoneyShop.showDialog(this);
            self.closeDialog();
        } else {
            SAPIStuff.buyHealth();
            LogicStuff.giveAHealth(LogicHealth.getMaxHealth());
            LogicStuff.usedGold(DataShop.healthPrice);
            self.closeDialog();
        }
        PageController.redraw();
    };
};