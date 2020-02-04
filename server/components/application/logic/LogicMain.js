LogicMain = function () {
    let self = this;

    this.preInit = function (afterCallback) {

        self.setStatisticsIds();
        self.setProfileIds();
        self.setWebSocketServerMap();
        self.linkWebSocketAndApiRouter();

        afterCallback();
    };

    this.main = function () {
        WebSocketServer.run(function () {
        });
        this.setDeInitCallbacks();
    };

    this.setStatisticsIds = function () {

        /* User statistics. */
        Statistic.ID_AUTHORIZE = Statistic.addTitle(1, "авторизация через ВКонтакте ");
        Statistic.ID_LOGOUT = Statistic.addTitle(2, "покинул игру.");
    };

    this.setProfileIds = function () {

        Profiler.ID_AUTH_VK = Profiler.addTitle(1, "ID_AUTH_VK");
        Profiler.ID_AUTH_STANDALONE = Profiler.addTitle(2, "ID_AUTH_STANDALONE");
        Profiler.ID_LOGIC_SEND_TO_ALL = Profiler.addTitle(3, "ID_LOGIC_SEND_TO_ALL");
    };

    this.setWebSocketServerMap = function () {

        WebSocketServer.setMap({
            '/service/vk_buy': LogicPayments.VKbuy,
            '/service/clientCodeVK': ClientCodeLoader.getClientCodeVK,
            '/service/clientCodeStandalone': ClientCodeLoader.getClientCodeStandalone,
            '/service/reloadClientCode': ClientCodeLoader.reloadClientCode,
            '/service/VKCommentsWidget': ClientCodeLoader.getVKCommentsWidget,

            '/service/--profiler': LogicSystemRequests.getProfiler,
            '/service/--log': LogicSystemRequests.getLog,
            '/service/--shutdown___': LogicSystemRequests.shutdown,
            '/service/--logsSetDetail': LogicSystemRequests.logsSetDetail,
            '/service/--logsSetNotify': LogicSystemRequests.logsSetNotify,
            '/service/--help': function (callback) {
                callback("Project.name:" + Config.Project.name + "<br>" +
                    "--profiler <br>" +
                    "--log <br>" +
                    "--logsSetDetail<br>" +
                    "--logsSetNotify<br>" +
                    "--help<br>" +
                    "<br>" +
                    "reloadClientCode<br>" +
                    "clientCodeVK<br>" +
                    "clientCodeStandalone?socNetUserId={socNetUserId}<br>");
            }
        });
    };

    this.linkWebSocketAndApiRouter = function () {

        /* links ApiRouter and webSocketServer */
        ApiRouter.sendData = WebSocketServer.sendData;
        WebSocketServer.onConnect = ApiRouter.onConnect;
        WebSocketServer.onDisconnect = ApiRouter.onDisconnect;
        WebSocketServer.onData = ApiRouter.onData;
    };

    this.setDeInitCallbacks = function () {

        /* set deinit callbacks */
        addDeInitCallback(Statistic.flushCache);
    };
};


LogicMain = new LogicMain;

LogicMain.depends = ['Logs', 'Statistic', 'WebSocketServer', 'ApiRouter'];