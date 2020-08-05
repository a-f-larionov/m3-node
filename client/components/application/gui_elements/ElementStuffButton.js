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
    this.srcHover = null;

    /**
     * Ссылка на картинку при активации кнопки(клике).
     * @type {string}
     */
    this.srcActive = null;

    /**
     * Ссылка на картинку в покое(ожидании/бездействии).
     * @type {string}
     */
    this.srcRest = null;

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

    let plusButton = null;

    let point = null;

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
        dom.isStuffButton = true;
        GUI.bind(dom, GUI.EVENT_MOUSE_MOUSE_DOWN, onMouseDown, self);
        GUI.bind(dom, GUI.EVENT_MOUSE_CLICK, onMouseClick, self);
        GUI.bind(dom, GUI.EVENT_MOUSE_OVER, onMouseOver, self);
        GUI.bind(dom, GUI.EVENT_MOUSE_OUT, onMouseOut, self);

        point = GUI.createDom(null, {backgroundImage: 'map-way-point-grey.png'});
        counter = GUI.createElement(ElementText, {width: 20, height: 26});
        plusButton = GUI.createElement(ElementButton, {
            srcRest: 'button-add-rest.png', width: 25, height: 25,
            onClick: onPlusButtonClick
        });
        plusButton.pointer = GUI.POINTER_HAND;
        //GUI.bind(plusButton, GUI.EVENT_MOUSE_CLICK, onPlusButtonClick, self);
    };

    /**
     * Покажем кнопку.
     */
    this.show = function () {
        if (showed === true) return;
        showed = true;
        dom.show();
        counter.show();
        plusButton.show();
        point.show();
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
        plusButton.hide();
        point.hide();
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
                dom.width = w * 1.1;
                dom.height = h * 1.1;
                dom.x = self.x - w * 0.05;
                dom.y = self.y - h * 0.05;
            }
        }
        if (mouseStateFocused && mouseStateDown) {
            if (self.srcHover) src = self.srcActive; else {
                dom.width = Images.getWidth(self.srcRest) * 1.2;
                dom.height = Images.getHeight(self.srcRest) * 1.2;
                dom.x = self.x - w * 0.1;
                dom.y = self.y - h * 0.1;
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
        counter.x = self.x + 65 - 5;
        counter.y = self.y + 22;
        plusButton.x = self.x;
        plusButton.y = self.y + 35;
        point.x = self.x + 65 - 20;
        point.y = self.y + 22 - 15;
        counter.setText(LogicStuff.getStuff(self.fieldName));
        dom.redraw();
        counter.redraw();
        plusButton.redraw();
        point.redraw();
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

    let onPlusButtonClick = function () {
        PageBlockZDialogs.dialogStuffShop.showDialog(self.fieldName);
    }
};