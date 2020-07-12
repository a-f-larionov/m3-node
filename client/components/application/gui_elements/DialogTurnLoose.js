let DialogTurnLoose = function DialogTurnLoose() {
    let self = this;
    this.__proto__ = new Dialog();

    let pointId;

    this.init = function () {
        this.__proto__.init.call(this);
        GUI.pushParent(self.dom);
        let el;

        el = GUI.createElement(ElementButton, {
                x: 452, y: 3,
                srcRest: 'button-close-rest.png',
                onClick: function () {
                    self.closeDialog();
                    PageBlockPanel.oneHealthHide = false;
                    PageController.showPage(PageMain);
                }
            }
        );

        this.elButtonClose.hide();

        self.elements.push(el);

        el = GUI.createElement(ElementText, {x: 50, y: 135, fontSize: 24, bold: true, alignCenter: true, width: 400});
        el.setText("Больше ходов нет! :(");

        self.elements.push(el);


        /** Кнопка играть */
        el = GUI.createElement(ElementButton, {
            x: 178 - 80, y: 240,
            srcRest: 'button-red-rest.png',
            srcHover: 'button-red-hover.png',
            srcActive: 'button-red-active.png',
            onClick: function () {
                self.closeDialog();
                /** Предложить купить жизни */
                if (LogicHealth.getHealths(LogicUser.getCurrent()) === 0) {
                    PBZDialogs.dialogHealthShop.showDialog();
                    self.showDialog(pointId);
                } else {
                    /** Начать игру */
                    PageController.showPage(PageMain);

                    //@todo ищи код ljklkjlkjkljkjlkjljlkjlk
                    SAPIUser.healthDown(pointId);
                    PageBlockPanel.oneHealthHide = true;
                    DataPoints.setPlayedId(DataPoints.getPlayedId());

                    PageController.showPage(PageField);
                    SAPIUser.looseGame(DataPoints.getPlayedId());
                }
            },
            title: 'ПОВТОРИТЬ'
        });
        el.show();

        /** Кнопка купить ходов */
        el = GUI.createElement(ElementButton, {
            x: 178 + 80, y: 240,
            srcRest: 'button-red-rest.png',
            srcHover: 'button-red-hover.png',
            srcActive: 'button-red-active.png',
            fontSize: 13,
            onClick: function () {
                self.closeDialog();

                if (LogicStuff.getStuff('goldQty') < DataShop.looseTurnsPrice) {
                    PBZDialogs.dialogMoneyShop.showDialog();
                    self.showDialog(pointId);
                } else {
                    SAPIUser.spendTurnsMoney();
                    PageBlockField.increaseTurns(DataShop.looseTurnsQuantity);
                    LogicStuff.usedGold(DataShop.looseTurnsPrice);
                    PageBlockField.unlockField();
                }
                PageController.showPage(PageField);
            },
            title: '+10 ЗА 200 МОНЕТ'
        });
        el.show();

        GUI.popParent();
    };

    this.showDialog = function (pId) {
        LogicWizard.finish(false);
        pointId = pId;
        //this.setTitle('УРОВЕНЬ  ' + pointId);
        this.setTitle('НЕТ ХОДОВ!');
        this.__proto__.showDialog.call(this);
    }
};