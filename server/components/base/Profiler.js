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
        if (!data[id]) return Logs.log("Profiler.start(). no data for " + JSON.stringify(id), Logs.LEVEL_WARNING, {prid: lastPrid, id: id, data: data});
        pridToId[prid] = id;
        data[id].stamps[prid] = mtime();

        return prid;
    };

    this.finish = function (prid) {
        let id;
        if (!prid) return Logs.log("Profiler.stop().", Logs.LEVEL_WARNING, prid);
        id = pridToId[prid];
        if (!data[id]) return Logs.log("Profiler.stop(). if (!data['id']) { /*  This message. */ }",
            Logs.LEVEL_WARNING, {prid: prid, id: id, stack: (new Error().stack)});
        if (!data[id].stamps[prid]) return Logs.log("Profiler.stop(). no stamp for", Logs.LEVEL_WARNING, {prid: prid, id: id});
        data[id].sumTime += mtime() - data[id].stamps[prid];
        data[id].count++;
        Profiler.clear(prid);
    };

    this.clear = function (prid) {
        let id;
        id = pridToId[prid];
        //Logs.log("clear " + prid + ' ' + id, Logs.LEVEL_ALERT);
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
Profiler.ID_LOGIC_SEND_TO_ALL = 3;
Profiler.ID_SAPIUSER_SEND_ME_INFO = 4;
Profiler.ID_USERSAPI_SEND_ME_USER_LIST_INFO = 5;
Profiler.ID_USERSAPI_SEND_ME_USER_IDS_BY_SOC_NET = 6;
Profiler.ID_USERSAPI_ON_FINISH = 7;
Profiler.ID_USERSAPI_ON_START = 8;
Profiler.ID_SEND_ME_TIME = 9;
Profiler.IS_SAPIMAP_SEND_ME_MAP_INFO = 10;
Profiler.IS_SAPIMAP_SEND_ME_USERS_SCORE = 11;
Profiler.IS_SAPIMAP_OPEN_CHEST = 12;
Profiler.ID_SAPISTUFF_SEND_ME_STUFF = 13;
Profiler.ID_CLIENT_LOAD_VK = 14;
Profiler.ID_CLIENT_LOAD_STANDALONE = 15;


Profiler.titles = [];
Profiler.titles[Profiler.ID_AUTH_VK] = 'auth-vk';
Profiler.titles[Profiler.ID_AUTH_STANDALONE] = 'auth-standalone';
Profiler.titles[Profiler.ID_LOGIC_SEND_TO_ALL] = 'send-to-all';

Profiler.titles[Profiler.ID_SAPIUSER_SEND_ME_INFO] = 'SAPIUSER.sendMeInfo';
Profiler.titles[Profiler.ID_USERSAPI_SEND_ME_USER_LIST_INFO] = 'SAPIUSER.sendMeUserListInfo';
Profiler.titles[Profiler.ID_USERSAPI_SEND_ME_USER_IDS_BY_SOC_NET] = 'SAPIUSER.sendMeUserIdsBySocNet';
Profiler.titles[Profiler.ID_USERSAPI_ON_FINISH] = 'SAPIUSER.onFinish';
Profiler.titles[Profiler.ID_USERSAPI_ON_START] = 'SAPIUSER.onStart';
Profiler.titles[Profiler.ID_SEND_ME_TIME] = 'Send-Me-Time';
Profiler.titles[Profiler.IS_SAPIMAP_SEND_ME_MAP_INFO] = 'SAPIMap.sendMeMapInfo';
Profiler.titles[Profiler.IS_SAPIMAP_SEND_ME_USERS_SCORE] = 'SAPIMap.sendMeUsersScore';
Profiler.titles[Profiler.IS_SAPIMAP_OPEN_CHEST] = 'SAPIMap.openChest';
Profiler.titles[Profiler.ID_SAPISTUFF_SEND_ME_STUFF] = 'SAPIStuff.sendMeStuff';

Profiler.titles[Profiler.ID_CLIENT_LOAD_VK] = 'load-client-vk';
Profiler.titles[Profiler.ID_CLIENT_LOAD_STANDALONE] = 'load-client-standalone';