/**
 * Element Sprite.
 * @constructor
 */
ElementSprite = function () {
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

    /**
     * Ширина картинки.
     * @type {number}
     */
    this.width = 0;

    /**
     * Высота картинки.
     * @type {number}
     */
    this.height = 0;

    /**
     * Ссылка на картинку.
     * @type {string}
     */
    this.src = '/path/to/image.png';

    /**
     * Прозрачность картинки.
     * @type {null}
     */
    this.opacity = null;

    /**
     * Дом картинки.
     * @type {GUIDom}
     */
    this.dom = null;

    this.pointer = undefined;

    let dom;

    this.title = undefined;

    this.animPlay = function () {

        dom.animPlayed = true;
    };

    /**
     * Создадим дом и настроем его.
     */
    this.init = function () {
        dom = GUI.createDom(undefined, self.domInitParams);
        dom.width = self.width;
        dom.height = self.height;
        dom.x = self.x;
        dom.y = self.y;
        dom.backgroundImage = self.src;
        self.dom = dom;
    };

    /**
     * Покажем картинку.
     */
    this.show = function () {
        if (showed === true) return;
        showed = true;
        dom.show();
        self.redraw();
    };

    /**
     * Спрячем картинку.
     */
    this.hide = function () {
        if (showed === false) return;
        showed = false;
        dom.hide();
    };

    /**
     * Перерисуем картинку.
     */
    this.redraw = function () {
        if (!showed) return;
        if (self.opacity != null) {
            dom.opacity = self.opacity;
        }
        dom.title = self.title;
        dom.pointer = self.pointer;
        dom.redraw();
    };
};
