/**
 * @type {LogicMain}
 * @constructor
 */
let LogicMain = function () {

    /**
     * After connect
     * @param connectionId
     */
    LogicMain.prototype.onConnect = function (connectionId) {
        ApiRouter.onConnect(connectionId);
        SAPITimeServer.sendMeTime();
        LogicUser.authorize();
    };

    LogicMain.prototype.onAuthorizeSuccess = function () {
        /** Установить текущую карту игрока */
        DataMap.setCurrentMapId(LogicUser.getUserLastMapId());

        LogicStuff.loadStuff();

        /** Первый показ игры: Главная страница */
        PageController.showPage(PageMain);

        /** Проверка визарада начала игры */
        LogicWizard.onAuthorizeSuccess();
    };

    LogicMain.prototype.main = function () {
        let webSocketClient;
        /**@todo show preloader */
        Logs.init(function () {
        });

        DataPoints.init();
        DataChests.init();

        /** init some components */
        SocNet.init();

        /** WebSocket Client */
        webSocketClient = new WebSocketClient();
        webSocketClient.init(function () {
        });

        //@todo need be automate...
        /** ApiRouter */

        ApiRouter.setMap({
            CAPIUser: CAPIUser,
            CAPITimeServer: CAPITimeServer,
            CAPIMap: CAPIMap,
            CAPIStuff: CAPIStuff,
            CAPILog: CAPILog,
        });

        /** Link ApiRouter and WebSocketClient */
        ApiRouter.sendData = webSocketClient.sendData;
        webSocketClient.onData = ApiRouter.onData;
        webSocketClient.onConnect = this.onConnect;
        webSocketClient.onDisconnect = ApiRouter.onDisconnect;

        /** Running */
        webSocketClient.run();

        OnIdle.init(function () {
        });
    };
};

LogicMain = new LogicMain();