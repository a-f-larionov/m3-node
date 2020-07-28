/**
 * Адаптация для работы с гуёй. В данном случае это canvas.
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
let GUIDomCanvas = function () {
    let self = this;

    this.__id = ++GUIDom.lastId;

    this.isNeedRedraw = false;

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

        if (!parent) parent = GUI.getCurrentParent();
        parent.appendChild(this);

        /** Начальное значение старых свойств */
        for (let i in props) {
            oldProps[i] = undefined;
        }

        this.fontSize = 24;

        /** Создадим дом */
        //dom = {};
        //dom = document.createElement(tagName);
        /** Значения по умолчанию для дом-ов. */
        //dom.className = 'gui-dom';
        /** Does not dragable by default */
        /*dom.ondragstart = function () {
            return false;
        };*/

        /** Добавим дом к родителю. */
        //this.__dom = dom;
        //dom.__dom = this;
    };

    this.childs = [];

    this.appendChild = function (gdom) {
        this.childs.push(gdom);
        gdom.__parent = this;
    };

    /**
     * Покажем дом.
     */
    this.show = function () {
        if (showed) return;
        showed = true;
        self.redraw();
    };

    /**
     * Спрячем дом.
     */
    this.hide = function () {
        if (!showed) return;
        showed = false;
    };

    /**
     * Перересовка дома.
     * Только те свойства, которые изменились.
     */
    this.redraw = function () {
        if (!showed) return;

        if (!self.isNeedRedraw) self.isNeedRedraw = false;
        for (let name in props) {
            if (oldProps[name] !== self[name]) {
                //props[name].call();
                self.isNeedRedraw = true;
                oldProps[name] = self[name];
            }
        }
    };

    this.isShowed = function (log) {
        return showed && self.__parent.isShowed(log);
    };

    this.draw = function () {
        let dpr;
        GUI.dpr = dpr = window.devicePixelRatio;
        let cntx = GUI.canvasCntx;

        if (!self.isShowed(self.text === 'КУПИТЬ')) return;

        cntx.globalAlpha = self.opacity ? self.opacity : 1.0;

        let drawBorders = function (fill) {
            cntx.lineWidth = self.borderWidth * dpr;
            cntx.strokeStyle = self.borderColor;
            if (self.borderRadius) {
                roundRect(cntx,
                    self.getX() - self.borderWidth,
                    self.getY() - self.borderWidth,
                    self.width * dpr + self.borderWidth * 2,
                    self.height * dpr + self.borderWidth * 2,
                    self.borderRadius * dpr, fill ? self.background : undefined
                )
            } else {
                cntx.fillRect(
                    self.getY(), self.getY(),
                    self.width * dpr, self.height * dpr
                );
            }
        };

        if (self.borderWidth && self.background) {
            drawBorders(true)
        }

        if (self.background) {
            cntx.fillStyle = self.background;
            cntx.fillRect(self.getX(), self.getY(),
                self.width * dpr, self.height * dpr
            );
        }

        if (self.backgroundImage) {
            Images.getImage(    self.backgroundImage, function (img, meta) {
                if (meta.w && meta.h) {
                    cntx.drawImage(img,
                        meta.x * dpr, meta.y * dpr,
                        meta.w * dpr - 0.5, meta.h * dpr,
                        self.getX(), self.getY(),
                        (self.width ? self.width : meta.w) * dpr - 0.5,
                        (self.height ? self.height : meta.h) * dpr);
                } else {
                    cntx.drawImage(img,
                        self.getX(), self.getY(),
                        self.width * dpr - 0.5, self.height * dpr);
                }
            });
        }

        if (self.borderWidth) {
            drawBorders(false)
        }

        if (self.text) {

            //dom.textDecoration = self.textDecoration;

            cntx.fillStyle = self.color;
            if (self.alignText) cntx.textAlign = self.alignText;

            cntx.font =
                (self.fontWeight ? (self.fontWeight + ' ') : '') +
                (self.fontSize * GUI.dpr) + 'px ' +
                self.fontFamily;

            cntx.fillText(self.text,
                self.getX() + self.width + (self.alignText === 'right' ? self.width : 0),
                self.getY() + (self.height ? self.height + 6 : self.fontSize * GUI.dpr)
            );
        }

        //GUI.canvasCntx.globalAlpha = 1.0;
        /*cntx.lineWidth = 1;
        cntx.strokeStyle = 'red';
        cntx.strokeRect(
            self.getX(), self.getY(),
            self.width * dpr, self.height * dpr
        );
         */
    };

    let roundRect = function (ctx, x, y, width, height, radius, fill, stroke) {
        if (typeof stroke === 'undefined') {
            stroke = true;
        }
        if (typeof radius === 'undefined') {
            radius = 5;
        }
        if (typeof radius === 'number') {
            radius = {tl: radius, tr: radius, br: radius, bl: radius};
        } else {
            var defaultRadius = {tl: 0, tr: 0, br: 0, bl: 0};
            for (var side in defaultRadius) {
                radius[side] = radius[side] || defaultRadius[side];
            }
        }
        ctx.beginPath();
        ctx.moveTo(x + radius.tl, y);
        ctx.lineTo(x + width - radius.tr, y);
        ctx.quadraticCurveTo(x + width, y, x + width, y + radius.tr);
        ctx.lineTo(x + width, y + height - radius.br);
        ctx.quadraticCurveTo(x + width, y + height, x + width - radius.br, y + height);
        ctx.lineTo(x + radius.bl, y + height);
        ctx.quadraticCurveTo(x, y + height, x, y + height - radius.bl);
        ctx.lineTo(x, y + radius.tl);
        ctx.quadraticCurveTo(x, y, x + radius.tl, y);
        ctx.closePath();
        if (fill) {
            ctx.fill();
        }
        if (stroke) {
            ctx.stroke();
        }
    };


    this.getX = function () {
        return self.x * GUI.dpr + self.__parent.getX();
    };

    this.getY = function () {
        return self.y * GUI.dpr + self.__parent.getY();
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
        //@todo
        return;
        /**
         * HOW TO?
         * ADD CALLBACK ON EVENT
         * GUIEvents.addEventListener(eventName,
         *
         */
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

    let f = function () {
    };

    /** Далее идут методы перерисовки. */
    let redrawWidth = function () {
        //dom.style.width = self.width + 'px';
        // if (self.backgroundImage) redrawBackgroundImage();
    };
    let redrawHeight = function () {
        // dom.style.height = (!isNaN(self.visibleHeight) ? self.visibleHeight : self.height) + 'px';

        // if (self.backgroundImage) redrawBackgroundImage();
    };
    let redrawBackgroundImage = function () {
        return;
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
        //dom.style.backgroundSize = self.backgroundSize + 'px';
    };
    let redrawPointer = function () {
        //dom.style.cursor = self.pointer;
    };
    let redrawColor = function () {
        //dom.style.color = self.color;
    };
    let redrawTextShadow = function () {
        //dom.style.textShadow = self.textShadow;
    };
    let redrawBorderRadius = function () {
        //dom.style.borderRadius = self.borderRadius;
    };
    let redrawBorder = function () {
        //dom.style.border = self.border;
    };
    let redrawBorderTop = function () {
        //dom.style.borderTop = self.borderTop;
    };
    let redrawBorderRight = function () {
        //dom.style.borderRight = self.borderRight;
    };
    let redrawBorderBottom = function () {
        //dom.style.borderBottom = self.borderBottom;
    };
    let redrawBorderLeft = function () {
        //dom.style.borderLeft = self.borderLeft;
    };
    let redrawPadding = function () {
        //dom.style.padding = self.padding;
    };
    let redrawBoxShadow = function () {
        //dom.style.boxShadow = self.boxShadow;
    };
    let redrawLineHeight = function () {
        //dom.style.lineHeight = self.lineHeight;
    };
    let redrawBackground = function () {
        //dom.style.background = self.background;
    };
    let redrawTransform = function () {
        //dom.style.transform = self.transform;
    };
    let redrawTitle = function () {
        //dom.setAttribute('title', self.title);
    };
    let redrawZIndex = function () {
        //dom.style.zIndex = self.zIndex;
    };
    let redrawOverflow = function () {
        //dom.style.overflow = self.overflow;
    };
    let redrawTextDecoration = function () {
        //dom.style.textDecoration = self.textDecoration;
    };
    let redrawRotate = function () {
        //dom.style.transform = 'rotate(' + self.rotate + 'deg)';
    };

    /**
     * Имена свойств и их методы обработки.
     * @type {{x: Function, y: Function, width: Function, height: Function, backgroundImage: *, innerHTML: Function, pointer: Function, opacity: Function, fontWeight: *, fontSize: *, fontFamily: Function, color: Function, textShadow: Function, borderRadius: Function, border: Function, borderTop: Function, borderRight: Function, borderBottom: Function, borderLeft: Function, padding: Function, boxShadow: Function, lineHeight: Function, background: Function, transform: Function, title: *}}
     */
    let props = {
        x: f,
        y: f,
        width: redrawWidth,
        height: redrawHeight,
        visibleHeight: redrawHeight,
        backgroundPositionY: redrawBackgroundImage,
        backgroundImage: redrawBackgroundImage,
        backgroundSize: redrawBackgroundSize,
        innerHTML: f,
        pointer: redrawPointer,
        opacity: f,
        fontWeight: f,
        fontSize: f,
        fontFamily: f,
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
        alignText: f,
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