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
    };

    this.setWebSocketServerMap = function () {

        WebSocketServer.setMap({

            '/service/client-vk': ClientCodeLoader.getClientVK,
            '/service/client-standalone': ClientCodeLoader.getClientStandalone,

            '/service/vk-widget-comments': ClientCodeLoader.getVKWidgetComments,

            '/service/--reload-sprite': ClientCodeLoader.reloadSprite,
            '/service/--reload-client-code': ClientCodeLoader.reloadClient,

            '/service/--shutdown___': LogicSystemRequests.shutdown,

            '/service/--help': function (callback) {
                callback("Project.name:" + Config.Project.name + "<br>" +
                    "--reload-sprite<br>" +
                    "--reload-client-code<br>" +
                    "--help<br>" +
                    "<br>" +
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
};

LogicMain = new LogicMain;

LogicMain.depends = ['Logs', 'WebSocketServer', 'ApiRouter'];