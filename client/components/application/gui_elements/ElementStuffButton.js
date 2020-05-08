/**
 * Элемент инструмент(магия) молоток там и т.д..
 * @constructor
 * @property x
 * @property y
 * @property srcRest
 * @property srcHover
 * @property srcActive
 *
 */
let ElementStuffButton = function () {
    let self = this;

    /**
     * Показывать ли элемент.
     * @type {boolean}
     */
    let showed = false;

    /**
     * Координата X кнопки.
     * @type {number}
     */
    this.x = 0;

    /**
     * Координата Y кнопки.
     * @type {number}
     */
    this.y = 0;

    /**
     * Ширина кнопки.
     * @type {number}
     */
    this.width = 0;

    /**
     * Высота кноки.
     * @type {number}
     */
    this.height = 0;

    /**
     * Ссылка на картинку при наведении фокуса(мыши).
     * @type {string}
     */
    this.srcHover = '/path/to/image/hover.png';

    /**
     * Ссылка на картинку при активации кнопки(клике).
     * @type {string}
     */
    this.srcActive = '/path/to/image/active.png';

    /**
     * Ссылка на картинку в покое(ожидании/бездействии).
     * @type {string}
     */
    this.srcRest = 'path/to/image/rest1.png';

    /**
     * Будет вызываться при нажатии на кнопку.
     * @type {function}
     */
    this.onClick = null;

    /**
     * Подсказка кнопки.
     * @type {String}
     */
    this.title = null;

    /**
     * Активна ли кнопка.
     * @type {boolean}
     */
    this.enabled = true;

    /**
     * Дом картинки.
     * @type {GUIDom}
     */
    let dom = null;

    let counter = null;

    /**
     * Опущена ли мышка.
     * @type {boolean}
     */
    let mouseStateDown = false;

    /**
     * Мышь в фокусе.
     * @type {boolean}
     */
    let mouseStateFocused = false;

    /**
     * Создадим дом и настроем его.
     */
    this.init = function () {
        dom = GUI.createDom();
        dom.width = self.width;
        dom.height = self.height;
        dom.backgroundImage = self.srcRest;
        dom.pointer = GUI.POINTER_HAND;
        GUI.bind(dom, GUI.EVENT_MOUSE_MOUSE_DOWN, onMouseDown, self);
        GUI.bind(dom, GUI.EVENT_MOUSE_CLICK, onMouseClick, self);
        GUI.bind(dom, GUI.EVENT_MOUSE_OVER, onMouseOver, self);
        GUI.bind(dom, GUI.EVENT_MOUSE_OUT, onMouseOut, self);

        counter = GUI.createElement(ElementText, {});
    };

    /**
     * Покажем кнопку.
     */
    this.show = function () {
        if (showed === true) return;
        showed = true;
        dom.show();
        counter.show();
        self.redraw();
    };

    /**
     * Спрячем кнопку.
     */
    this.hide = function () {
        if (showed === false) return;
        showed = false;
        dom.hide();
        counter.hide();
    };

    /**
     * Перерисуем кнопку.
     */
    this.redraw = function () {
        let src, w, h;
        if (!showed) return;

        dom.x = self.x;
        dom.y = self.y;

        src = self.srcRest;
        w = self.width ? self.width : Images.getWidth(self.srcRest);
        h = self.height ? self.height : Images.getHeight(self.srcRest);

        dom.width = w;
        dom.height = h;

        if (mouseStateFocused) {
            if (self.srcHover) src = self.srcHover; else {
                dom.width = w * 1.05;
                dom.height = h * 1.05;
                dom.x = self.x - w * 0.025;
                dom.y = self.y - h * 0.025;
            }
        }
        if (mouseStateFocused && mouseStateDown) {
            if (self.srcHover) src = self.srcActive; else {
                dom.width = Images.getWidth(self.srcRest) * 1.1;
                dom.height = Images.getHeight(self.srcRest) * 1.1;
                dom.x = self.x - w * 0.05;
                dom.y = self.y - h * 0.05;
            }
        }
        if (!mouseStateFocused && mouseStateDown) src = self.srcRest;
        dom.backgroundImage = src;

        if (self.title) dom.title = self.title;
        if (self.enabled) {
            dom.pointer = GUI.POINTER_HAND;
            dom.opacity = 1.0;
        } else {
            dom.pointer = GUI.POINTER_ARROW;
            dom.opacity = 0.5;
        }
        counter.x = self.x + 70;
        counter.y = self.y + 40;
        counter.setText(LogicStuff.getStuff(self.fieldName));
        dom.redraw();
        counter.redraw();
    };

    /**
     * Обработка события фокуса мыши.
     */
    let onMouseOver = function () {
        if (!self.enabled) return;
        mouseStateFocused = true;
        self.redraw();
    };

    /**
     * Обработчик события на опускание мыши.
     */
    let onMouseDown = function () {
        if (!self.enabled) return;
        mouseStateDown = true;
        self.redraw();
    };

    /**
     * Обработка события выхода фокуса мыши.
     */
    let onMouseOut = function () {
        if (!self.enabled) return;
        mouseStateFocused = false;
        self.redraw();
    };

    /**
     * Обработка события на клик.
     * @param mouseEvent {MouseEvent}
     * @param dom {Element}
     */
    let onMouseClick = function (mouseEvent, dom) {
        /** Да, тут мы останавливаем дальнейшие течение клика. */
        mouseEvent.stopPropagation();
        if (!self.enabled) return;
        mouseStateDown = false;
        mouseStateFocused = false;
        self.redraw();
        return self.onClick.call(null, mouseEvent, dom);
    };
};