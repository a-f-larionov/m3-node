/**
 * Подключаем nodeJS модули.
 */
let WEBSOCKET = require('websocket');
let HTTP = require('http');
let URL = require('url');

/**
 * Компонент обслуживающий соединения на сервере.
 * А так же возвращающий клиентский код.
 * @constructor
 */
WebSocketServer = function () {
    let self = this;

    let map = {};

    let lastConnectionId = null;

    /**
     * Порт для прослушки.
     * @type {int};
     */
    let port = null;

    /**
     * Проверка перед запуском:
     * - проверим установлены ли каллбэки пользовательским кодом;
     * - проверим настройки: port
     */
    let checkBeforeRun = function () {
        if (typeof self.onConnect != 'function') {
            Logs.log("onConnect must be function", Logs.LEVEL_FATAL_ERROR, self.onConnect);
        }
        if (typeof self.onDisconnect != 'function') {
            Logs.log("onDisconnect must be function", Logs.LEVEL_FATAL_ERROR, self.onDisconnect);
        }
        if (typeof self.onData != 'function') {
            Logs.log("onData must be function", Logs.LEVEL_FATAL_ERROR, self.onData);
        }
        if (typeof port != 'number') {
            Logs.log("port given by .setup, must be number", Logs.LEVEL_FATAL_ERROR, port);
        }
    };

    /**
     * Путь откуда загружать картинки.
     * @type {string}
     */
    let imagesPath = null;

    /**
     * Каллбэек будет вызываться при коннекте.
     * @type function
     */
    this.onConnect = null;

    /**
     * Каллбэек будет вызываться при диконнекте.
     * @type function
     */
    this.onDisconnect = null;

    /**
     * Каллбэек будет вызываться при получении данных.
     */
    this.onData = null;

    /**
     * Set new map
     * @param newMap
     */
    this.setMap = function (newMap) {
        map = newMap;
    };

    /**
     * Отправляет данные клиенту.
     * @param data {String} данные для отправки, строка данных.
     * @param id {Number} id соединения
     */
    this.sendData = function (data, id) {
        if (!connectionStack[id]) {
            Logs.log("undefined connection:" + id + " with data:" + data, Logs.LEVEL_WARNING);
            return false;
        }
        connectionStack[id].sendUTF(data);
        return true;
    };

    /**
     * Последний id соединения.
     */
    let lastId = 0;

    /**
     * Стэк соединений.
     */
    let connectionStack = {};

    /**
     * Тут храниться HTTP сервер, nodeJS-модуль
     */
    let http;

    /**
     * Тут храниться WebSocket.server, nodeJS-модуль
     */
    let server;

    /**
     * Загружается клиентский код.
     * Создается севрер.
     * Инициируется прослушивание.
     */
    this.run = function (afterRunCallback) {
        port = Config.WebSocketServer.port;

        checkBeforeRun();

        /* создадим сервер */
        http = HTTP.createServer(onHTTPRequest);
        /* запустим прослушивание */
        http.listen(port);
        /* создадим websocket */

        server = new WEBSOCKET.server({
            httpServer: http
        });
        server.on('request', onWebSocketRequest);

        Logs.log("WebSocketServer running. port:" + port, Logs.LEVEL_NOTIFY);
        Logs.log("WebSocketServer inited.", Logs.LEVEL_NOTIFY);
        afterRunCallback();
    };

    /**
     * Обработчки запросов от HTTP сервера.
     * при любом другом запросе вернёт 404 ошибку.
     * @param request
     * @param response
     * @returns {boolean}
     */
    let onHTTPRequest = function (request, response) {
        let requestUrlParts;
        /** Запрашивается клинетский код? **/
        for (let path in map) {
            requestUrlParts = URL.parse(request.url, true);
            if (requestUrlParts.pathname === path) {
                map[path].call(null, function (answer) {
                    response.writeHead(200, {'Content-Type': 'text/html'});
                    response.end(answer);
                }, request);
                return true;
            }
        }
        /** Во всех других случаях ошибка 404 (Not found) **/
        response.writeHead(404, {'Content-Type': 'text/html'});
        response.end('File:`' + request.url + ' `not found.');
        return true;
    };

    /**
     * Обработчик запросов от WebSocket-а
     * Собственно это запросы на соединение.
     */
    let onWebSocketRequest = function (request) {
        let connection, id;
        connection = request.accept(null, request.origin);
        id = ++lastId;
        connectionStack[id] = connection;
        Logs.log("WebSocketServer.onConnected: id=" + id, Logs.LEVEL_DETAIL);
        self.onConnect(id);
        connection.on('message', function (message) {
            if (message.type == 'utf8') {
                /* Logs.log("Получены данные.", Logs.LEVEL_DETAIL, message.utf8Data); */
                lastConnectionId = id;
                self.onData(message.utf8Data, id);
            }
        });
        connection.on('close', function () {
            Logs.log("WebSocketServer.onDisconnected: id=" + id);
            delete connectionStack[id];
            self.onDisconnect(id);
        });
    };
};

WebSocketServer = new WebSocketServer;

WebSocketServer.depends = ['Logs', 'Profiler', 'DB', 'Statistic', 'SocNet'];