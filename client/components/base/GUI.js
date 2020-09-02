/**
 * Адаптация для работы с гуёй. В данном случае это браузер.
 * Все запросы к гуи должны быть реализованы тут. и тут: GUIDom
 * @constructor
 * @type {GUI}
 */
let GUI = function () {
    let self = this;

    let isFSMode = false;

    this.appArea = false;
    this.wizardArea = false;
    this.canvasArea = false;
    this.fsFrame = false;

    /** @type {CanvasRenderingContext2D} */
    this.canvasCntx = null;

    /**
     * Событие нажатия мышы(левой), но не отпускания.
     * @type {number}
     */
    this.EVENT_MOUSE_MOUSE_DOWN = 1;

    this.EVENT_MOUSE_MOUSE_TOUCH_START = 100;

    this.EVENT_MOUSE_MOUSE_TOUCH_END = 101;

    /**
     * Событияе отпускания нажатой мыши(левой).
     * @type {number}
     */
    this.EVENT_MOUSE_MOUSE_UP = 2;

    /**
     * Событие нажатие мышкой(левой)
     * @type {number}
     */
    this.EVENT_MOUSE_CLICK = 3;

    /**
     * Событие движения мышы
     * @type {number}
     */
    this.EVENT_MOUSE_MOVE = 4;

    /**
     * Событие попадания курсора мыши в фокус
     * @type {number}
     */
    this.EVENT_MOUSE_OVER = 5;

    /**
     * Событие ухода курсора мыши из фокуса.
     * @type {number}
     */
    this.EVENT_MOUSE_OUT = 6;

    /**
     * Событие опускание клавиши.
     * @type {number}
     */
    this.EVENT_KEY_DOWN = 100;

    /**
     * Событие отпускания клавиши.
     * @type {number}
     */
    this.EVENT_KEY_UP = 101;

    /**
     * Указатель мыши: "Рука".
     * @type {string}
     */
    this.POINTER_HAND = 'pointer';
    /**
     * Указатель мыши: "Стандатрная стрелка".
     * @type {string}
     */
    this.POINTER_ARROW = 'default';

    this.POINTER_NONE = 'none';

    this.eventNames = [];
    this.eventNames[this.EVENT_MOUSE_MOUSE_DOWN] = 'mousedown';
    this.eventNames[this.EVENT_MOUSE_MOUSE_UP] = 'mouseup';
    this.eventNames[this.EVENT_MOUSE_CLICK] = 'click';
    this.eventNames[this.EVENT_MOUSE_OVER] = 'mouseover';
    this.eventNames[this.EVENT_MOUSE_MOVE] = 'mousemove';
    this.eventNames[this.EVENT_MOUSE_OUT] = 'mouseout';
    this.eventNames[this.EVENT_KEY_DOWN] = 'keydown';
    this.eventNames[this.EVENT_KEY_UP] = 'keyup';
    this.eventNames[this.EVENT_MOUSE_MOUSE_TOUCH_START] = 'touchstart';
    this.eventNames[this.EVENT_MOUSE_MOUSE_TOUCH_END] = 'touchend';

    let mouseMoveStack = [];

    /**
     * Стэк родителей.
     * На верхуши стэка находиться элемент в который будет добавлены новые элементы.
     * @type {Array}
     */
    let parentsStack = [];

    this.lockEventsExcept = null;

    let canvasParent = {
        x: 0, y: 0,
        childs: [],
        appendChild: function (gdom) {
            this.childs.push(gdom);
            gdom.__parent = this;
        }, isShowed: function () {
            return true;
        }, calcX: function () {
            return this.x;
        }, calcY: function () {
            return this.y;
        }, calcOpacity: function () {
            return 1.0;
        }
    };

    this.initCanvas = function () {

        parentsStack.push(canvasParent);
        GUI.canvasArea = document.getElementById('canvasArea');
        GUI.canvasArea.width = DataCross.app.width * window.devicePixelRatio;
        GUI.canvasArea.height = DataCross.app.height * window.devicePixelRatio;

        GUI.canvasCntx = GUI.canvasArea.getContext('2d');

        GUI.canvasArea.addEventListener('mousemove', function (e) {
            self.canvasEvents(e, GUI.EVENT_MOUSE_MOVE)
        });
        GUI.canvasArea.addEventListener('click', function (e) {
            self.canvasEvents(e, GUI.EVENT_MOUSE_CLICK)
        });

        setTimeout(GUI.redrawFrame, 3000);
    };

    this.canvasPointerDoms = [];

    this.canvasEvents = function (e, eventId) {
        /**
         * mouse out/over
         * if( intersect && !el.mouseIn){
         *
         * }
         * if( !intersect && el.mouseIN
         */
        let intersect;

        let els = [];

        eventBinds[eventId].forEach(function (el) {
            intersect = eventIntersectEl(e, el);

            if (intersect && GUI.lockEventsExcept) {
                let dom, skip;
                dom = el.dom;
                skip = true;
                while (dom) {
                    if (GUI.lockEventsExcept === dom) {
                        skip = false;
                    }
                    dom = dom.__parent;
                }
                if (skip) return;
            }

            if (intersect) els.push(el);
        });

        if (els.length > 1) {
            els.sort(function (l, r) {
                return l.dom.__id < r.dom.__id ? -1 : 1;
            });
            els.sort(function (l, r) {
                return l.dom.zIndex < r.dom.zIndex ? -1 : 1;
            });
            els.reverse();
        }
        let doEvent = function (index) {
            let res;
            res = false;
            if (els[index]) res = els[index].callback.call(els[index].context, e, els[index].dom);
            if (res) doEvent(++index);
        };
        doEvent(0);

        if (eventId === GUI.EVENT_MOUSE_MOVE) {

            let pointer = GUI.POINTER_ARROW;
            self.canvasPointerDoms.forEach(function (dom) {
                if (eventIntersectEl(e, {dom: dom})) {
                    pointer = dom.pointer;
                }
            });


            GUI.canvasArea.style.cursor = pointer;

            eventBinds[GUI.EVENT_MOUSE_OUT].forEach(function (el) {
                intersect = eventIntersectEl(e, el);

                if (!intersect && el.dom.__mouseIn) {
                    el.dom.__mouseIn = false;
                    el.callback.call(el.context, e, el.dom);
                    //GUI.canvasArea.style.cursor = 'none';
                }
            });

            eventBinds[GUI.EVENT_MOUSE_OVER].forEach(function (el) {
                intersect = eventIntersectEl(e, el);

                if (intersect && !el.dom.__mouseIn) {
                    el.dom.__mouseIn = true;
                    el.callback.call(el.context, e, el.dom);
                }
            });

        }
    };

    let eventIntersectEl = function (e, el) {
        return el.dom.isShowed() &&
            el.dom.calcX() < e.layerX * GUI.dpr &&
            el.dom.calcX() + el.dom.calcWidth() > e.layerX * GUI.dpr &&

            el.dom.calcY() < e.layerY * GUI.dpr &&
            el.dom.calcY() + el.dom.calcHeight() > e.layerY * GUI.dpr;
    };

    let eventBinds = {};

    this.canvasBind = function (eventId, callback, context, dom) {
        if (!eventBinds[eventId]) eventBinds[eventId] = [];
        eventBinds[eventId].push({dom: dom, callback: callback, context: context});
    };

    /**
     * Инициализация.
     * - установим родителя, это будет тело документа.
     */
    this.init = function () {
        GUI.appArea = document.getElementById('appArea');
        GUI.wizardArea = document.getElementById('wizardArea');
        GUI.fsFrame = document.createElement('div');
        window.document.body.appendChild(GUI.fsFrame);
        {
            GUI.fsFrame.style.position = 'absolute';
            GUI.fsFrame.style.zIndex = -1000;
            GUI.fsFrame.style.left = '-15px';
            GUI.fsFrame.style.top = '-15px';
            GUI.fsFrame.style.width = (Images.getMeta('fs-frame.png').w) + 'px';
            GUI.fsFrame.style.height = (Images.getMeta('fs-frame.png').h) + 'px';
            GUI.setImageToElement(GUI.fsFrame, 'fs-frame.png');
        }

        parentsStack.push(GUI.appArea);
        //@todo canvas
        if (Config.Project.canvas) {
            GUI.initCanvas();
        } else {
            parentsStack.push(GUI.appArea);
        }

        let style = document.createElement('style');
        style.type = 'text/css';
        style.innerHTML += '.gui-dom { ' +
            ' position: absolute;' +
            ' overflow: hidden' +
            '}';
        style.innerHTML += '* {' +
            '-webkit-touch-callout: none;' +
            '-webkit-user-select: none;' +
            '-khtml-user-select: none;' +
            '-moz-user-select: none;' +
            '-ms-user-select: none;' +
            'user-select: none;' +
            '}';
        document.getElementsByTagName('head')[0].appendChild(style);
        document.addEventListener('mousemove', function (event) {

            mouseMoveStack.forEach(function (callback) {
                callback.call(null, event.clientX - GUI.appArea.offsetLeft, event.clientY - GUI.appArea.offsetTop);
            })
        });

        fsBindEvent(function () {
            isFSMode = !isFSMode;
            updateFS();
        });

        this.fsSwitch = function () {
            updateFS(true);
            if (GUI.isFullScreen()) {
                fsExit();
            } else {
                fsRequest();
            }
        };

        let updateFS = function (before) {
            let vkWidgets;
            vkWidgets = document.getElementById('vk_comments');

            if ((before && !GUI.isFullScreen()) || (!before && GUI.isFullScreen())) {
                if (vkWidgets) vkWidgets.style.display = 'none';
                GUI.appArea.style.left = (screen.availWidth / 2 - parseInt(GUI.appArea.style.width) / 2) + 'px';
                GUI.appArea.style.top = (screen.availHeight / 2 - parseInt(GUI.appArea.style.height) / 2) + 'px';
                GUI.wizardArea.style.left = (screen.availWidth / 2 - parseInt(GUI.appArea.style.width) / 2) + 'px';
                GUI.wizardArea.style.top = (screen.availHeight / 2 - parseInt(GUI.appArea.style.height) / 2) + 'px';
                if (GUI.canvasArea) {
                    GUI.canvasArea.style.left = (screen.availWidth / 2 - parseInt(GUI.appArea.style.width) / 2) + 'px';
                    GUI.canvasArea.style.top = (screen.availHeight / 2 - parseInt(GUI.appArea.style.height) / 2) + 'px';
                }
                GUI.fsFrame.style.left = ((screen.availWidth / 2 - parseInt(GUI.appArea.style.width) / 2) - 15) + 'px';
                GUI.fsFrame.style.top = ((screen.availHeight / 2 - parseInt(GUI.appArea.style.height) / 2) - 15) + 'px';

            } else {
                if (vkWidgets) vkWidgets.style.display = '';
                GUI.appArea.style.left = '';
                GUI.appArea.style.top = '';
                GUI.wizardArea.style.left = '';
                GUI.wizardArea.style.top = '';
                if (GUI.canvasArea) {
                    GUI.canvasArea.style.left = '';
                    GUI.canvasArea.style.top = '';
                }
                GUI.fsFrame.style.left = '-15px';
                GUI.fsFrame.style.top = '-15px';
            }
        };

        let fsRequest = function () {
            let doc = window.document.body;
            if (doc.requestFullscreen) {
                doc.requestFullscreen();
            } else if (doc.mozRequestFullScreen) {
                doc.mozRequestFullScreen();
            } else if (doc.webkitRequestFullScreen) {
                doc.webkitRequestFullScreen();
            }
        };

        let fsExit = function () {
            if (window.document.exitFullscreen) {
                window.document.exitFullscreen();
            } else if (window.document.mozCancelFullScreen) {
                window.document.mozCancelFullScreen();
            } else if (window.document.webkitCancelFullScreen) {
                window.document.webkitCancelFullScreen();
            }
        };
        updateFS();
    };

    /**
     * Создаёт элемент
     * @param name {string} имя элемента Element*
     * @param [params] {object} параметры присваиваемые при создании элемента.
     * @param [parentDom] {GUIDom} необязательный параметр, родительский дом, который будет использован в пределах инициализации элемента.
     * @returns {Object}
     */
    this.createElement = function (name, params, parentDom) {
        let element;
        if (!params) {
            params = {};
        }
        if (!name) {
            Logs.log("GUI.createElement: не определен элемент:" + name, Logs.LEVEL_FATAL_ERROR);
        }
        element = new name;
        if (!element.init || typeof element.init != 'function') {
            Logs.log("GUI.craeteElement: элемент должен иметь функцию init().", Logs.LEVEL_FATAL_ERROR, arguments);
        }
        if (!element.show || typeof element.show != 'function') {
            Logs.log("GUI.createElement: элемент должен иметь функцию show().", Logs.LEVEL_FATAL_ERROR, arguments);
        }
        if (!element.hide || typeof element.hide != 'function') {
            Logs.log("GUI.createElement: элемент должен иметь функцию hide().", Logs.LEVEL_FATAL_ERROR, arguments);
        }
        if (!element.redraw || typeof element.redraw != 'function') {
            Logs.log("GUI.createElement: элемент должен иметь функцию redraw().", Logs.LEVEL_FATAL_ERROR, arguments);
        }
        for (let i in params) {
            element[i] = params[i];
        }
        if (parentDom) {
            GUI.pushParent(parentDom);
            element.init();
            GUI.popParent();
        } else {
            element.init();
        }

        return element;
    };

    /**
     * Добавляем на верхушку стэка - родителя.
     * @param parentDom {Element}
     * @return {Number} длина стэка родителей.
     */
    this.pushParent = function (parentDom) {
        return parentsStack.push(parentDom);
    };

    /**
     * Убираем с верхушки стэка дом родителя.
     * @returns {Element}
     */
    this.popParent = function () {
        return parentsStack.pop();
    };

    /**
     * Возвращает текущего родителя, т.е. с верхушки стэка.
     * @returns {Element}
     */
    this.getCurrentParent = function () {
        return parentsStack[parentsStack.length - 1];
    };

    /**
     * Создаёт дом, инициализирует его и возвращает на него ссылку.
     * @param [parent] {GUIDom} родитель, в который будет добавлен дом.
     * @param [params] {Object} параметры присваиваемые дому, нпример: {x: 123, y: 345}.
     * @returns {GUIDom}
     */
    this.createDom = function (parent, params) {
        let dom;

        if (Config.Project.canvas) {
            dom = new GUIDomCanvas();
        } else {
            dom = new GUIDom();
        }
        if (params) {
            for (let name in params) {
                dom[name] = params[name];
            }
        }
        dom.init(parent);
        return dom;
    };

    let lastFrameTime = null;

    this.redrawFrame = function () {
        GUI.dpr = window.devicePixelRatio;
        /*
        GUI.canvasCntx.clearRect(0, 0,
            DataCross.app.width * GUI.dpr,
            DataCross.app.height * GUI.dpr
        );
        */

        canvasParent.childs.sort(function (l, r) {
            return l.__id < r.__id ? -1 : 1;
        });
        canvasParent.childs.sort(function (l, r) {
            return l.zIndex < r.zIndex ? -1 : 1;
        });
        let drawLayers = function (layerDom) {
            layerDom.childs.forEach(function (dom) {
                dom.draw();
                if (dom.childs.length) {
                    drawLayers(dom);
                }
            });
        };

        drawLayers(canvasParent);
        // сколько млсек уходит на отрисовку
        if (lastFrameTime) {
            let t = (Date.now() - lastFrameTime);
            window.timer.push(t);
        }


        let currentFrameTime = Date.now();
        window.fpsList.push(1000 / (currentFrameTime - lastFrameTime));
        lastFrameTime = currentFrameTime;

        setTimeout(GUI.redrawFrame, 1);

        let text = null, sum;

        if (window.fpsList.length % 10 === 0) {
            sum = 0;
            for (let i = 0; i < window.fpsList.length; i++) sum += window.fpsList[i];
            text = Math.round(sum / window.fpsList.length * 10) / 10;

            if (window.fpsList.length > 300) window.fpsList = [];

            PageBlockBackground.fpsText.setText(text);
            PageBlockBackground.fpsText.redraw();
        }

    };
    window.timer = [];
    window.fpsList = [];

    /**
     * Првязываем событие к домЭлементы
     * @param dom {GUIDom} к кому привязываем событие.
     * @param eventId {int} id события GUIDom.EVENT_*
     * @param callback {function}
     * @param [context] {Object}
     */
    this.bind = function (dom, eventId, callback, context) {
        dom.bind(eventId, callback, context);
    };

    this.lockEvents = function (except) {
        self.lockEventsExcept = except;
    };

    this.unlockEvents = function () {
        self.lockEventsExcept = null;
    };

    this.onMouseMove = function (callback) {
        mouseMoveStack.push(callback);
    };

    let fsBindEvent = function (callback) {
        /* Standard syntax */
        document.addEventListener("fullscreenchange", callback);

        /* Firefox */
        document.addEventListener("mozfullscreenchange", callback);

        /* Chrome, Safari and Opera */
        document.addEventListener("webkitfullscreenchange", callback);

        /* IE / Edge */
        document.addEventListener("msfullscreenchange", callback);
    };

    this.isFullScreen = function () {
        return isFSMode;
    };

    this.setImageToElement = function (el, url, toWidth, toHeight) {
        let meta, backgroundImage;

        meta = Images.getMeta(url);

        backgroundImage = "url('" + meta.path + "')";

        if (window.useSprite) {
            let koefW, koefH;
            koefW = (toWidth ? toWidth : parseInt(el.style.width)) / meta.w;
            koefH = (toHeight ? toHeight : parseInt(el.style.height)) / meta.h;
            el.style.backgroundPositionX = '-' + meta.x * koefW + 'px';
            el.style.backgroundPositionY = '-' + meta.y * koefH + 'px';
            el.style.backgroundSize =
                (
                    window.spriteSize.width * koefW + 'px' +
                    ' ' +
                    window.spriteSize.height * koefH + 'px'
                );
        }
        el.style.backgroundImage = backgroundImage;
    }
};

/**
 * Статичный "класс".
 * @type {GUI}
 */
GUI = new GUI();
