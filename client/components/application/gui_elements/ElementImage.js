/**
 * Элемент картинки.
 * @constructor
 */
let ElementImage = function () {
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
    this.width = undefined;

    /**
     * Высота картинки.
     * @type {number}
     */
    this.height = undefined;

    /**
     * Ссылка на картинку.
     * @type {string}
     */
    this.src;

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

    /** @type {GUIDom} */
    let dom = null;

    this.title = undefined;

    this.photoBorder = false;

    /**
     * Создадим дом и настроем его.
     */
    this.init = function () {
        dom = GUI.createDom();
        dom.backgroundImage = self.src;
        if (this.photoBorder) {
            dom.borderWidth = 2;
            dom.borderColor = 'rgba(68, 62, 0, 0.7)';
            dom.borderRadius = 8;
        }
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
        dom.backgroundImage = self.src;
        if (self.opacity != null) {
            dom.opacity = self.opacity;
        }
        dom.x = self.x;
        dom.y = self.y;
        dom.width = self.width;
        dom.height = self.height;
        dom.title = self.title;
        dom.pointer = self.pointer;
        dom.redraw();
    };
};