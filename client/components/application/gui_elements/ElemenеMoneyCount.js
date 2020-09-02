/**
 * @constructor
 */
let ElementMoneyCount = function () {
    let self = this;

    /**
     * Показывать ли элемент.
     * @type {boolean}
     */
    let showed = false;

    /**
     * Координата X картинки.
     * @type {number}
     */
    this.x = 0;

    /**
     * Координата Y картинки.
     * @type {number}
     */
    this.y = 0;

    this.productImg = null;
    this.productCount = null;
    this.goldCount = null;

    this.onClick = function () {
    };

    this.counterOffsetY = 0;
    this.imageOffsetX = 0;
    this.enabled = true;

    let domProduct = null;
    let textProductCount = null;

    let domMoneyImage = null;
    let textCounter = null;

    let els = [];

    /**
     * Создадим дом и настроем его.
     */
    this.init = function () {
        domMoneyImage = GUI.createDom(null, {backgroundImage: 'coin.png', pointer: GUI.POINTER_HAND});
        textCounter = GUI.createElement(ElementText, {onClick: self.onClick, width: 80, alignCenter: false, pointer: GUI.POINTER_HAND});

        domProduct = GUI.createDom(null, {pointer: GUI.POINTER_HAND});
        textProductCount = GUI.createElement(ElementText, {onClick: self.onClick, pointer: GUI.POINTER_HAND});

        GUI.bind(domMoneyImage, GUI.EVENT_MOUSE_CLICK, self.onClick, self);
        GUI.bind(domProduct, GUI.EVENT_MOUSE_CLICK, self.onClick, self);

        els.push(domMoneyImage);
        els.push(textCounter);
        els.push(domProduct);
        els.push(textProductCount);
    };

    /**
     * Покажем картинку.
     */
    this.show = function () {
        if (showed === true) return;
        showed = true;
        els.forEach(function (el) {
            el.show();
        });
        self.redraw();
    };

    /**
     * Спрячем картинку.
     */
    this.hide = function () {
        if (showed === false) return;
        showed = false;
        els.forEach(function (el) {
            el.hide();
        });
    };

    /**
     * Перерисуем картинку.
     */
    this.redraw = function () {
        if (!showed) return;

        if (self.type === 'B') {
            redrawB();
        } else {
            redrawA();
        }
        els.forEach(function (el) {
            el.opacity = self.enabled ? 1.0 : 0.5;
            el.redraw();
        });
    };


    let redrawA = function () {

        domProduct.x = self.x + self.imageOffsetX;
        domProduct.y = self.y;
        domProduct.backgroundImage = self.productImg;

        if (self.productCount) {
            textProductCount.show();
            textProductCount.x = self.x + 100;
            textProductCount.y = self.y + 20;
            textProductCount.fontSize = 41;
            textProductCount.text = "x" + self.productCount.toString();
        } else {
            textProductCount.hide();
        }

        let offsetX = 0;
        if (self.goldCount > 9) offsetX = -0;
        if (self.goldCount > 99) offsetX = -10;
        if (self.goldCount > 999) offsetX = -20;

        domMoneyImage.x = self.x + 30 + offsetX;
        domMoneyImage.y = self.y + Images.getHeight(self.productImg) + self.counterOffsetY;

        textCounter.x = self.x + 95 + offsetX * 2;
        textCounter.y = self.y + Images.getHeight(self.productImg) + self.counterOffsetY;
        textCounter.fontSize = 36;
        textCounter.text = self.goldCount.toString();
    };

    let redrawB = function () {

        let offsetX = 0;
        if (self.goldCount > 9) offsetX = -0;
        if (self.goldCount > 99) offsetX = -10;
        if (self.goldCount > 999) offsetX = -15;

        domProduct.x = self.x;
        domProduct.y = self.y;
        domProduct.backgroundImage = self.productImg;

        if (self.productCount) {
            textProductCount.show();
            textProductCount.x = self.x + 100;
            textProductCount.y = self.y + 20;
            textProductCount.fontSize = 41;
            textProductCount.text = "x" + self.productCount.toString();
        } else {
            textProductCount.hide();
        }

        domMoneyImage.x = self.x + 50 + 30 + offsetX + Images.getWidth(self.productImg);
        domMoneyImage.y = self.y + self.counterOffsetY + 20;

        textCounter.x = self.x + 50 + 95 + offsetX * 2 + Images.getWidth(self.productImg);
        textCounter.y = self.y + self.counterOffsetY + 25;
        textCounter.fontSize = 36;
        textCounter.text = self.goldCount.toString();
    }
};