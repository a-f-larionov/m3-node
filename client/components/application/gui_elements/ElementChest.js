/**
 * Элемент сундука.
 * @constructor
 * @property x
 * @property y
 */
ElementChest = function () {
    var self = this;

    /**
     * Показывать ли элемент.
     * @type {boolean}
     */
    var showed = false;

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

    this.goalStars = null;

    /**
     * Высота кноки.
     * @type {number}
     */
    this.height = 0;

    this.srcChestClose = '/images/chest-close.png';
    this.srcChestOpen = '/images/chest-open.png';

    /**
     * Будет вызываться при нажатии на кнопку.
     * @type {function}
     */
    this.onClick = null;

    /**
     * Дом картинки.
     * @type {GUIDom}
     */
    var dom = null;

    /**
     * Текст показывающий кол-во собранных звёзд на этом сундуке.
     * @type {null}
     */
    var elText = null;

    /**
     * Опущена ли мышка.
     * @type {boolean}
     */
    var mouseStateDown = false;

    /**
     * Мышь в фокусе.
     * @type {boolean}
     */
    var mouseStateFocused = false;

    /**
     * Состояние сундука: 1 - закрыт, 2 - открыт
     * @type {number}
     */
    this.stateId = 1;

    this.chestId = null;

    /**
     * Создадим дом и настроем его.
     */
    this.init = function () {
        elText = GUI.createElement(ElementText, {
            width: 100,
            height: 40,
            text: ''
        });

        dom = GUI.createDom();
        dom.width = self.width;
        dom.height = self.height;
        dom.backgroundImage = self.srcChestClose;
        dom.pointer = GUI.POINTER_HAND;
        GUI.bind(dom, GUI.EVENT_MOUSE_MOUSE_DOWN, onMouseDown, self);
        GUI.bind(dom, GUI.EVENT_MOUSE_CLICK, onMouseClick, self);
        GUI.bind(dom, GUI.EVENT_MOUSE_OVER, onMouseOver, self);
        GUI.bind(dom, GUI.EVENT_MOUSE_OUT, onMouseOut, self);
    };

    /**
     * Покажем кнопку.
     */
    this.show = function () {
        if (showed) return;
        showed = true;
        dom.show();
        elText.show();
        self.redraw();
    };

    /**
     * Спрячем кнопку.
     */
    this.hide = function () {
        if (!showed) return;
        showed = false;
        elText.hide();
        dom.hide();
    };

    /**
     * Перерисуем кнопку.
     */
    this.redraw = function () {
        if (!showed) return;

        switch (this.stateId) {
            case 1:
                if (mouseStateFocused) {
                    dom.backgroundImage = this.srcChestOpen;
                } else {
                    dom.backgroundImage = this.srcChestClose;
                }
                break;
            case 2:
                dom.backgroundImage = this.srcChestOpen;
                break;
        }

        if (self.stateId === ElementChest.STATE_OPEN) {
            dom.pointer = GUI.POINTER_ARROW;
        } else {
            dom.pointer = GUI.POINTER_HAND;
        }
        dom.x = self.x;
        dom.y = self.y;

        elText.x = self.x + 10;
        elText.y = self.y + 60;

        if (self.goalStars) {
            elText.text = self.stars + '/' + self.goalStars;
        } else {
            elText.text = '';
        }
        elText.redraw();
        dom.redraw();
    };

    /**
     * Обработка события фокуса мыши.
     */
    var onMouseOver = function () {
        if (!self.enabled) return;
        mouseStateFocused = true;
        self.redraw();
    };

    /**
     * Обработчик события на опускание мыши.
     */
    var onMouseDown = function () {
        if (!self.enabled) return;
        mouseStateDown = true;
        self.redraw();
    };

    /**
     * Обработка события выхода фокуса мыши.
     */
    var onMouseOut = function () {
        if (!self.enabled) return;
        mouseStateFocused = false;
        self.redraw();
    };

    /**
     * Обработка события на клик.
     * @param mouseEvent {MouseEvent}
     * @param dom {Element}
     */
    var onMouseClick = function (mouseEvent, dom) {
        /* Да, тут мы останавливаем дальнейшие течение клика. */
        mouseEvent.stopPropagation();
        if (self.stateId === ElementChest.STATE_CLOSE) return;
        mouseStateDown = false;
        mouseStateFocused = false;
        self.redraw();
        return self.onClick.call(null, mouseEvent, dom, this);
    };
};

ElementChest.STATE_CLOSE = 1;
ElementChest.STATE_OPEN = 2;

