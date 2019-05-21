ElementDialogMoneyMagazine = function () {
    let self = this;
    this.__proto__ = new ElementDialog();

    this.init = function () {
        let el;
        this.__proto__.init.call(this);
        GUI.pushParent(self.dom);

        el = GUI.createElement(ElementButton, {
            x: 10, y: 30,
            srcRest: '/images/money_buy_100_rest.png',
            srcHover: '/images/money_buy_100_active.png',
            srcActive: '/images/money_buy_100_active.png',
            onClick: function () {
                SocNet.openOrderDialog(1);
            }
        });
        self.elements.push(el);

        el = GUI.createElement(ElementButton, {
            x: 10 + 100 * 1, y: 30,
            srcRest: '/images/money_buy_500_rest.png',
            srcHover: '/images/money_buy_500_active.png',
            srcActive: '/images/money_buy_500_active.png',
            onClick: function () {
                SocNet.openOrderDialog(5);
            }
        });
        self.elements.push(el);

        el = GUI.createElement(ElementButton, {
            x: 10 + 100 * 2, y: 30,
            srcRest: '/images/money_buy_1000_rest.png',
            srcHover: '/images/money_buy_1000_active.png',
            srcActive: '/images/money_buy_1000_active.png',
            onClick: function () {
                SocNet.openOrderDialog(10);
            }
        });
        self.elements.push(el);

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




