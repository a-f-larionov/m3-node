/**
 * Элемент картинки.
 * @constructor
 */
ElementDialog = function () {
    var self = this;

    /**
     * Показывать ли элемент.
     * @type {boolean}
     */
    var showed = false;

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

    var dom;

    this.title = undefined;

    /**
     * Создадим дом и настроем его.
     */
    this.init = function () {
        dom = GUI.createDom();
        dom.width = self.width;
        dom.height = self.height;
        self.x = 10;
        self.y = -200;
        self.opacity = 0.5;
        dom.backgroundImage = self.src;
        dom.animTracks = [
            [
                {type: GUI.ANIM_TYPE_MOVE, vX: 0, vY: 5, duration: 10}
            ]
        ];
        GUI.updateAnimTracks(dom);
        OnIdle.register(dom.animate);
        self.dom = dom;
    };

    /**
     * Покажем картинку.
     */
    this.show = function () {
        if (showed == true) return;
        showed = true;
        dom.show();
        self.redraw();
    };

    /**
     * Спрячем картинку.
     */
    this.hide = function () {
        if (showed == false) return;
        showed = false;
        dom.hide();
    };

    /**
     * Перерисуем картинку.
     */
    this.redraw = function () {
        if (!showed) return;
        dom.redraw();
        if (self.opacity != null) {
            dom.opacity = self.opacity;
        }
        dom.x = self.x;
        dom.y = self.y;
        dom.title = self.title;
        dom.pointer = self.pointer;
    };

    /**
     * Show dialog!
     */
    this.showDialog = function () {
        dom.animPlayed = true;
        // switch on animations
        //TODO HERE!
    };
};