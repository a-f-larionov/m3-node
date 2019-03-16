/**
 * Элемент кнопки.
 * @constructor
 * @property x
 * @property y
 * @property stars
 * @property friends
 */
ElementPoint = function () {
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
    this.srcGrey = '/images/map-way-point-grey.png';

    /**
     * Ссылка на картинку при активации кнопки(клике).
     * @type {string}
     */
    this.srcRed = '/images/map-way-point-red.png';

    /**
     * Ссылка на картинку в покое(ожидании/бездействии).
     * @type {string}
     */
    this.srcYellow = '/images/map-way-point-yellow.png';

    this.srcStarOff = '/images/star-off.png';
    this.srcStarOn = '/images/star-on.png';

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

    let domStar1 = null;
    let domStar2 = null;
    let domStar3 = null;

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
     * Состояние точки точки, 1 - серый, 2 - красный, 3 - жёлтый
     * @type {number}
     */
    this.stateId = 1;

    this.pointId = null;

    this.numberId = null;

    /**
     * Создадим дом и настроем его.
     */
    this.init = function () {
        dom = GUI.createDom();
        dom.width = self.width;
        dom.height = self.height;
        dom.backgroundImage = self.srcGrey;
        dom.pointer = GUI.POINTER_HAND;
        GUI.bind(dom, GUI.EVENT_MOUSE_MOUSE_DOWN, onMouseDown, self);
        GUI.bind(dom, GUI.EVENT_MOUSE_CLICK, onMouseClick, self);
        GUI.bind(dom, GUI.EVENT_MOUSE_OVER, onMouseOver, self);
        GUI.bind(dom, GUI.EVENT_MOUSE_OUT, onMouseOut, self);

        domStar1 = GUI.createDom();
        domStar1.backgroundImage = self.srcStarOff;

        domStar2 = GUI.createDom();
        domStar2.backgroundImage = self.srcStarOff;

        domStar3 = GUI.createDom();
        domStar3.backgroundImage = self.srcStarOff;
    };

    /**
     * Покажем кнопку.
     */
    this.show = function () {
        if (showed == true) return;
        showed = true;
        dom.show();
        self.redraw();
        //domStar1.show();
        //domStar2.show();
        //domStar3.show();
    };

    /**
     * Спрячем кнопку.
     */
    this.hide = function () {
        if (showed == false) return;
        showed = false;
        dom.hide();
        domStar1.hide();
        domStar2.hide();
        domStar3.hide();
    };

    /**
     * Перерисуем кнопку.
     */
    this.redraw = function () {
        let src;
        if (!showed) return;
        switch (this.stateId) {
            case 1:
                dom.backgroundImage = this.srcGrey;
                break;
            case 2:
                dom.backgroundImage = this.srcRed;
                break;
            case 3:
                dom.backgroundImage = this.srcYellow;
                break;
        }

        if (self.stateId == ElementPoint.STATE_CLOSE) {
            dom.pointer = GUI.POINTER_ARROW;
        } else {
            dom.pointer = GUI.POINTER_HAND;
        }
        dom.x = self.x;
        dom.y = self.y;
        let stars = 0;

        if (self.userScore >= self.score1) stars = 1;
        if (self.userScore >= self.score2) stars = 2;
        if (self.userScore >= self.score3) stars = 3;

        domStar1.x = self.x - 30;
        domStar1.y = self.y - 30;
        domStar1.backgroundImage = stars >= 1 ? self.srcStarOn : self.srcStarOff;


        domStar2.x = self.x;
        domStar2.y = self.y - 60;
        domStar2.backgroundImage = stars >= 2 ? self.srcStarOn : self.srcStarOff;

        domStar3.x = self.x + 30;
        domStar3.y = self.y - 30;
        domStar3.backgroundImage = stars >= 3 ? self.srcStarOn : self.srcStarOff;

        dom.redraw();
        domStar1.redraw();
        domStar2.redraw();
        domStar3.redraw();
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
        if (self.stateId == ElementPoint.STATE_CLOSE)return;
        mouseStateDown = false;
        mouseStateFocused = false;
        self.redraw();
        return self.onClick.call(null, mouseEvent, dom, this);
    };
};

ElementPoint.STATE_CLOSE = 1;
ElementPoint.STATE_CURRENT = 2;
ElementPoint.STATE_FINISHED = 3;
