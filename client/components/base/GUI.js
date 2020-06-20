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
    let wizardArea = false;

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

    let tagId = null;

    /**
     * Инициализация.
     * - установим родителя, это будет тело документа.
     */
    this.init = function () {
        GUI.appArea = document.getElementById('appArea');
        wizardArea = document.getElementById('wizardArea');
        parentsStack.push(GUI.appArea);
        let style = document.createElement('style');
        style.type = 'text/css';
        style.innerHTML = '.sepia { ' +
            'filter: url("data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\'><filter id=\'old-timey\'><feColorMatrix type=\'matrix\' values=\'0.14 0.45 0.05 0 0 0.12 0.39 0.04 0 0 0.08 0.28 0.03 0 0 0 0 0 1 0\'/></filter></svg>#old-timey");' +
            '-webkit-filter: sepia(0.5);' +
            '-webkit-filter: sepia(85%) grayscale(50%);' +
            '-moz-filter: sepia(70%);' +
            '-ms-filter: sepia(70%);' +
            '-o-filter: sepia(70%);' +
            'filter: sepia(70%);' +
            '}';
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
                wizardArea.style.left = (screen.availWidth / 2 - parseInt(GUI.appArea.style.width) / 2) + 'px';
                wizardArea.style.top = (screen.availHeight / 2 - parseInt(GUI.appArea.style.height) / 2) + 'px';
            } else {
                if (vkWidgets) vkWidgets.style.display = '';
                GUI.appArea.style.left = '';
                GUI.appArea.style.top = '';
                wizardArea.style.left = '';
                wizardArea.style.top = '';
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
        return parentsStack.push(parentDom.__dom);
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
        dom = new GUIDom();
        dom.init(undefined, parent);
        if (tagId) dom.__dom.tagId = tagId;
        if (params) {
            for (let name in params) {
                dom[name] = params[name];
            }
        }
        return dom;
    };

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

    this.setTagId = function (id) {
        tagId = id;
    };
};

/**
 * Статичный "класс".
 * @type {GUI}
 */
GUI = new GUI();
