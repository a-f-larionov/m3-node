ElementDialogMoneyMagazine = function () {
    let self = this;
    this.__proto__ = new ElementDialog();

    this.init = function () {
        let el;
        this.__proto__.init.call(this);
        GUI.pushParent(self.dom);
        // номер точки
        el = GUI.createElement(ElementText, {
            x: 135, y: 11, width: 230, height: 40,
            text: 'МАГАЗИН'
        });
        self.elements.push(el);

        el = GUI.createElement(ElementButton, {
            x: 25, y: 80,
            srcRest: '/images/money_1.png',
            srcHover: '/images/money_1.png',
            srcActive: '/images/money_1.png',
            onClick: function () {
                SocNet.openOrderDialog(1);
            }
        });
        self.elements.push(el);

        el = GUI.createElement(ElementButton, {
            x: 25 + 150 * 1, y: 80,
            srcRest: '/images/money_2.png',
            srcHover: '/images/money_2.png',
            srcActive: '/images/money_2.png',
            onClick: function () {
                SocNet.openOrderDialog(5);
            }
        });
        self.elements.push(el);

        el = GUI.createElement(ElementButton, {
            x: 25 + 150 * 2, y: 80,
            srcRest: '/images/money_3.png',
            srcHover: '/images/money_3.png',
            srcActive: '/images/money_3.png',
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




