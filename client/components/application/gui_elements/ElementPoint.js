/**
 * Элемент кнопки.
 * @constructor
 * @property x
 * @property y
 */
let ElementPoint = function () {
    let self = this;

    /**
     * Показывать ли элемент.
     * @type {boolean}
     */
    let showed = false;

    let photoSize = 24;

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
     * Ссылка на картинку при наведении фокуса(мыши).
     * @type {string}
     */
    this.srcGrey = 'map-way-point-grey.png';

    /**
     * Ссылка на картинку при активации кнопки(клике).
     * @type {string}
     */
    this.srcRed = 'map-way-point-red.png';

    /**
     * Ссылка на картинку в покое(ожидании/бездействии).
     * @type {string}
     */
    this.srcYellow = 'map-way-point-yellow.png';

    this.srcStarOff = 'star-off.png';
    this.srcStarOn = 'star-on.png';

    /**
     * Будет вызываться при нажатии на кнопку.
     * @type {function}
     */
    this.onClick = null;

    /**
     * Дом картинки.
     * @type {GUIDom}
     */
    let dom = null;

    let gamers = [];

    /**
     * Первая звезда
     * @type {GUIDom}
     */
    let domStar1 = null;
    /**
     * Вторая звезда
     * @type {GUIDom}
     */
    let domStar2 = null;
    /**
     * Третья звезда
     * @type {GUIDom}
     */
    let domStar3 = null;
    /**
     * Фото друга 1
     * @type {GUIDom}
     */
    let dPhoto1 = null;
    /**
     * Фото друга 2
     * @type {GUIDom}
     */
    let dPhoto2 = null;
    /**
     * Фото друга 3
     * @type {GUIDom}
     */
    let dPhoto3 = null;

    let elText = null;

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
     * Состояние точки точки, 1 - серый, 2 - красный, 3 - жёлтый
     * @type {number}
     */
    this.stateId = ElementPoint.STATE_CLOSE;

    this.pointId = null;

    this.pointWidth = 50;

    /**
     * Создадим дом и настроем его.
     */
    this.init = function () {
        dom = GUI.createDom();
        dom.backgroundImage = self.srcGrey;
        dom.pointer = GUI.POINTER_HAND;
        GUI.bind(dom, GUI.EVENT_MOUSE_MOUSE_DOWN, onMouseDown, self);
        GUI.bind(dom, GUI.EVENT_MOUSE_CLICK, onMouseClick, self);
        GUI.bind(dom, GUI.EVENT_MOUSE_OVER, onMouseOver, self);
        GUI.bind(dom, GUI.EVENT_MOUSE_OUT, onMouseOut, self);

        elText = GUI.createElement(ElementText, {
            width: 33, height: 20,
            fontSize: 15,
            pointer: GUI.POINTER_HAND
        }, dom);

        domStar1 = GUI.createDom();
        domStar1.backgroundImage = self.srcStarOff;

        domStar2 = GUI.createDom();
        domStar2.backgroundImage = self.srcStarOff;

        domStar3 = GUI.createDom();
        domStar3.backgroundImage = self.srcStarOff;

        dPhoto1 = GUI.createDom(null, {
            height: photoSize, width: photoSize,
            border: '1px solid #715f4b',
            borderRadius: '2px', zIndex: 100
        });
        dPhoto2 = GUI.createDom(null, {
            height: photoSize, width: photoSize,
            border: '1px solid #715f4b',
            borderRadius: '2px', zIndex: 100
        });
        dPhoto3 = GUI.createDom(null, {
            height: photoSize, width: photoSize,
            border: '1px solid #715f4b',
            borderRadius: '2px', zIndex: 100
        });
    };

    /**
     * Покажем кнопку.
     */
    this.show = function () {
        if (showed) return;
        showed = true;
        self.redraw();
        dom.show();
        domStar1.show();
        domStar2.show();
        domStar3.show();
        elText.show();
    };

    /**
     * Спрячем кнопку.
     */
    this.hide = function () {
        if (!showed) return;
        showed = false;
        dom.hide();
        domStar1.hide();
        domStar2.hide();
        domStar3.hide();
        elText.hide();
        dPhoto1.hide();
        dPhoto2.hide();
        dPhoto3.hide();
    };

    /**
     * Перерисуем кнопку.
     */
    this.redraw = function () {
        if (!showed) return;
        switch (this.stateId) {
            case ElementPoint.STATE_CLOSE:
                dom.pointer = GUI.POINTER_ARROW;
                dom.backgroundImage = this.srcGrey;
                break;
            case ElementPoint.STATE_CURRENT:
                dom.pointer = GUI.POINTER_HAND;
                dom.backgroundImage = this.srcRed;
                break;
            case ElementPoint.STATE_FINISHED:
                dom.pointer = GUI.POINTER_HAND;
                dom.backgroundImage = this.srcYellow;
                break;
        }

        if (self.stateId === ElementPoint.STATE_CLOSE) {
            dom.pointer = GUI.POINTER_ARROW;
        } else {
            dom.pointer = GUI.POINTER_HAND;
        }
        dom.x = self.x;
        dom.y = self.y;

        elText.x = 9;
        elText.y = 16.5;
        elText.text = self.pointId ? self.pointId.toString() : '';

        redrawStars();
        redrawPhotos();

        dom.redraw();
        domStar1.redraw();
        domStar2.redraw();
        domStar3.redraw();
        elText.redraw();
    };

    let redrawStars = function () {
        let count, offsetX, offsetY;

        count = DataPoints.countStars(self.pointId);

        offsetX = (self.pointWidth / 2 - 25 / 2);
        offsetY = 7;

        domStar1.x = self.x - 17 + offsetX;
        domStar1.y = self.y - offsetY;
        domStar1.backgroundImage = count >= 1 ? self.srcStarOn : self.srcStarOff;

        domStar2.x = self.x + offsetX;
        domStar2.y = self.y - offsetY - 11;
        domStar2.backgroundImage = count >= 2 ? self.srcStarOn : self.srcStarOff;

        domStar3.x = self.x + 17 + offsetX;
        domStar3.y = self.y - offsetY;
        domStar3.backgroundImage = count >= 3 ? self.srcStarOn : self.srcStarOff;
    };

    let redrawPhotos = function () {
        let offsetX = (self.pointWidth / 2 - photoSize / 2) - 2;
        /** H   alf of Y */
        let offsetY, offsetCenterY
            , index = 0;
        let doms = [dPhoto1, dPhoto2, dPhoto3];

        if (self.y > 250
            || DataMap.getNumberFromPointId(self.pointId) === 1
            || DataMap.getNumberFromPointId(self.pointId) === 18
        ) {
            offsetY = -38;
            offsetCenterY = 5;
        } else {
            offsetY = +38;
            offsetCenterY = -5;
        }

        dPhoto1.x = self.x - 18 + offsetX;
        dPhoto1.y = self.y + offsetY;

        dPhoto2.x = self.x + offsetX;
        dPhoto2.y = self.y + offsetY - offsetCenterY;

        dPhoto3.x = self.x + 19 + offsetX;
        dPhoto3.y = self.y + offsetY;

        index = 0;
        gamers.forEach(function (user) {

            if (!user) doms[index].hide();
            else {
                if (user && user.photo50
                    && user.nextPointId === self.pointId
                ) {
                    doms[index].backgroundImage = user.photo50;
                    doms[index].title = user.firstName;
                    doms[index].show();
                    doms[index].redraw();
                } else {
                    doms[index].hide();
                }
            }
            index++;
        });
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
        if (self.stateId === ElementPoint.STATE_CLOSE) return;
        mouseStateDown = false;
        mouseStateFocused = false;
        self.redraw();
        return self.onClick.call(null, mouseEvent, dom, this);
    };

    /**
     * Игроки на точке это друзья
     * @param users
     */
    this.setGamers = function (users) {
        /*@todo брать сначало из топа, а потом уже друзей любых*/
        if (self.pointId === LogicUser.getCurrent().nextPointId) {
            users.push(LogicUser.getCurrent());
        }
        gamers = users.slice(0, 3);
        /** Центрируем если игрок только один */
        if (gamers.length === 1) gamers.unshift(null);
        while (gamers.length < 3) gamers.push(null);
    }
};

ElementPoint.STATE_CLOSE = 1;
ElementPoint.STATE_CURRENT = 2;
ElementPoint.STATE_FINISHED = 3;
