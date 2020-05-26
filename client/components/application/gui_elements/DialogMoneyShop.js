let DialogMoneyShop = function () {
    let self = this;
    this.__proto__ = new Dialog();

    this.init = function () {
        let el, offsetX, stepX, offsetY;
        this.__proto__.init.call(this);

        offsetX = 25;
        offsetY = 60;
        stepX = 150;

        GUI.pushParent(self.dom);
        this.setTitle("ГОЛОСА");

        for (let i = 0; i < 3; i++) {

            el = GUI.createElement(ElementMoneyCount, {
                x: offsetX + stepX * i, y: offsetY,
                productImg: 'money_' + (i + 1) + '.png',
                productCount: 0, goldCount: DataShop.gold[i].quantity,
                onClick: function () {
                    if (GUI.isFullScreen()) {
                        GUI.fsSwitch();
                    }
                    SocNet.openOrderDialog(DataShop.gold[i].votes);
                    self.closeDialog();
                }
            });

            self.elements.push(el);
        }

        GUI.popParent();
    };
};




