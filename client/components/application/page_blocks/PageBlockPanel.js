/**
 * Блок общих.
 * @constructor
 */
PageBlockPanel = function PageBlockPanel() {
    var self = this;

    /**
     * Показывать ли страницу.
     * @type {boolean}
     */
    var showed = false;

    /**
     * Массив всех элементов страницы.
     * @type {Array}
     */
    this.elements = [];

    let elSoundsButton = null;

    let moneyText;

    let dialogMoneyMagazine;

    this.init = function () {
        var el;

        /* жизни - панель*/
        el = GUI.createElement(ElementImage, {
            x: 400, y: 0,
            src: '/images/panel-hearth.png'
        });
        self.elements.push(el);

        /* жизни - сердца */
        el = GUI.createElement(ElementHealthIndicator, {
            x: 409,
            y: -1
        });
        self.elements.push(el);

        /* жизни - таймер */
        el = GUI.createElement(ElementHealthTimer, {
            x: 550, y: 10
        });
        self.elements.push(el);

        /* жизни - кнопка плюс */
        el = GUI.createElement(ElementButton, {
            x: 590, y: -2,
            srcRest: '/images/button-add-rest.png',
            srcHover: '/images/button-add-hover.png',
            srcActive: '/images/button-add-active.png',
            onClick: function () {
                dialogMoneyMagazine.showDialog();
            }
        });
        self.elements.push(el);

        // sounds button кнопка звука
        elSoundsButton = GUI.createElement(ElementButton, {
            x: 700, y: 10,
            srcRest: '/images/button-sound-off.png',
            srcHover: '/images/button-sound-on.png',
            srcActive: '/images/button-sound-active.png',
            onClick: function () {
                Sounds.toggle();
                Sounds.play(Sounds.PATH_CHALK);
                PageController.redraw();
            }
        });
        self.elements.push(elSoundsButton);

        dialogMoneyMagazine = GUI.createElement(ElementDialogMoneyMagazine, {});
        self.elements.push(dialogMoneyMagazine);

        // панель денег
        el = GUI.createElement(ElementImage, {
            x: 40, y: 0,
            src: '/images/panel-money.png'
        });
        self.elements.push(el);

        // деньги - монета
        el = GUI.createElement(ElementButton, {
            x: 45, y: -2,
            srcRest: '/images/button-money-rest.png',
            srcHover: '/images/button-money-hover.png',
            srcActive: '/images/button-money-active.png',
            onClick: function () {
                dialogMoneyMagazine.showDialog();
            }
        });
        self.elements.push(el);
        // деньги - текст
        moneyText = GUI.createElement(ElementText, {
            x: 98, y: 9, width: 70,
            alignCenter: true, bold: true
        });
        self.elements.push(moneyText);

        // деньги кнопка плюс
        el = GUI.createElement(ElementButton, {
            x: 162, y: -2,
            srcRest: '/images/button-add-rest.png',
            srcHover: '/images/button-add-hover.png',
            srcActive: '/images/button-add-active.png',
            onClick: function () {
                dialogMoneyMagazine.showDialog();
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
        for (var i in self.elements) {
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
        for (var i in self.elements) {
            self.elements[i].hide();
        }
    };

    /**
     * Настройка перед отрисовкой.
     */
    this.preset = function () {
        if (Sounds.isEnabled()) {
            elSoundsButton.srcRest = '/images/button-sound-on.png';
            elSoundsButton.srcHover = '/images/button-sound-off.png';
        } else {
            elSoundsButton.srcRest = '/images/button-sound-off.png';
            elSoundsButton.srcHover = '/images/button-sound-on.png';
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
};

PageBlockPanel = new PageBlockPanel();