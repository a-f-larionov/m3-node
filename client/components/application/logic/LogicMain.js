let LogicMain = function () {

    this.main = function () {
        /**@todo show preloader */
        Logs.init(function () {
        });

        DataPoints.init();

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
            CAPIStuff: CAPIStuff
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

    /**
     * After connect
     * @param connectionId
     */
    this.onConnect = function (connectionId) {
        ApiRouter.onConnect(connectionId);
        LogicUser.authorize();
    };

    this.onAuthorizeSuccess = function () {
        /** Установить текущую карту игрока */
        DataMap.setCurrentMapId(LogicUser.getUserLastMapId());

        SAPITimeServer.sendMeTime();
        LogicStuff.loadStuff();


        /** Первый показ игры: Главная страница */
        PageController.showPage(PageMain);

        /** Проверка визарада начала игры */
        LogicWizard.onAuthorizeSuccess();
    };
};
