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
 */
GUIDom = function () {
    var self = this;

    this.__id = ++GUIDom.lastId;

    /**
     * Старые свойства.
     * Их мы будем хранить, что бы не перерисовывать лишний раз,
     * то что не меняется.
     * @type {{}}
     */
    var oldProps = {};

    /**
     * Показывтаь ли дом.
     * @type {boolean}
     */
    var showed = false;

    /**
     * Дом браузера.
     * @type {Element}
     */
    var dom = null;

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
        /* Начальное значение старых свойств */
        for (var i in props) {
            oldProps[i] = undefined;
        }
        if (!tagName) {
            tagName = 'div';
        }
        /* Создадим дом */
        dom = document.createElement(tagName);
        /* значения по умолчанию для дом-ов. */
        dom.style.position = 'absolute';
        dom.style.overflow = 'hidden';
        if (tagName === 'input') {
            dom.style.border = 'none';
        }
        /* no dragable by default */
        dom.ondragstart = function () {
            return false;
        };
        /* hidden mode..:begin */
        //@todo remove hidePictures
        if (GUIDom.hidePictures) {
            document.body.style.opacity = 0.01;
            dom.style.border = '1px dotted grey';
        }
        /* Указанная прозрачность картинок. */
        if (GUIDom.pictureOpacities) {
            document.body.style.opacity = GUIDom.pictureOpacities;
            dom.style.border = '2px solid lightgrey';
        }
        /* hidden mode..:finish */
        /* Добавим дом к родителю. */
        this.__dom = dom;
        if (parent == undefined) {
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
        if (showed == true) {
            return;
        }
        showed = true;
        dom.style.display = 'block';
        self.redraw();
    };

    /**
     * Спрячем дом.
     */
    this.hide = function () {
        if (showed == false) {
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
        for (var name in props) {
            if (oldProps[name] != self[name]) {
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
    var animateNowId = null;

    /**
     * Аргументы переданные при запуске анимации.
     * @type {Array}
     */
    var animateArguments = [];

    /**
     * тайм-аут для анимации.
     * @type {null}
     */
    var animateTimeout = null;

    var ANIMATE_NOW_OPACITY_UP = 1;
    var ANIMATE_NOW_OPACITY_DOWN = 2;

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
        var direction;

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

    var animateNow = function () {
        switch (animateNowId) {
            case ANIMATE_NOW_OPACITY_UP:
                animateOpacityUp.apply(this, animateArguments);
                break;
            case ANIMATE_NOW_OPACITY_DOWN:
                animateOpacityDown.apply(this, animateArguments);
                break;
            default:
                /* останавливаем анимацию. */
                return;
                break;
        }

        setTimeout(function () {
            animateNow();
            self.redraw();
        }, animateTimeout);
    };

    var animateOpacityUp = function (target, from, step) {
        if (self.opacity < target) {
            self.opacity += step;
        } else {
            self.opacity = target;
            animateNowId = null;
        }
    };

    var animateOpacityDown = function (target, from, step) {
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
        var eventName;
        eventName = GUI.eventNames[eventId];
        if (!eventName) {
            Logs.log("undefined gui eventId:" + eventId, Logs.LEVEL_FATAL_ERROR);
        }
        dom.addEventListener(eventName, function (event) {
            callback.call(context, event, dom);
        }, false);
    };

    this.setFocus = function () {
        dom.focus();
    };

    /* Далее идут методы перерисовки. */
    var redrawX = function () {
        dom.style.left = self.x + 'px';
    };
    var redrawY = function () {
        dom.style.top = self.y + 'px';
    };
    var redrawWidth = function () {
        dom.style.width = self.width + 'px';
    };
    var redrawHeight = function () {
        dom.style.height = self.height + 'px';
    };
    var redrawBackgroundImage = function () {
        var url;
        /* Если размер не задан, пробуем задать его автоматически. */
        if (!self.width && !self.height && GUI.getImagePath(self.backgroundImage)) {
            self.width = GUI.getImageWidth(self.backgroundImage);
            self.height = GUI.getImageHeight(self.backgroundImage);
            props.height.call();
            props.width.call();
        }
        url = GUI.getImagePath(self.backgroundImage);

        if (GUIDom.hidePictures) {
            if (GUIDom.makeTransparent) {
                dom.style.backgroundImage = 'url(' + url + ')';
            } else {
                dom.style.fontSize = '10px';
                url = url.replace('/images/', '');
                dom.innerHTML = url.substr(url.indexOf('/') + 1, url.indexOf('.') - url.indexOf('/') - 1);
            }
        } else {
            dom.style.backgroundImage = 'url(' + url + ')';

            dom.style.backgroundPositionX = '-' + GUI.getImageX(self.backgroundImage) + 'px';
            dom.style.backgroundPositionY = '-' + GUI.getImageY(self.backgroundImage) + 'px';
            dom.style.backgroundRepeat = 'no-repeat';

        }
    };
    var redrawBackgroundSize = function () {
        dom.style.backgroundSize = self.backgroundSize + 'px';
    };
    var redrawInnerHTML = function () {
        if (GUIDom.hidePictures) {
            dom.innerHTML = self.innerHTML;
        } else {
            dom.innerHTML = self.innerHTML;
        }
    };
    var redrawPointer = function () {
        dom.style.cursor = self.pointer;
    };
    var redrawOpacity = function () {
        dom.style.opacity = self.opacity;
    };
    var redrawFontWeight = function () {
        dom.style.fontWeight = self.fontWeight;
    };
    var redrawFontSize = function () {
        dom.style.fontSize = self.fontSize;
    };
    var redrawFontFamily = function () {
        dom.style.fontFamily = self.fontFamily;
    };
    var redrawColor = function () {
        dom.style.color = self.color;
    };
    var redrawTextShadow = function () {
        dom.style.textShadow = self.textShadow;
    };
    var redrawBorderRadius = function () {
        dom.style.borderRadius = self.borderRadius;
    };
    var redrawBorder = function () {
        dom.style.border = self.border;
    };
    var redrawBorderTop = function () {
        dom.style.borderTop = self.borderTop;
    };
    var redrawBorderRight = function () {
        dom.style.borderRight = self.borderRight;
    };
    var redrawBorderBottom = function () {
        dom.style.borderBottom = self.borderBottom;
    };
    var redrawBorderLeft = function () {
        dom.style.borderLeft = self.borderLeft;
    };
    var redrawPadding = function () {
        dom.style.padding = self.padding;
    };
    var redrawBoxShadow = function () {
        dom.style.boxShadow = self.boxShadow;
    };
    var redrawLineHeight = function () {
        dom.style.lineHeight = self.lineHeight;
    };
    var redrawBackground = function () {
        dom.style.background = self.background;
    };
    var redrawTransform = function () {
        dom.style.transform = self.transform;
    };
    var redrawTitle = function () {
        dom.setAttribute('title', self.title);
    };
    var redrawIsItSepia = function () {
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
    var redrawAlignText = function () {
        dom.style.textAlign = self.alignText;
    };
    var redrawZIndex = function () {
        dom.style.zIndex = self.zIndex;
    };
    var redrawOverflow = function () {
        dom.style.overflow = self.overflow;
    };
    var redrawTextDecoration = function () {
        dom.style.textDecoration = self.textDecoration;
    };

    /**
     * Имена свойств и их методы обработки.
     * @type {{x: Function, y: Function, width: Function, height: Function, backgroundImage: *, innerHTML: Function, pointer: Function, opacity: Function, fontWeight: *, fontSize: *, fontFamily: Function, color: Function, textShadow: Function, borderRadius: Function, border: Function, borderTop: Function, borderRight: Function, borderBottom: Function, borderLeft: Function, padding: Function, boxShadow: Function, lineHeight: Function, background: Function, transform: Function, title: *}}
     */
    var props = {
        x: redrawX,
        y: redrawY,
        width: redrawWidth,
        height: redrawHeight,
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
        textDecoration: redrawTextDecoration
    };

    /**
     * Animate
     */
    this.animate = function () {
        if (!self.animPlayed) {
            return;
        }
        for (var t in self.animTracks) {
            self.proccessTrack(t);
        }
    };

    this.proccessTrack = function (tN) {
        var frame;
        frame = self.animTracks[tN][self.animData[tN].frameN];
        switch (frame.type) {
            case ElementSprite.ANIM_TYPE_ROTATE:
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
                if (frame.imageN == frame.images.length) {
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
                break;
        }
        self.animData[tN].counter++;
        // if counter > duration => frameN++
        if (frame.duration && self.animData[tN].counter > frame.duration) {
            self.animData[tN].frameN++;
            self.animData[tN].counter = 0;
        }
    };
};

/**
 * Этот код определит нужно ли делать картинки невидимыми.
 * Это нужно для БоссМоуда на саммом деле :)
 * В результате мы установим GUIDom.hidePictures = [true|false].
 */
(function () {
    /* Распарсим по быстром url адрес. */
    var urlParams;
    (function () {
        var tmp1, tmp2;
        urlParams = {};
        url = window.location.href;
        tmp1 = url.substr(url.indexOf('?') + 1).split('&');
        for (var i in tmp1) {
            tmp = tmp1[i].split('=');
            urlParams[tmp[0]] = tmp[1];
        }
    })();
    /* Режим скрытых картинок */
    if (urlParams.hide_pictures && urlParams.hide_pictures == 'true') {
        GUIDom.hidePictures = true;
    } else {
        GUIDom.hidePictures = false;
    }
    if (urlParams.picture_opacities) {
        GUIDom.pictureOpacities = urlParams.picture_opacities;
    }
})();

/**
 * Уникальнгый id для каждогого дома, иногда нужна уникальность дома, для таймаутов например.
 * @type {number}
 */
GUIDom.lastId = 0;