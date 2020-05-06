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
            el = GUI.createElement(ElementButton, {
                x: offsetX + stepX * i, y: offsetY,
                srcRest: 'money_' + (i + 1) + '.png',
                srcHover: 'money_' + (i + 1) + '.png',
                srcActive: 'money_' + (i + 1) + '.png',
                onClick: function () {
                    if (GUI.isFullScreen()) {
                        GUI.fsSwitch();
                    }
                    SocNet.openOrderDialog(DataShop.gold[i].votes);
                    self.closeDialog();
                }
            });
            self.elements.push(el);

            el = GUI.createElement(ElementButton, {
                x: offsetX + stepX * i + 45, y: offsetY + 150 - 45,
                srcRest: 'button-add-rest.png',
                onClick: function () {
                    SocNet.openOrderDialog(DataShop.gold[i].votes);
                    self.closeDialog();
                }
            });
        }

        GUI.popParent();
    };
};




