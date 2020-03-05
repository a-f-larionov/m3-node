/**
 * Блок общих.
 * @constructor
 */
PageBlockPanel = function PageBlockPanel() {
    let self = this;

    /**
     * Показывать ли страницу.
     * @type {boolean}
     */
    let showed = false;

    /**
     * Массив всех элементов страницы.
     * @type {Array}
     */
    this.elements = [];

    let elSoundsButton = null;

    let moneyText;

    let dialogMoneyShop;

    this.init = function () {
        let el, pHX, pMX;

        pHX = 463 - 15;
        /* жизни - панель*/
        el = GUI.createElement(ElementImage, {
            x: pHX, y: 0,
            src: '/images/panel-hearth.png'
        });
        self.elements.push(el);

        /* жизни - сердца */
        el = GUI.createElement(ElementHealthIndicator, {
            x: pHX + 9,
            y: -1
        });
        self.elements.push(el);

        /* жизни - таймер */
        el = GUI.createElement(ElementHealthTimer, {
            x: pHX + 111, y: 10
        });
        self.elements.push(el);

        /* жизни - кнопка плюс */
        el = GUI.createElement(ElementButton, {
            x: pHX + 190, y: -2,
            srcRest: '/images/button-add-rest.png',
            srcHover: '/images/button-add-hover.png',
            srcActive: '/images/button-add-active.png',
            onClick: function () {
                dialogMoneyShop.showDialog();
            }
        });
        self.elements.push(el);

        // sounds button кнопка звука
        elSoundsButton = GUI.createElement(ElementButton, {
            x: 700, y: 10,
            srcRest: '/images/button-sound-off.png',
            srcHover: '/images/button-sound-active.png',
            srcActive: '/images/button-sound-active.png',
            onClick: function () {
                Sounds.toggle();
                Sounds.play(Sounds.PATH_CHALK);
                PageController.redraw();
            }
        });
        self.elements.push(elSoundsButton);

        dialogMoneyShop = GUI.createElement(ElementDialogMoneyShop, {});
        self.elements.push(dialogMoneyShop);

        // панель денег
        pMX = 110;
        el = GUI.createElement(ElementImage, {
            x: pMX, y: 0,
            src: '/images/panel-money.png'
        });
        self.elements.push(el);

        // деньги - монета
        el = GUI.createElement(ElementButton, {
            x: pMX + 5, y: -2,
            srcRest: '/images/button-money-rest.png',
            srcHover: '/images/button-money-hover.png',
            srcActive: '/images/button-money-active.png',
            onClick: function () {
                dialogMoneyShop.showDialog();
            }
        });
        self.elements.push(el);
        // деньги - текст
        moneyText = GUI.createElement(ElementText, {
            x: pMX + 58, y: 9, width: 70,
            alignCenter: true, bold: true
        });
        self.elements.push(moneyText);

        // деньги кнопка плюс
        el = GUI.createElement(ElementButton, {
            x: pMX + 122, y: -2,
            srcRest: '/images/button-add-rest.png',
            srcHover: '/images/button-add-hover.png',
            srcActive: '/images/button-add-active.png',
            onClick: function () {
                dialogMoneyShop.showDialog();
            }
        });
        self.elements.push(el);
    };

    /**
     * Покажем все элементы на странице.
     */
    this.show = function () {
        if (showed) return;
        showed = true;
        self.preset();
        for (let i in self.elements) {
            self.elements[i].show();
        }
        self.redraw();
    };

    /**
     * Спрачем все элементы на странице.
     */
    this.hide = function () {
        if (!showed) return;
        showed = false;
        for (let i in self.elements) {
            self.elements[i].hide();
        }
    };

    /**
     * Настройка перед отрисовкой.
     */
    this.preset = function () {
        if (Sounds.isEnabled()) {
            elSoundsButton.srcRest = '/images/button-sound-on.png';
            //elSoundsButton.srcHover = '/images/button-sound-active.png';
        } else {
            elSoundsButton.srcRest = '/images/button-sound-off.png';
            //elSoundsButton.srcHover = '/images/button-sound-active.png';
        }
        if (LogicStuff.getStuff().goldQty !== undefined) {
            moneyText.setText(LogicStuff.getStuff('goldQty'))
        }
    };

    /**
     * Обновляем онлайн индикатор и индикатор очков.
     */
    this.redraw = function () {
        if (!showed) return;
        self.preset();
        self.elements.forEach(function (el) {
            el.redraw();
        });
    };

    this.showDialogMoneyShop = function () {
        dialogMoneyShop.showDialog();
    }
};

PageBlockPanel = new PageBlockPanel();