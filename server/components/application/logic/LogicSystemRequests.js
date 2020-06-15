LogicSystemRequests = function () {

    this.getOnline = function (callback) {
        let ids = LogicUser.getOnlineUserIds();
        DataUser.getList(ids, function (list) {
            callback(JSON.stringify(list));
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

    this.shutdown = function (callback) {
        Logs.log("Shutdown", Logs.LEVEL_ALERT);
        callback('<pre>' + "Shutdown executed!" + Date.now() + '</pre>');
        deInitBeforeShutdown(function () {
            process.exit();
        });
    };

    this.reloadLevels = function (callback) {
        delete require.cache[require.resolve('/var/www/tri-base/server/components/application/data/DataPoints.js')];
        loader.includeComponentByPath('/var/www/tri-base/server/components/application/data/DataPoints.js');
        if (callback) callback('OK!');
    };

    this.logsSetDetail = function (callback) {
        Logs.setLevel(Logs.LEVEL_DETAIL);
        setTimeout(function () {
            Logs.setLevel(Logs.LEVEL_NOTIFY);
        }, 1000 * 60 * 10);
        callback("set detail log level " + Date.now());
    };

    this.logsSetNotify = function (callback) {
        Logs.setLevel(Logs.LEVEL_NOTIFY);
        callback("set detail log level " + Date.now());
    };
};

LogicSystemRequests = new LogicSystemRequests;