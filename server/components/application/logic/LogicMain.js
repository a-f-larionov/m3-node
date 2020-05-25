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

        /** User statistics. */
        Statistic.ID_AUTHORIZE = Statistic.addTitle(1, "авторизация через ВКонтакте ");
        Statistic.ID_LOGOUT = Statistic.addTitle(2, "покинул игру.");
    };

    this.setProfileIds = function () {

    };

    this.setWebSocketServerMap = function () {

        WebSocketServer.setMap({

            '/service/vk_buy': LogicPayments.VKbuy,
            '/service/standalone_buy': LogicPayments.standaloneBuy,

            '/service/client-vk': ClientCodeLoader.getClientVK,
            '/service/client-standalone': ClientCodeLoader.getClientStandalone,

            '/service/--reload-sprite': ClientCodeLoader.reloadSprite,

            '/service/--reloadClientCode': ClientCodeLoader.reloadClient,
            '/service/vk-comments-widget': ClientCodeLoader.getVKCommentsWidget,

            '/service/--profiler': LogicSystemRequests.getProfiler,
            '/service/--counters': LogicSystemRequests.getCounters,
            '/service/--shutdown___': LogicSystemRequests.shutdown,
            '/service/--reload-levels': LogicSystemRequests.reloadLevels,
            '/service/--logsSetDetail': LogicSystemRequests.logsSetDetail,
            '/service/--logsSetNotify': LogicSystemRequests.logsSetNotify,
            '/service/--help': function (callback) {
                callback("Project.name:" + Config.Project.name + "<br>" +
                    "--profiler <br>" +
                    "--counters <br>" +
                    "--logsSetDetail<br>" +
                    "--logsSetNotify<br>" +
                    "--help<br>" +
                    "<br>" +
                   // "reloadClient<br>" +
                    "client-vk<br>" +
                    "client-standalone?soc-net-user-id={socNetUserId}<br>");
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

        /** Set deinit callbacks */
        addDeInitCallback(Statistic.flushCache);
    };
};

LogicMain = new LogicMain;

LogicMain.depends = ['Logs', 'Statistic', 'WebSocketServer', 'ApiRouter'];