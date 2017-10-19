/**
 * Адаптация для работы с гуёй. В данном случае это браузер.
 * Все запросы к гуи должны быть реализованы тут. и тут: GUIDom
 * @constructor
 */
GUI = function () {

    /**
     * Событие нажатия мышы(левой), но не отпускания.
     * @type {number}
     */
    this.EVENT_MOUSE_MOUSE_DOWN = 1;

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
     * Событие попадания курсора мыши в фокус
     * @type {number}
     */
    this.EVENT_MOUSE_OVER = 4;

    /**
     * Событие ухода курсора мыши из фокуса.
     * @type {number}
     */
    this.EVENT_MOUSE_OUT = 5;

    /**
     * Событие опускание клавиши.
     * @type {number}
     */
    this.EVENT_KEY_DOWN = 6;

    /**
     * Событие отпускания клавиши.
     * @type {number}
     */
    this.EVENT_KEY_UP = 7;

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

    this.eventNames = [];
    this.eventNames[this.EVENT_MOUSE_MOUSE_DOWN] = 'mousedown';
    this.eventNames[this.EVENT_MOUSE_MOUSE_UP] = 'mouseup';
    this.eventNames[this.EVENT_MOUSE_CLICK] = 'click';
    this.eventNames[this.EVENT_MOUSE_OVER] = 'mouseover';
    this.eventNames[this.EVENT_MOUSE_OUT] = 'mouseout';
    this.eventNames[this.EVENT_KEY_DOWN] = 'keydown';
    this.eventNames[this.EVENT_KEY_UP] = 'keyup';

    /**
     * Стэк родителей.
     * На верхуши стэка находиться элемент в который будет добавлены новые элементы.
     * @type {Array}
     */
    var parentsStack = [];

    /**
     * Инициализация.
     * - установим родителя, это будет тело документа.
     */
    this.init = function () {
        parentsStack.push(document.getElementById('applicationArea'));
        var style = document.createElement('style');
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
        style.innerHTML += '* {' +
            '-webkit-touch-callout: none;' +
            '-webkit-user-select: none;' +
            '-khtml-user-select: none;' +
            '-moz-user-select: none;' +
            '-ms-user-select: none;' +
            'user-select: none;' +
            '}';
        document.getElementsByTagName('head')[0].appendChild(style);
    };

    /**
     * Создаёт элемент
     * @param name {string} имя элемента Element*
     * @param params {object} параметры присваиваемые при создании элемента.
     * @param [parentDom] {GUIDom} необязательный параметр, родительский дом, который будет использован в пределах инициализации элемента.
     * @returns {__ElementName__}
     */
    this.createElement = function (name, params, parentDom) {
        var element;
        if (!name) {
            Logs.log("GUI.createElement: не определен элемент:" + name, Logs.LEVEL_FATAL_ERROR);
        }
        element = new name;
        if (!element.init || typeof element.init != 'function') {
            Logs.log("GUI.craeteElement: элемент должен иметь функцию init().", Logs.LEVEL_FATAL_ERROR, arguments);
        }
        if (!element.show || typeof element.show != 'function') {
            Logs.log("GUI.craeteElement: элемент должен иметь функцию show().", Logs.LEVEL_FATAL_ERROR, arguments);
        }
        if (!element.hide || typeof element.hide != 'function') {
            Logs.log("GUI.craeteElement: элемент должен иметь функцию hide().", Logs.LEVEL_FATAL_ERROR, arguments);
        }
        if (!element.redraw || typeof element.redraw != 'function') {
            Logs.log("GUI.craeteElement: элемент должен иметь функцию redraw().", Logs.LEVEL_FATAL_ERROR, arguments);
        }
        for (var i in params) {
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
     * @param parent {GUIDom} родитель, в который будет добавлен дом.
     * @param params {Object} параметры присваиваемые дому, нпример: {x: 123, y: 345}.
     * @returns {GUIDom}
     */
    this.createDom = function (parent, params) {
        var dom;
        dom = new GUIDom(parent);
        dom.init(undefined, parent);
        if (params) {
            for (var name in params) {
                dom[name] = params[name];
            }
        }
        return dom;
    };

    /**
     * Создаёт дом инпута, иницализирует его и возврщает на него ссыслку.
     * @param parent {GUIDom} родитель, в который будет добавлен дом.
     * @returns {GUIDom}
     */
    this.createInput = function (parent, params) {
        var dom;
        dom = new GUIDom();
        dom.init('input', parent);
        if (params) {
            for (var name in params) {
                dom[name] = params[name];
            }
        }
        return dom;
    };

    this.createCanvas = function (parent, params) {
        var dom;
        dom = new GUIDom();
        dom.init('canvas', parent);
        if (params) {
            for (var name in params) {
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
     * @param context {Object}
     */
    this.bind = function (dom, eventId, callback, context) {
        dom.bind(eventId, callback, context);
    };

    /**
     * Заранее загруженные картинки, но с timestamp-ом.
     * timestamp вставлять везде сложно, проще сделать это в одном месте.
     * @param url
     * @returns {*}
     */
    this.getImagePath = function (url) {
        return this.getImageMetaData(url).path;
    };

    this.getImageHeight = function (url) {
        return this.getImageMetaData(url).h;
    };

    this.getImageWidth = function (url) {
        return this.getImageMetaData(url).w;
    };

    this.getImageX = function (url) {
        return this.getImageMetaData(url).x;
    };

    this.getImageY = function (url) {
        return this.getImageMetaData(url).y;
    };

    /**
     * Return image meta data
     * @param url
     * @returns {{path: string, w: number, h: number}}
     */
    this.getImageMetaData = function (url) {
        /* абсолютный url, используем без изменений, т.к. это внешний url */
        if (url.indexOf('https://') == 0 || url.indexOf('http://') == 0) {
            return {
                path: url,
                w: undefined,
                h: undefined,
                x: 0,
                y: 0
            }
        }
        if (!window.imagesData[url]) {
            Logs.log("Image url not found for: " + url, Logs.LEVEL_ERROR);
            return {
                path: '/images/notFound.png',
                w: undefined,
                h: undefined
            }
        }
        return window.imagesData[url];
    };
};

/**
 * Статичный "класс".
 * @type {GUI}
 */
GUI = new GUI();