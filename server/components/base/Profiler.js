/**
 * @type {Profiler}
 * @constructor
 */
Profiler = function () {

    let data = [];

    let pridToId = [];

    /**  Last profiler Id. */
    let lastPrid = 0;

    this.start = function (id) {
        let prid;
        lastPrid++;
        prid = lastPrid;
        if (!data[id])
            return Logs.log("Profiler.start(). no data for " + JSON.stringify(id),
                Logs.LEVEL_WARNING, {prid: lastPrid, id: id, data: data});
        pridToId[prid] = id;
        data[id].stamps[prid] = mtime();

        return prid;
    };

    this.finish = function (prid) {
        let id;
        if (!prid) return Logs.log("Profiler.stop().", Logs.LEVEL_WARNING, prid);
        id = pridToId[prid];
        if (!data[id]) return Logs.log("Profiler.stop(). if (!data[id]) { /*  This message. */ }",
            Logs.LEVEL_WARNING, {prid: prid, id: id, stack: (new Error().stack)});
        if (!data[id].stamps[prid]) return Logs.log("Profiler.stop(). no stamp for", Logs.LEVEL_WARNING, {prid: prid, id: id});
        data[id].sumTime += mtime() - data[id].stamps[prid];
        data[id].count++;
        Profiler.clear(prid);
    };

    this.clear = function (prid) {
        let id;
        id = pridToId[prid];
        if (!data[id]) return Logs.log("Profiler.stop(). if (!data[id]) { /*  This message. */ }",
            Logs.LEVEL_WARNING, {prid: prid, id: id, stack: (new Error().stack)});

        delete data[id].stamps[prid];
        delete pridToId[prid];
    };

    this.getReport = function () {
        let txt = '', report, totalSumm = 0;

        report = [];
        data.forEach(function (data, i) {
            report[i] = data;
        });

        report.sort(function (a, b) {
            if (a.sumTime === b.sumTime) return 0;
            return a.sumTime < b.sumTime ? 1 : -1;
        });
        report = data.filter(function (a) {
            return a.count;
        });

        txt += '<table>';
        report.forEach(function (row) {
            totalSumm += row.sumTime;
            txt +=
                '<tr>' +
                '<td>' + row.title + '</td>' +
                '<td>' + row.count + '</td>' +
                '<td>' + row.sumTime + '</td>\r\n' +
                '<td>' + Math.round(row.sumTime / row.count) + '</td>\r\n' +
                '</tr>';
        });
        txt += '</table>';

        txt += '\r\ntotalSumm: ' + totalSumm + '\r\n';
        let memoryUsage = process.memoryUsage();
        /** https://nodejs.org/api/process.html */
        txt += "rss: " + Math.round(memoryUsage.rss / 1024 / 1024) + " Mb\r\n";
        txt += "heapTotal: " + Math.round(memoryUsage.heapTotal / 1024 / 1024) + " Mb\r\n";
        txt += "heapUsed: " + Math.round(memoryUsage.heapUsed / 1024 / 1024) + " Mb\r\n";
        return txt;
    };

    this.init = function (afterInitCallback) {

        Profiler.titles.forEach(function (title, id) {
            data[id] = {
                stamps: {},
                sumTime: 0,
                count: 0,
                title: title
            };
        });

        afterInitCallback();
    };
};

/**
 * Статичный класс.
 * @type {Profiler}
 */
Profiler = new Profiler();

pStart = Profiler.start;
pFinish = Profiler.finish;
pClear = Profiler.clear;

Profiler.depends = ['Logs'];

Profiler.ID_AUTH_VK = 1;
Profiler.ID_AUTH_STANDALONE = 2;

Profiler.ID_LOGIC_SEND_TO_ALL = 50;

Profiler.ID_SAPIUSER_SEND_ME_INFO = 100;
Profiler.ID_SAPIUSER_SEND_ME_USER_LIST_INFO = 101;
Profiler.ID_SAPIUSER_SEND_ME_USER_IDS_BY_SOC_NET = 102;
Profiler.ID_SAPIUSER_HEALTH_BACK = 120;
Profiler.ID_SAPIUSER_HEALTH_DOWN = 121;
Profiler.ID_SAPIUSER_ONFINISH = 122;
Profiler.ID_SAPIUSER_SEND_ME_SCORES = 130;
Profiler.ID_SAPIUSER_SEND_ME_MAP_FRIENDS = 135;
Profiler.ID_SAPIUSER_SEND_ME_TOP_USER_SCORES = 136;

Profiler.ID_SEND_ME_TIME = 200;

Profiler.ID_SAPIMAP_SEND_ME_MAP_INFO = 300;
Profiler.ID_SAPIMAP_SEND_ME_USERS_SCORE = 302;
Profiler.ID_SAPIMAP_SEND_ME_USERS_TOP = 303;
Profiler.ID_SAPIMAP_SEND_ME_POINT_TOP_SCORE = 304;
Profiler.ID_SAPIMAP_SEND_ME_POINT_TOP_SCORE_CACHED = 305;
Profiler.ID_SAPIMAP_OPEN_CHEST = 306;

Profiler.ID_SAPISTUFF_SEND_ME_STUFF = 400;
Profiler.ID_SAPISTUFF_USED_HUMMER = 410;
Profiler.ID_SAPISTUFF_USED_SHUFFLE = 411;
Profiler.ID_SAPISTUFF_USED_LIGHTNING = 412;

Profiler.ID_SAPISTUFF_BUY_HUMMER = 450;
Profiler.ID_SAPISTUFF_BUY_SHUFFLE = 451;
Profiler.ID_SAPISTUFF_BUY_LIGHTNING = 452;
Profiler.ID_SAPISTUFF_BUY_HEALTH = 453;

Profiler.ID_CLIENT_LOAD_VK = 500;
Profiler.ID_CLIENT_LOAD_STANDALONE = 501;

Profiler.ID_SAPILOGS_LOG = 601;


Profiler.titles = [];
Profiler.titles[Profiler.ID_AUTH_VK] = 'auth-vk';
Profiler.titles[Profiler.ID_AUTH_STANDALONE] = 'auth-standalone';
Profiler.titles[Profiler.ID_LOGIC_SEND_TO_ALL] = 'send-to-all';

Profiler.titles[Profiler.ID_SAPIUSER_SEND_ME_INFO] = 'SAPIUSER.sendMeInfo';
Profiler.titles[Profiler.ID_SAPIUSER_SEND_ME_USER_LIST_INFO] = 'SAPIUSER.sendMeUserListInfo';
Profiler.titles[Profiler.ID_SAPIUSER_SEND_ME_USER_IDS_BY_SOC_NET] = 'SAPIUSER.sendMeUserIdsBySocNet';
Profiler.titles[Profiler.ID_SAPIUSER_HEALTH_BACK] = 'SAPIUSER.healthBack';
Profiler.titles[Profiler.ID_SAPIUSER_HEALTH_DOWN] = 'SAPIUSER.healthDown';
Profiler.titles[Profiler.ID_SAPIUSER_ONFINISH] = 'SAPIUSER.onFinish';
Profiler.titles[Profiler.ID_SAPIUSER_SEND_ME_SCORES] = 'SAPIUSER.sendMeScores';
Profiler.titles[Profiler.ID_SAPIUSER_SEND_ME_MAP_FRIENDS] = 'SAPIUSER.sendMeMapFriends';

Profiler.titles[Profiler.ID_SEND_ME_TIME] = 'Send-Me-Time';

Profiler.titles[Profiler.ID_SAPIMAP_SEND_ME_MAP_INFO] = 'SAPIMap.sendMeMapInfo';
Profiler.titles[Profiler.ID_SAPIMAP_SEND_ME_USERS_SCORE] = 'SAPIMap.sendMeUsersScore';
Profiler.titles[Profiler.ID_SAPIMAP_SEND_ME_USERS_TOP] = 'SAPIMap.sendMeUsersTop';
Profiler.titles[Profiler.ID_SAPIUSER_SEND_ME_TOP_USER_SCORES] = 'SAPIMap.sendMeTopUsers';
Profiler.titles[Profiler.ID_SAPIMAP_SEND_ME_POINT_TOP_SCORE] = 'SAPIMap.sendMePointTopScore';
Profiler.titles[Profiler.ID_SAPIMAP_SEND_ME_POINT_TOP_SCORE_CACHED] = 'SAPIMap.sendMePointTopScore(cached)';
Profiler.titles[Profiler.ID_SAPIMAP_OPEN_CHEST] = 'SAPIMap.openChest';

Profiler.titles[Profiler.ID_SAPISTUFF_SEND_ME_STUFF] = 'SAPIStuff.sendMeStuff';

Profiler.titles[Profiler.ID_SAPISTUFF_USED_HUMMER] = 'SAPIStuff.usedHummer';
Profiler.titles[Profiler.ID_SAPISTUFF_USED_SHUFFLE] = 'SAPIStuff.usedShuffle';
Profiler.titles[Profiler.ID_SAPISTUFF_USED_LIGHTNING] = 'SAPIStuff.usedLightning';

Profiler.titles[Profiler.ID_SAPISTUFF_BUY_HUMMER] = 'SAPIStuff.buyHummer';
Profiler.titles[Profiler.ID_SAPISTUFF_BUY_SHUFFLE] = 'SAPIStuff.buyShuffle';
Profiler.titles[Profiler.ID_SAPISTUFF_BUY_LIGHTNING] = 'SAPIStuff.buyLightning';
Profiler.titles[Profiler.ID_SAPISTUFF_BUY_HEALTH] = 'SAPIStuff.buyHealth';

Profiler.titles[Profiler.ID_CLIENT_LOAD_VK] = 'load-client-vk';
Profiler.titles[Profiler.ID_CLIENT_LOAD_STANDALONE] = 'load-client-standalone';

Profiler.titles[Profiler.ID_SAPILOGS_LOG] = 'SAPILogs.log';