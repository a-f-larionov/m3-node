/**
 * Адаптация для работы с гуёй. В данном случае это браузер.
 * Все запросы к гуи должны быть реализованы тут. и тут: GUIDom
 * @constructor
 * @property x {int}
 * @property y {int}
 * @property width {int}
 * @property height {int}
 * @property backgroundImage {url}
 * @property backgroundSize {int}
 * @property innerHTML {string}
 * @property pointer {GUI.POINTER_*}
 * @property opacity {Number}
 * @property fontWeight {String}
 * @property fontSize {String}
 * @property fontFamily {String}
 * @property color {String}
 * @property textShadow {String}
 * @property borderRadius {String}
 * @property border {String}
 * @property borderTop {String}
 * @property borderRight {String}
 * @property borderBottom {String}
 * @property borderLeft {String}
 * @property padding {String}
 * @property boxShadow {String}
 * @property lineHeight {Number}
 * @property background {String}
 * @property transform {String}
 * @property title {String}
 * @property isItsepia {Bool}
 * @property alignText {String}
 * @property zIndex {Int}
 * @property fontWeight {String}
 * @property overflow {String}
 * @property textDecoration {String}
 * @property rotate {Int}
 */
let GUIDom = function () {
    let self = this;

    this.__id = ++GUIDom.lastId;

    /**
     * Старые свойства.
     * Их мы будем хранить, что бы не перерисовывать лишний раз,
     * то что не меняется.
     * @type {{}}
     */
    let oldProps = {};

    /**
     * Показывтаь ли дом.
     * @type {boolean}
     */
    let showed = false;

    /**
     * Дом браузера.
     * @type {Element}
     */
    let dom = null;

    this.animTracks = [];
    this.animData = [];
    this.animPlayed = false;

    /**
     * Создается элемент браузера
     * Настраиваются минимальные параметры
     * @param tagName [string] input|div
     * @param parent [GUIDom] родитель.
     */
    this.init = function (tagName, parent) {
        /** Начальное значение старых свойств */
        for (let i in props) {
            oldProps[i] = undefined;
        }
        if (!tagName) {
            tagName = 'span';
        }
        /** Создадим дом */
        dom = document.createElement(tagName);
        /** Значения по умолчанию для дом-ов. */
        dom.className = 'gui-dom';
        if (tagName === 'input') {
            dom.style.border = 'none';
        }
        /** Does not dragable by default */
        dom.ondragstart = function () {
            return false;
        };
        /** Добавим дом к родителю. */
        this.__dom = dom;
        dom.__dom = this;
        if (!parent) {
            parent = GUI.getCurrentParent();
        } else {
            parent = parent.__dom;
        }
        parent.appendChild(dom);
    };

    /**
     * Покажем дом.
     */
    this.show = function () {
        if (showed) {
            return;
        }
        showed = true;
        dom.style.display = '';
        self.redraw();
    };

    /**
     * Спрячем дом.
     */
    this.hide = function () {
        if (!showed) {
            return;
        }
        showed = false;
        dom.style.display = 'none';
    };

    /**
     * Перересовка дома.
     * Только те свойства, которые изменились.
     */
    this.redraw = function () {
        if (!showed) {
            return;
        }
        for (let name in props) {
            if (oldProps[name] !== self[name]) {
                props[name].call();
                oldProps[name] = self[name];
            }
        }
    };

    /**
     * id текущей запущенной анимации.
     * если null - анимация отключается.
     * @type {null}
     */
    let animateNowId = null;

    /**
     * Аргументы переданные при запуске анимации.
     * @type {Array}
     */
    let animateArguments = [];

    /**
     * тайм-аут для анимации.
     * @type {null}
     */
    let animateTimeout = null;

    let ANIMATE_NOW_OPACITY_UP = 1;
    let ANIMATE_NOW_OPACITY_DOWN = 2;

    /**
     * Остановить текущую анимацию.
     */
    this.animateStop = function () {
        animateNowId = null;
    };
    /**
     * Анимация прозрачности.
     * @param target {Number}
     */
    this.animateOpacity = function (target, from, timeout) {
        let direction;

        if (from !== undefined) {
            self.opacity = from;
        }
        if (!self.opacity) {
            self.opacity = 0;
        }
        from = self.opacity;

        if (from < target) {
            animateNowId = ANIMATE_NOW_OPACITY_UP;
        } else {
            animateNowId = ANIMATE_NOW_OPACITY_DOWN;
        }
        animateArguments = [];
        animateArguments.push(target);
        animateArguments.push(from);
        /* animateStep */
        animateArguments.push(Math.abs((target - from) / 24));
        animateTimeout = timeout;

        animateNow();
    };

    let animateNow = function () {
        switch (animateNowId) {
            case ANIMATE_NOW_OPACITY_UP:
                animateOpacityUp.apply(this, animateArguments);
                break;
            case ANIMATE_NOW_OPACITY_DOWN:
                animateOpacityDown.apply(this, animateArguments);
                break;
            default:
                /** Останавливаем анимацию. */
                return;
                break;
        }

        setTimeout(function () {
            animateNow();
            self.redraw();
        }, animateTimeout);
    };

    let animateOpacityUp = function (target, from, step) {
        if (self.opacity < target) {
            self.opacity += step;
        } else {
            self.opacity = target;
            animateNowId = null;
        }
    };

    let animateOpacityDown = function (target, from, step) {
        if (self.opacity > target) {
            self.opacity -= step;
        } else {
            self.opacity = target;
            animateNowId = null;
        }
    };

    /**
     * Прицепляем событие.
     * @param eventId
     * @param callback
     * @param context
     */
    this.bind = function (eventId, callback, context) {
        let eventName;
        eventName = GUI.eventNames[eventId];
        if (!eventName) {
            Logs.log("undefined gui eventId:" + eventId, Logs.LEVEL_FATAL_ERROR);
        }
        dom.addEventListener(eventName, function (event) {
            if (GUI.lockEventsExcept) {
                let dom, skip;
                dom = self.__dom;
                skip = true;
                while (dom) {
                    if (GUI.lockEventsExcept.__dom === dom) {
                        skip = false;
                    }
                    dom = dom.parentElement;
                }
                if (skip) return;
            }
            callback.call(context, event, dom);
        }, false);
    };

    this.setFocus = function () {
        dom.focus();
    };

    /* Далее идут методы перерисовки. */
    let redrawX = function () {
        dom.style.left = self.x + 'px';
    };
    let redrawY = function () {
        dom.style.top = self.y + 'px';
    };
    let redrawWidth = function () {
        dom.style.width = self.width + 'px';
        if (self.backgroundImage) redrawBackgroundImage();
    };
    let redrawHeight = function () {
        dom.style.height = self.height + 'px';
        if (self.backgroundImage) redrawBackgroundImage();
    };
    let  redrawBackgroundImage = function () {
        let meta;
        meta = Images.getMeta(self.backgroundImage);
        /** Если размер не задан, пробуем задать его автоматически. */
        if (!self.width && !self.height && meta.path && meta.w && meta.h) {
            self.width = meta.w;
            self.height = meta.h;
            props.height.call();
            props.width.call();
        }

        dom.style.backgroundImage = 'url(' + meta.path + ')';
        self.backgroundPositionY = self.backgroundPositionY ? self.backgroundPositionY : 0;
        dom.style.backgroundPositionX = '-' + Images.getX(self.backgroundImage) + 'px';
        dom.style.backgroundPositionY = '-' + (Images.getY(self.backgroundImage) + self.backgroundPositionY) + 'px';
        dom.style.backgroundRepeat = 'no-repeat';
        if (self.noScale) {
            // double if no sprite...
            dom.style.backgroundSize =
                (meta.w) + 'px' + ' ' +
                (meta.h) + 'px';
        } else {
            if (window.useSprite && self.width && self.height) {
                dom.style.backgroundPositionX =
                    parseInt(dom.style.backgroundPositionX) * self.width / meta.w + 'px';
                dom.style.backgroundPositionY =
                    parseInt(dom.style.backgroundPositionY) * self.height / meta.h + 'px';
                dom.style.backgroundSize =
                    (window.spriteSize.width * self.width / meta.w) + 'px ' +
                    (window.spriteSize.height * self.height / meta.h) + 'px ';
            } else {
                dom.style.backgroundSize =
                    (self.width) + 'px' + ' ' +
                    (self.height) + 'px';
            }
        }
    };
    let redrawBackgroundSize = function () {
        dom.style.backgroundSize = self.backgroundSize + 'px';
    };
    let redrawInnerHTML = function () {
        dom.innerHTML = self.innerHTML;
    };
    let redrawPointer = function () {
        dom.style.cursor = self.pointer;
    };
    let redrawOpacity = function () {
        dom.style.opacity = self.opacity;
    };
    let redrawFontWeight = function () {
        dom.style.fontWeight = self.fontWeight;
    };
    let redrawFontSize = function () {
        dom.style.fontSize = self.fontSize + 'px';
    };
    let redrawFontFamily = function () {
        dom.style.fontFamily = self.fontFamily;
    };
    let redrawColor = function () {
        dom.style.color = self.color;
    };
    let redrawTextShadow = function () {
        dom.style.textShadow = self.textShadow;
    };
    let redrawBorderRadius = function () {
        dom.style.borderRadius = self.borderRadius;
    };
    let redrawBorder = function () {
        dom.style.border = self.border;
    };
    let redrawBorderTop = function () {
        dom.style.borderTop = self.borderTop;
    };
    let redrawBorderRight = function () {
        dom.style.borderRight = self.borderRight;
    };
    let redrawBorderBottom = function () {
        dom.style.borderBottom = self.borderBottom;
    };
    let redrawBorderLeft = function () {
        dom.style.borderLeft = self.borderLeft;
    };
    let redrawPadding = function () {
        dom.style.padding = self.padding;
    };
    let redrawBoxShadow = function () {
        dom.style.boxShadow = self.boxShadow;
    };
    let redrawLineHeight = function () {
        dom.style.lineHeight = self.lineHeight;
    };
    let redrawBackground = function () {
        dom.style.background = self.background;
    };
    let redrawTransform = function () {
        dom.style.transform = self.transform;
    };
    let redrawTitle = function () {
        dom.setAttribute('title', self.title);
    };
    let redrawIsItSepia = function () {
        /*
         filter: url("data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\'><filter id=\'old-timey\'><feColorMatrix type=\'matrix\' values=\'0.14 0.45 0.05 0 0 0.12 0.39 0.04 0 0 0.08 0.28 0.03 0 0 0 0 0 1 0\'/></filter></svg>#old-timey");
         -webkit-filter: sepia(0.5);
         -webkit-filter: sepia(95%) grayscale(50%);
         -moz-filter: sepia(80%);
         -ms-filter: sepia(80%);
         -o-filter: sepia(80%);
         filter: sepia(80%);
         */
        dom.className += 'sepia';
    };
    let redrawAlignText = function () {
        dom.style.textAlign = self.alignText;
    };
    let redrawZIndex = function () {
        dom.style.zIndex = self.zIndex;
    };
    let redrawOverflow = function () {
        dom.style.overflow = self.overflow;
    };
    let redrawTextDecoration = function () {
        dom.style.textDecoration = self.textDecoration;
    };
    let redrawRotate = function () {
        dom.style.transform = 'rotate(' + self.rotate + 'deg)';
    };

    /**
     * Имена свойств и их методы обработки.
     * @type {{x: Function, y: Function, width: Function, height: Function, backgroundImage: *, innerHTML: Function, pointer: Function, opacity: Function, fontWeight: *, fontSize: *, fontFamily: Function, color: Function, textShadow: Function, borderRadius: Function, border: Function, borderTop: Function, borderRight: Function, borderBottom: Function, borderLeft: Function, padding: Function, boxShadow: Function, lineHeight: Function, background: Function, transform: Function, title: *}}
     */
    let props = {
        x: redrawX,
        y: redrawY,
        width: redrawWidth,
        height: redrawHeight,
        backgroundPositionY: redrawBackgroundImage,
        backgroundImage: redrawBackgroundImage,
        backgroundSize: redrawBackgroundSize,
        innerHTML: redrawInnerHTML,
        pointer: redrawPointer,
        opacity: redrawOpacity,
        fontWeight: redrawFontWeight,
        fontSize: redrawFontSize,
        fontFamily: redrawFontFamily,
        color: redrawColor,
        textShadow: redrawTextShadow,
        borderRadius: redrawBorderRadius,
        border: redrawBorder,
        borderTop: redrawBorderTop,
        borderRight: redrawBorderRight,
        borderBottom: redrawBorderBottom,
        borderLeft: redrawBorderLeft,
        padding: redrawPadding,
        boxShadow: redrawBoxShadow,
        lineHeight: redrawLineHeight,
        background: redrawBackground,
        transform: redrawTransform,
        title: redrawTitle,
        isItsepia: redrawIsItSepia,
        alignText: redrawAlignText,
        zIndex: redrawZIndex,
        overflow: redrawOverflow,
        textDecoration: redrawTextDecoration,
        rotate: redrawRotate,
    };

    /**
     * Animate
     */
    this.animate = function () {
        if (!self.animPlayed) {
            return;
        }
        if (!showed) {
            return;
        }
        for (let t in self.animTracks) {
            self.proccessTrack(t);
        }
    };

    this.proccessTrack = function (tN) {
        let frame;
        frame = self.animTracks[tN][self.animData[tN].frameN];
        switch (frame.type) {
            case GUI.ANIM_TYPE_ROTATE:
                if (frame.currentAngle >= 360) {
                    frame.currentAngle = 0;
                }
                self.transform = 'rotate(' + (frame.currentAngle += frame.angle) + 'deg)';
                self.redraw();
                break;
            case GUI.ANIM_TYPE_GOTO:
                self.animData[tN].frameN = frame.pos;
                break;
            case GUI.ANIM_TYPE_MOVIE:
                frame.imageN++;
                if (frame.imageN === frame.images.length) {
                    frame.imageN = 0;
                }
                self.backgroundImage = frame.images[frame.imageN];
                self.redraw();
                break;
            case GUI.ANIM_TYPE_MOVE:
                self.x += frame.vX;
                self.y += frame.vY;
                self.redraw();
                break;
            case GUI.ANIM_TYPE_PAUSE:
                break;
            case GUI.ANIM_TYPE_STOP:
                self.animPlayed = false;
                if (frame.callback) {
                    frame.callback();
                }
                break;
        }
        self.animData[tN].counter++;
        // if counter > duration => frameN++
        if (frame.duration && self.animData[tN].counter > frame.duration) {
            self.animData[tN].frameN++;
            self.animData[tN].counter = 0;
            if (self.animTracks[tN][self.animData[tN].frameN] === undefined) {
                self.animPlayed = false;
                self.animData[tN].frameN = 0;
                if (frame.callback) {
                    frame.callback();
                }
            }
        }
    };
};

/**
 * Уникальнгый id для каждогого дома, иногда нужна уникальность дома, для таймаутов например.
 * @type {number}
 */
GUIDom.lastId = 0;