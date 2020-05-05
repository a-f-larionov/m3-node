/**
 * Блок общих.
 * @constructor
 */
let PageBlockPanel = function PageBlockPanel() {
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

    let elFSButton = null;

    let moneyText;

    this.init = function () {
        let el, pMX, pHX;

        /**
         * Панель внутрений валюты
         * @type {number}
         */
        pMX = 110;//110 идеальный уентр
        el = GUI.createElement(ElementImage, {x: pMX, y: 0, src: 'panel-money.png'});
        self.elements.push(el);

        /** Деньги - монета */
        el = GUI.createElement(ElementButton, {
            x: pMX + 5, y: -3, srcRest: 'button-money-rest.png',
            onClick: function () {
                PBZDialogs.dialogMoneyShop.showDialog();
            }
        });
        self.elements.push(el);

        /** Деньги - текст */
        moneyText = GUI.createElement(ElementText, {
            x: pMX + 58, y: 11, width: 70, alignCenter: true
        });
        self.elements.push(moneyText);

        /** Деньги кнопка плюс */
        el = GUI.createElement(ElementButton, {
            x: pMX + 122, y: -3, srcRest: 'button-add-rest.png',
            onClick: function () {
                PBZDialogs.dialogMoneyShop.showDialog();
            }
        });
        self.elements.push(el);

        /**
         * Панель жизни
         * @type {number}
         */
        pHX = 463 - 15 - 50; //463 идеальный центр
        /** Жизни - панель */
        el = GUI.createElement(ElementImage, {x: pHX, y: 0, src: 'panel-hearth.png'});
        self.elements.push(el);

        /** Жизни - сердца */
        el = GUI.createElement(ElementHealthIndicator, {x: pHX + 9, y: -1});
        self.elements.push(el);

        /** Жизни - таймер */
        el = GUI.createElement(ElementHealthTimer, {x: pHX + 111, y: 10, healthIndicator: el});
        self.elements.push(el);

        /** Жизни - кнопка плюс */
        el = GUI.createElement(ElementButton, {
            x: pHX + 190, y: -4, srcRest: 'button-add-rest.png',
            onClick: function () {
                PBZDialogs.dialogHealthShop.showDialog();
            }
        });
        self.elements.push(el);

        /** Кнопка звука **/
        elSoundsButton = GUI.createElement(ElementButton, {
            x: 650, y: 10,
            srcRest: 'button-sound-off.png',
            srcHover: 'button-sound-active.png',
            srcActive: 'button-sound-active.png',
            onClick: function () {
                SocNet.postOne();
                Sounds.toggle();
                Sounds.play(Sounds.PATH_CHALK);
                PageController.redraw();
            }
        });
        self.elements.push(elSoundsButton);

        /** Кнопка фулскрин **/
        elFSButton = GUI.createElement(ElementButton, {
            x: 690, y: 10, srcRest: 'button-fs-on-rest.png',
            onClick: onFullScreenButtonClick
        });
        self.elements.push(elFSButton);
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
            elSoundsButton.srcRest = 'button-sound-on.png';
        } else {
            elSoundsButton.srcRest = 'button-sound-off.png';
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

    let onFullScreenButtonClick = function () {
        GUI.fsSwitch();
        if (GUI.isFullScreen()) {
            elFSButton.srcRest = 'button-fs-on-rest.png';
            elFSButton.srcHover = 'button-fs-on-rest.png';
            elFSButton.srcActive = 'button-fs-on-rest.png';
        } else {
            elFSButton.srcRest = 'button-fs-off-rest.png';
            elFSButton.srcHover = 'button-fs-off-rest.png';
            elFSButton.srcActive = 'button-fs-off-rest.png';
        }
    };

    this.oneHealthHide = false;
};

/** @type {PageBlockPanel} */
PageBlockPanel = new PageBlockPanel();