LogicSystemRequests = function () {

    let shutdownForceKey;

    this.shutdown = function (callback, request) {

        if (!Config.Project.shutdownSkipKey) {
            if (request.url.indexOf('key=' + shutdownForceKey) === -1) {
                shutdownForceKey = '' + Date.now() + '' + Math.ceil(Math.random() * 1000);
                return callback("<br> " + "key=" + shutdownForceKey);
            }
        }

        Logs.log("Перезапуск сервера руками", Logs.LEVEL_INFO);
        callback('<pre>' + "Shutdown executed!" + Date.now() + '</pre>');
        deInitBeforeShutdown(function () {
            process.exit();
        });
    };
};

LogicSystemRequests = new LogicSystemRequests;