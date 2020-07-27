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
     * Их мы будем хранить, чтобы не перерисовывать лишний раз,
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

    /**
     * Создается элемент браузера
     * Настраиваются минимальные параметры
     * @param parent [GUIDom] родитель.
     */
    this.init = function (parent) {
        /** Начальное значение старых свойств */
        for (let i in props) {
            oldProps[i] = undefined;
        }
        /** Создадим дом */
        dom = document.createElement('div');
        /** Значения по умолчанию для дом-ов. */
        dom.className = 'gui-dom';
        /** Does not dragable by default */
        dom.ondragstart = function () {
            return false;
        };
        /** Добавим дом к родителю. */
        this.__dom = dom;
        dom.__dom = this;
        if (!parent) parent = GUI.getCurrentParent();
        parent.appendChild(dom);
    };

    this.appendChild = function (dom) {
        this.__dom.appendChild(dom);
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

    /** Далее идут методы перерисовки. */
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
        dom.style.height = (!isNaN(self.visibleHeight) ? self.visibleHeight : self.height) + 'px';

        if (self.backgroundImage) redrawBackgroundImage();
    };
    let redrawBackgroundImage = function () {
        let meta, kW, kH, s;
        meta = Images.getMeta(self.backgroundImage);
        /** Если размер не задан, пробуем задать его автоматически. */
        if (!self.width && !self.height && meta.path && meta.w && meta.h) {
            self.width = meta.w;
            self.height = meta.h;
            props.height.call();
            props.width.call();
        }
        s = dom.style;
        s.backgroundImage = 'url(' + meta.path + ')';
        s.backgroundRepeat = 'no-repeat';

        s.backgroundPositionX = '-' + meta.x + 'px';
        self.backgroundPositionY = self.backgroundPositionY ? self.backgroundPositionY : 0;
        s.backgroundPositionY = '-' + (meta.y + self.backgroundPositionY) + 'px';


        if ((window.useSprite && !meta.absolute) && self.width && self.height) {

            kW = self.width / meta.w;
            kH = self.height / meta.h;

            s.backgroundPositionX =
                parseInt(dom.style.backgroundPositionX) * kW + 'px';
            s.backgroundPositionY =
                parseInt(dom.style.backgroundPositionY) * kH + 'px';
            s.backgroundSize =
                (window.spriteSize.width * kW) + 'px ' +
                (window.spriteSize.height * kH) + 'px ';
        } else {
            s.backgroundSize =
                (self.width) + 'px' + ' ' +
                (self.height) + 'px';
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
        visibleHeight: redrawHeight,
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
        alignText: redrawAlignText,
        zIndex: redrawZIndex,
        overflow: redrawOverflow,
        textDecoration: redrawTextDecoration,
        rotate: redrawRotate,
    };
};

/**
 * Уникальнгый id для каждогого дома, иногда нужна уникальность дома, для таймаутов например.
 * @type {number}
 */
GUIDom.lastId = 0;