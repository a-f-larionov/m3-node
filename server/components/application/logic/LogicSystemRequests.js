LogicSystemRequests = function () {

    this.getOnline = function (callback) {
        let ids = LogicUser.getOnlineUserIds();
        DataUser.getList(ids, function (list) {
            callback(JSON.stringify(
                {
                    ids: ids,
                    list: list
                }
            ));
        });
    };

    this.getProfiler = function (callback) {
        callback(
            '<pre>' + Profiler.getReport() + '</pre>' +
            "<script>setTimeout(function(){window.location.href = window.location.href;},1000);</script>"
        );
    };

    this.getCounters = function (callback) {
        let txt = '';


        let stats = [];
        for (let group in ApiRouter.stats) {
            for (let method in ApiRouter.stats[group]) {
                if (!ApiRouter.stats[group].hasOwnProperty(method)) continue;
                stats.push({group: group, method: method, count: ApiRouter.stats[group][method]});
            }
        }
        stats.sort(function (a, b) {
            if (a.count === b.count) return 0;
            return a.count < b.count ? 1 : -1;
        });
        stats = stats.filter(function (a) {
            return a.count;
        });

        txt += '<table>';
        stats.forEach(function (stat) {
            txt +=
                '<tr>' +
                '<td>' + stat.group + '</td>' +
                '<td>' + stat.method + '</td>' +
                '<td>' + stat.count + '</td>\r\n' +
                '</tr>';
        });
        txt += '</table>';

        txt += '<script>' +
            'setTimeout(function(){window.location = window.location;}, 1000);' +
            '</script>';

        callback(txt);
    };

    let shutdownForceKey;

    this.shutdown = function (callback, request) {

        if (!Config.Project.shutdownSkipKey) {
            if (request.url.indexOf('key=' + shutdownForceKey) === -1) {
                shutdownForceKey = '' + Date.now() + '' + Math.ceil(Math.random() * 1000);
                return callback('online' + LogicUser.getOnlineUserIds().length + "\r\n<br> " +
                    "key=" + shutdownForceKey);
            }
        }

        Logs.log("Перезапуск сервера руками", Logs.LEVEL_INFO);
        callback('<pre>' + "Shutdown executed!" + Date.now() + '</pre>');
        deInitBeforeShutdown(function () {
            process.exit();
        });
    };

    this.logsSetDetail = function (callback) {
        Logs.setLevel(Logs.LEVEL_TRACE);
        setTimeout(function () {
            Logs.setLevel(Logs.LEVEL_DEBUG);
        }, 1000 * 60 * 10);
        callback("set detail log level by a time " + Date.now());
    };

    this.logsSetNotify = function (callback) {
        Logs.setLevel(Logs.LEVEL_DEBUG);
        callback("set detail log level " + Date.now());
    };
};

LogicSystemRequests = new LogicSystemRequests;