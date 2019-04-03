/**
 * Элемент картинки.
 * @constructor
 */
ElementDialog = function () {
    let self = this;

    /**
     * Показывать ли элемент.
     * @type {boolean}
     */
    this.showed = false;

    this.dialogShowed = false;

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

    /**
     * Массив всех элементов страницы.
     * @type {Array}
     */
    this.elements = [];

    this.title = undefined;

    /**
     * Создадим дом и настроем его.
     */
    this.init = function () {
        self = this;
        dom = GUI.createDom(undefined, {
            width: self.width,
            height: self.height,
            backgroundImage: self.src,
            animTracks: [
                [
                    {type: GUI.ANIM_TYPE_MOVE, vX: 0, vY: 15, duration: 30},
                    {
                        type: GUI.ANIM_TYPE_STOP, callback: function () {
                        }
                    },
                    {type: GUI.ANIM_TYPE_MOVE, vX: 0, vY: -15, duration: 30},
                    {
                        type: GUI.ANIM_TYPE_STOP, callback: function () {
                            self.dialogShowed = false;
                        }
                    }
                ]
            ]
        });
        self.x = (document.getElementById('applicationArea').clientWidth / 2)
            - self.width / 2;
        self.y = -400;

        self.dom = dom;
    };

    /**
     * Покажем картинку.
     */
    this.show = function () {
        if (self.showed == true) return;
        self.showed = true;
        dom.show();
        for (var i in self.elements) {
            self.elements[i].show();
        }
        self.redraw();
    };

    /**
     * Спрячем картинку.
     */
    this.hide = function () {
        if (self.showed == false) return;
        self.showed = false;
        dom.hide();
        for (var i in self.elements) {
            self.elements[i].hide();
        }
    };

    /**
     * Перерисуем картинку.
     */
    this.redraw = function () {
        if (!self.showed) return;
        if (!self.dialogShowed) {
            dom.x = self.x;
            dom.y = self.y;
            dom.title = self.title;
            dom.pointer = self.pointer;
            dom.redraw();
        }

        for (var i in self.elements) {
            self.elements[i].redraw();
        }
    };

    /**
     * Show dialog!
     */
    this.showDialog = function () {
        if (self.dialogShowed) return;
        this.show();
        self.dialogShowed = true;
        dom.animData[0].frameN = 0;
        dom.animPlayed = true;
    };

    this.closeDialog = function () {
        // coords resets
        // hide all
        dom.animData[0].frameN = 2;
        dom.animPlayed = true;
    };

    this.createElement = function (element, params) {
        self.elements.push(
            GUI.createElement(element, params, self.dom)
        );
    };
};