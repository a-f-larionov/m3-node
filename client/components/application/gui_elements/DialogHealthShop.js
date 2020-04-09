DialogHealthShop = function () {
    let self = this;
    self.__name = "DialogHealthShop";
    this.__proto__ = new Dialog();

    let elHealth5 = null;

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

        elHealth5 = GUI.createElement(ElementButton, {
            x: offsetX + stepX, y: offsetY,
            srcRest: '/images/shop-health-1.png',
            srcHover: '/images/shop-health-1.png',
            srcActive: '/images/shop-health-1.png',
            onClick: function () {
                self.buyHealth5();
            }
        });
        self.elements.push(elHealth5);

        el = GUI.createElement(ElementButton, {
            x: offsetX + stepX * 2, y: offsetY,
            srcRest: '/images/shop-health-2.png',
            srcHover: '/images/shop-health-2.png',
            srcActive: '/images/shop-health-2.png',
            onClick: function () {
                SAPIUser.zeroLife();
            }
        });
        self.elements.push(el);

        /** Кнопка закрыть */
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

    this.redraw = function () {
        let user;
        user = LogicUser.getCurrentUser();
        elHealth5.enabled = LogicHealth.getHealths(user) === 0;
        this.__proto__.redraw.call(this);
    };

    this.buyHealth5 = function () {
        let gold, user;
        gold = LogicStuff.getStuff('goldQty');
        user = LogicUser.getCurrentUser();

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