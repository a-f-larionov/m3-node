/**
 * Элемент сундука.
 * @constructor
 * @property x
 * @property y
 * @type {ElementChest}
 */
let ElementChest = function () {
    let self = this;

    /**
     * Показывать ли элемент.
     * @type {boolean}
     */
    let showed = false;

    /**
     * Координата X.
     * @type {number}
     */
    this.x = 0;

    /**
     * Координата Y.
     * @type {number}
     */
    this.y = 0;

    /**
     * Ширина.
     * @type {number}
     */
    this.width = 0;

    this.number = -1;

    /**
     * Высота кноки.
     * @type {number}
     */
    this.height = 0;


    let elPit = null;

    let elStar = null;
    let elTxt = null;

    this.chestId = null;

    /**
     * Создадим дом и настроем его.
     */
    this.init = function () {

        elPit = GUI.createDom(undefined, {width: self.width, height: self.height});

        elStar = GUI.createElement(ElementImage, {src: 'star-on.png'});
        elTxt = GUI.createElement(ElementText, {width: 100, height: 14, fontSize: 14, bold: false});
    };

    /**
     * Покажем кнопку.
     */
    this.show = function () {
        if (showed) return;
        showed = true;

        elPit.show();
        elStar.show();
        elTxt.show();

        self.redraw();
    };

    /**
     * Спрячем.
     */
    this.hide = function () {
        if (!showed) return;
        showed = false;

        elPit.hide();
        elStar.hide();
        elTxt.hide();
    };

    /**
     * Перерисуем кнопку.
     */
    this.redraw = function () {
        let stars;
        if (!showed) return;

        elPit.x = self.x;
        elPit.y = self.y;

        elTxt.x = self.x + 10;
        elTxt.y = self.y + 10;

        stars = DataMap.countStarsByMapId();
        let numberToStars = {1: 6 * 3, 2: 12 * 3, 3: 18 * 3};

        elTxt.text = stars.toString() + '/' + numberToStars[self.number];

        if (numberToStars[self.number] >= stars) {
            elPit.backgroundImage = 'pit-close.png';
        } else {
            elPit.backgroundImage = 'pit-open.png';
        }

        elStar.x = elTxt.x + 10;
        elStar.y = elTxt.y - 5;

        elPit.redraw();
        elStar.redraw();
        elTxt.redraw();
    };
};
