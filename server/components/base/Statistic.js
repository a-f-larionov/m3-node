Statistic = function () {
    var self = this;

    var cache = [];

    var titles = {};

    var lastId = 0;

    /**
     * @param userId int
     * @param statisticId int
     */
    this.add = function (userId, statisticId) {
        if (!titles[statisticId]) {
            Logs.log('Statisti with id: ' + statisticId + ' not found', Logs.LEVEL_WARNING);
            return;
        }
        cache.push({
            userId: userId,
            timeStamp: new Date().getTime(),
            statisticId: statisticId
        });
    };

    this.init = function (afterInitCallback) {
        setInterval(self.checkCache, Config.Statistic.checkInterval);
        afterInitCallback();
    };

    this.checkCache = function () {
        if (cache.length > Config.Statistic.cacheLimit) {
            self.flushCache();
        }
    };

    this.flushCache = function () {
        var query, row;
        if (cache.length) {
            query = "INSERT INTO statistic (`userId`,`timeStamp`,`statisticId`) VALUES ";
            for (var i in cache) {
                row = cache[i];
                query += "(" + row.userId + "," + row.timeStamp + "," + row.statisticId + "),";
            }
            query = query.substr(0, query.length - 1);
            Logs.log("Statistic cache start:" + cache.length + "query length:" + query.length, Logs.LEVEL_NOTIFY);
            DB.query(query, function () {
                Logs.log("Statistic cache flushed.rows:" + cache.length, Logs.LEVEL_DETAIL);
            });
            cache = [];
        }
    };

    this.addTitle = function (id, title) {
        titles[id] = {
            title: title
        };
        return id;
    };

    this.getLog = function (callback) {
        var query;
        query = "SELECT firstName, lastName, userId, statisticId, timeStamp from users inner join statistic on users.id = statistic.userId ORDER BY statistic.id DESC LIMIT 1000";
        // id, userId, timeStamp, statisticId
        DB.query(query, function (rows) {
            var html, row, title;
            html = "";
            html += "<html><head><meta charset='utf8' ></head><body>";
            html += "<table>";
            for (var i in rows) {
                row = rows[i];
                var time = new Date(row.timeStamp).getDay() + " " + new Date(row.timeStamp).getHours() + ":" + new Date(row.timeStamp).getMinutes() + ":" + new Date(row.timeStamp).getSeconds();
                html += "<tr>";
                html += "<td>" + row.firstName + " " + row.lastName + "</td>";
                html += "<td>" + row.userId + "</td>";
                html += "<td>" + time + "</td>";
                html += "<td>" + title + "</td>";
                html += "</tr>";
            }
            html += "</table>";
            html += "</body></html>";
            callback(html);
        });
    };
};

/**
 * Статичный класс.
 * @type {Statistic}
 */
Statistic = new Statistic();

Statistic.depends = ['Logs', 'Profiler', 'DB'];