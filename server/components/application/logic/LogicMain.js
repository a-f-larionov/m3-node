LogicMain = function () {
    let self = this;

    this.preInit = function (afterCallback) {

        self.setWebSocketServerMap();
        self.linkWebSocketAndApiRouter();

        afterCallback();
    };

    this.main = function () {
        WebSocketServer.run(function () {
        });
        this.setDeInitCallbacks();
    };

    this.setWebSocketServerMap = function () {

        WebSocketServer.setMap({

            '/service/vk_buy': LogicPayments.VKbuy,
            '/service/standalone_buy': LogicPayments.standaloneBuy,

            '/service/client-vk': ClientCodeLoader.getClientVK,
            '/service/client-standalone': ClientCodeLoader.getClientStandalone,

            '/service/vk-widget-comments': ClientCodeLoader.getVKWidgetComments,

            '/service/--reload-sprite': ClientCodeLoader.reloadSprite,
            '/service/--reload-client-code': ClientCodeLoader.reloadClient,

            '/service/--profiler': LogicSystemRequests.getProfiler,
            '/service/--counters': LogicSystemRequests.getCounters,
            '/service/--get-statistics': Statistic.getReport,
            '/service/--get-online': LogicSystemRequests.getOnline,
            '/service/--logs-set-detail': LogicSystemRequests.logsSetDetail,
            '/service/--logs-set-notify': LogicSystemRequests.logsSetNotify,
            '/service/--shutdown___': LogicSystemRequests.shutdown,

            '/service/--help': function (callback) {
                callback("Project.name:" + Config.Project.name + "<br>" +
                    "--profiler <br>" +
                    "--counters <br>" +
                    "--get-statistics<br>" +
                    "--get-online<br>" +
                    "--reload-levels<br>" +
                    "--logs-set-detail<br>" +
                    "--logs-set-notify<br>" +
                    "--reload-sprite<br>" +
                    "--reload-client-code<br>" +
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