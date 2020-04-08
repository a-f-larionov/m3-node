/**
 * Компонент обеспечивающий соединение с сервером.
 * @constructor
 */
WebSocketClient = function () {
    let self = this;

    /**
     * Хост сервера.
     * @type {string}
     */
    let host = null;

    /**
     * Порт сервера.
     * @type {int}
     */
    let port = null;

    /**
     * Протокол соединения.
     * ws|wss
     * @type {string}
     */
    let protocol = null;

    /**
     * id соединиения.
     * Если вдруг у нас несколько соединений.
     * @type {null}
     */
    let connectionId = null;

    let url;

    this.init = function (afterInitCallback) {
        //port = window.document.location.protocol == 'https:' ? 443 : 80;
        protocol = window.document.location.protocol == 'https:' ? 'wss' : 'ws';
        host = Config.WebSocketClient.host;
        port = Config.WebSocketClient.port;
        url = Config.WebSocketClient.url;
        afterInitCallback();
    };

    this.onData = null;
    this.onConnect = null;
    this.onDisconnect = null;

    /**
     * Сюда мы будем получать данные и отправлять их на сервер.
     * Примечание: Однако, если соединения с серверм нет, то мы будем просто добавлять их в буффер.
     * @param data string
     */
    this.sendData = function (data) {
        packetBuffer.push(data);
        trySend();
        return true;
    };

    /**
     * Просто выполним инициализацию.
     * Собсвтено подсоединимся к серверу.
     */
    this.run = function () {
        checkBeforeInit();
        init();
    };

    let checkBeforeInit = function () {
        if (typeof self.onConnect != 'function') {
            Logs.log("onConnect must be function", Logs.LEVEL_FATAL_ERROR, self.onConnect);
        }
        if (typeof self.onDisconnect != 'function') {
            Logs.log("onConnect must be function", Logs.LEVEL_FATAL_ERROR, self.onDisconnect);
        }
        if (typeof self.onData != 'function') {
            Logs.log("onConnect must be function", Logs.LEVEL_FATAL_ERROR, self.onData);
        }
    };

    /**
     * Состояние соединения:
     * true - соединение активно
     * false - нет соединения.
     */
    let isConnected = false;

    /**
     * Буфер пакетов данных.
     * Впервую очередь все данные попадают сюда, а уже потом отправляются.
     * На случай, если нет соединения сейчас, но оно появиться потом.
     */
    let packetBuffer = [];

    /**
     * Собственно сокет.
     * @type {null}
     */
    let socket = null;

    let raiseConnectCount = 0;

    /**
     * Инициалиизация.
     * Создадим объект клиента
     * Установим обработчики.
     */
    let init = function () {
        Logs.log("WebSocketClient запущен.");
        connect();
    };

    /**
     * Реализовать коннект.
     */
    let connect = function () {
        let uri;
        raiseConnectCount++;
        uri = protocol + "://" + host + ":" + port + url;
        Logs.log("WebSocket, raiseConnectCount:" + raiseConnectCount, Logs.LEVEL_NOTIFY, {uri: uri});
        socket = new WebSocket(uri);
        /** Установим обработчики. */
        socket.onopen = onOpen;
        socket.onclose = onClose;
        socket.onmessage = onMessage;
        socket.onerror = onError;
    };

    /**
     * Обработчик при открытии соединения.
     */
    let onOpen = function () {
        isConnected = true;
        /* На случай, если буфер не пуст. */
        trySend();
        Logs.log("WebSocketClient: Соединение установленно:" + host + ':' + port);
        connectionId = ++WebSocketClient.connectionId;
        self.onConnect(connectionId);
    };

    /**
     * Обработчик при закрытие соединения.
     * @param event
     */
    let onClose = function (event) {
        isConnected = false;
        raiseConnectCount--;
        if (event.wasClean) {
            Logs.log("WebSocketClient: Соединение закрыто успешно.");
        } else {
            Logs.log("WebSocketClient: Соединение закрыто, отсутствует соединение.");
        }
        Logs.log('WebSocketClient: Код: ' + event.code + ' причина: ' + event.reason);
        self.onDisconnect(connectionId);
        setTimeout(tryReconnect, 3000);
    };

    let tryReconnect = function () {
        if (isConnected === false) {
            Logs.log('Try reconnect', Logs.LEVEL_NOTIFY);
            if (raiseConnectCount < 3) {
                connect();
            }
        }
    };

    /**
     * Обработчик при получении данных(сообщения) от сервера.
     * @param event
     */
    let onMessage = function (event) {
        /* Logs.log("WebSocketClient: Получены данные.", Logs.LEVEL_DETAIL, event.data); */
        self.onData(event.data, connectionId);
    };

    /**
     * Обработчик ошибок вебсокета.
     * @param error
     */
    let onError = function (error) {
        Logs.log("WebSocketClient: Ошибка ", Logs.LEVEL_NOTIFY, error.timeStamp);
    };

    /**
     * Отправка данных из буфера.
     * Если нет данных в буфере возвращаемся.
     * Если нет соединения, то пробуем отправить их позже.
     * Берем пакет из буфера, удаляе его из буфера.
     * Отправляем пакет на сервер.
     * Если в буфере еще есть данные, пробуем их отправить позже.
     */
    let trySend = function () {
        let data;
        // если буфер пуст - уходим.
        if (!packetBuffer.length) {
            return;
        }
        /* Если нет соединения пробуем позже. */
        if (!isConnected) {
            //setTimeout(trySend, self.trySendTimeout);
            return;
        }
        /* Берем элемент из буфера. */
        data = packetBuffer.shift();
        socket.send(data);
        /* Logs.log("WebSocketClient.send data: length=" + data.length, Logs.LEVEL_DETAIL); */
        /* Остальные данные отправим позже. */
        if (packetBuffer.length) {
            setTimeout(trySend, 1500);
        }
    };
};

/**
 * По сути это просто номер соединения в пределах жизни скрипта.
 */
WebSocketClient.connectionId = 0;