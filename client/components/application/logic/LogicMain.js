/**
 * @type {LogicMain}
 * @return {LogicMain}
 * @constructor
 */
let LogicMain = (function () {

    let firstAuth = true;

    function LogicMain() {
    }

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
        LogicStuff.loadStuff();
        /** Установить текущую карту игрока */
        DataMap.setCurrentMapId();

        /** Первый показ игры: Главная страница */
        if (firstAuth) {
            PageController.showPage(PageMain);

            /** Проверка визарада начала игры */
            let timerId = setInterval(function () {
                if (PageBlockZPreloader.isLoaded()) {
                    clearInterval(timerId);
                    LogicWizard.onLoaded();
                    PageBlockZPreloader.onLoaded();
                }
            }, 10);
        }

        if (prid) {
            setTimeout(function () {
                Sounds.loadSounds();
            }, 2000);
            SAPILogs.clientLoaded(prid);
            prid = null;
        }
        firstAuth = false;
    };

    LogicMain.prototype.main = function () {
        let webSocketClient;

        /**@todo show preloader */
        Logs.init(function () {
        });

        /** Init some components */
        SocNet.init();
        DataPoints.init();
        DataChests.init();

        /** WebSocket Client */
        webSocketClient = new WebSocketClient();
        webSocketClient.init();

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
        ApiRouter.addOnDisconnectCallback(function () {
            LogicWizard.finish(false);
        });

        /** Running */
        webSocketClient.run();

        //@todo remove it
        window.wsc = webSocketClient;

        OnIdle.init();
    };

    /**
     * @type {LogicMain}
     */
    return new LogicMain();
})();