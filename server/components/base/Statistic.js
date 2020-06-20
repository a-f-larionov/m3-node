/**
 * @type {Statistic}
 * @constructor
 */
Statistic = function () {
    let self = this;

    let cache = [];

    /**
     * @param uid  int
     * @param statId int
     */
    this.write = function (uid, statId) {
        if (!self.titles[statId]) {
            Logs.log('Statistic with id: ' + statId + ' not found', Logs.LEVEL_ALERT);
            return;
        }
        cache.push({
            uid: uid,
            time: time(),
            statId: statId
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
        let query, row;
        if (cache.length) {
            query = "INSERT INTO statistic (`uid`, `time`, `statId`) VALUES ";
            for (let i in cache) {
                row = cache[i];
                query += "(" + row.uid + "," + row.time + "," + row.statId + "),";
            }
            query = query.substr(0, query.length - 1);
            Logs.log("Statistic insert start:" + cache.length + "query length:" + query.length, Logs.LEVEL_NOTIFY);
            DB.query(query, function () {
                console.log(arguments);
                Logs.log("Statistic cache flushed.rows:" + cache.length, Logs.LEVEL_ALERT);
            });
            cache = [];
        }
    };

    this.getReport = function (callback) {
        self.flushCache();
        let query;
        query = "SELECT socNetUserId, uid, statId, time " +
            "from users " +
            "   inner join statistic " +
            "       on users.id = statistic.uid " +
            "ORDER BY statistic.id DESC LIMIT 1000";
        DB.query(query, function (rows) {
            let html, row, title;
            html = "";
            html += "<html><head><meta charset='utf8' ></head><body>";
            html += "<table>";
            for (let i in rows) {
                row = rows[i];
                let time =
                    new Date(row.time).getDay() + " " +
                    new Date(row.time).getHours() + ":" +
                    new Date(row.time).getMinutes() + ":" +
                    new Date(row.time).getSeconds();
                html += "<tr>";
                html += "<td><a href='" +
                    SocNet(SocNet.TYPE_VK).getUserProfileUrl(row.socNetUserId) +
                    "'>" +
                    row.socNetUserId +
                    "</a>" +
                    "</td>";
                html += "<td>" + row.uid + "</td>";
                html += "<td>" + time + "</td>";
                html += "<td>" + self.titles[row.statId] + "</td>";
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


Statistic.ID_AUTHORIZE_VK = 100;
Statistic.ID_AUTHORIZE_STANDALONE = 101;
Statistic.ID_LOGOUT = 102;

Statistic.ID_HUMMER_USE = 201;
Statistic.ID_LIGHTNING_USE = 202;
Statistic.ID_SHUFFLE_USE = 203;

Statistic.ID_BUY_VK_MONEY = 300;

Statistic.ID_BUY_HEALTH = 700;

Statistic.ID_BUY_HUMMER = 400;
Statistic.ID_BUY_LIGHTNING = 500;
Statistic.ID_BUY_SHUFFLE = 600;

Statistic.ID_START_PLAY = 701;
Statistic.ID_FINISH_PLAY = 702;

Statistic.titles = {};
Statistic.titles[Statistic.ID_AUTHORIZE_VK] = "Зашел через ВК";
Statistic.titles[Statistic.ID_AUTHORIZE_STANDALONE] = "Зашел Стандале";
Statistic.titles[Statistic.ID_LOGOUT] = "Выход ";

Statistic.titles[Statistic.ID_HUMMER_USE] = "Выход ";
Statistic.titles[Statistic.ID_LIGHTNING_USE] = "Выход ";
Statistic.titles[Statistic.ID_SHUFFLE_USE] = "Выход ";

Statistic.titles[Statistic.ID_BUY_VK_MONEY] = "Выход ";

Statistic.titles[Statistic.ID_BUY_HEALTH] = "Выход ";

Statistic.titles[Statistic.ID_BUY_HUMMER] = "Выход ";
Statistic.titles[Statistic.ID_BUY_LIGHTNING] = "Выход ";
Statistic.titles[Statistic.ID_BUY_SHUFFLE] = "Выход ";

Statistic.titles[Statistic.ID_START_PLAY] = "Выход ";
Statistic.titles[Statistic.ID_FINISH_PLAY] = "Выход ";
