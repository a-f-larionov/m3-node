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
ElementStuffButton = function () {
    var self = this;

    /**
     * Показывать ли элемент.
     * @type {boolean}
     */
    var showed = false;

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
    this.srcRest = 'path/to/image/rest.png';

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
    var dom = null;

    let counter = null;

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
        if (showed == true) return;
        showed = true;
        dom.show();
        counter.show();
        self.redraw();
    };

    /**
     * Спрячем кнопку.
     */
    this.hide = function () {
        if (showed == false) return;
        showed = false;
        dom.hide();
        counter.hide();
    };

    /**
     * Перерисуем кнопку.
     */
    this.redraw = function () {
        var src;
        if (!showed) return;
        src = self.srcRest;
        if (mouseStateFocused) src = self.srcHover;
        if (mouseStateFocused && mouseStateDown) src = self.srcActive;
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
        dom.x = self.x;
        dom.y = self.y;
        counter.x = self.x + 40;
        counter.y = self.y + 40;
        counter.setText(LogicStuff.getStuff(self.fieldName));
        dom.redraw();
        counter.redraw();
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
        if (!self.enabled) return;
        mouseStateDown = false;
        mouseStateFocused = false;
        self.redraw();
        return self.onClick.call(null, mouseEvent, dom);
    };
};