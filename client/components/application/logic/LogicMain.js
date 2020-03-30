LogicMain = function () {

    this.main = function () {
        //show preloader
        Logs.init(function () {
        });

        /** init some components */
        SocNet.init();

        /* WebSocket Client */
        webSocketClient = new WebSocketClient();
        webSocketClient.init(function () {
        });

        //@todo need be automate...
        /* ApiRouter */

        ApiRouter.setMap({
            CAPIUser: CAPIUser,
            CAPITimeServer: CAPITimeServer,
            CAPIMap: CAPIMap,
            CAPIStuff: CAPIStuff
        });

        /* Link ApiRouter and WebSocketClient */
        ApiRouter.sendData = webSocketClient.sendData;
        webSocketClient.onData = ApiRouter.onData;
        webSocketClient.onConnect = this.onConnect;
        webSocketClient.onDisconnect = ApiRouter.onDisconnect;

        /* running */
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
        SAPITimeServer.sendMeTime();
        LogicStuff.loadStuff();
        /** Установить текущую карту игрока */
        DataMap.setCurrentMapId(
            DataMap.getMapIdFromPointId(
                LogicUser.getCurrentUser().nextPointId
            )
        );
        PageController.showPage(PageMain);
    };
};
