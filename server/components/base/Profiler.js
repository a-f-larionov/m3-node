Profiler = function () {
    var self = this;

    var titles = [];
    var lastId = 0;
    var maxTitleLength = 0;

    /**  Last profiler Id. */
    var lastPrid = 0;

    this.start = function (id) {
        lastPrid++;
        titles[id].stamps[lastPrid] = mtime();
        return lastPrid;
    };

    this.stop = function (id, prid) {
        if (!prid) {
            Logs.log("Profiler.stop().", Logs.LEVEL_WARNING, prid);
        }
        if (!titles[id].stamps[prid]) {
            Logs.log("Profiler.stop(). no stamp for", Logs.LEVEL_WARNING, {prid: prid, id: id});
        }
        titles[id].sumTime += mtime() - titles[id].stamps[prid];
        titles[id].count++;
        delete titles[id].stamps[prid];
    };

    this.addTitle = function (id, title) {
        titles[id] = {
            stamps: {},
            sumTime: 0,
            count: 0,
            title: title
        };
        // @todo move to this.getMaxTitleLength = function()
        if (title.length > maxTitleLength) {
            maxTitleLength = title.length;
        }
        return id;
    };

    this.printReport = function () {
        output = self.getTextReport();
        console.log(output);
    };

    this.saveToDB = function () {
        var row, query;
        query = "INSERT INTO profiling ( `datetime`, `profileId`, `sumTime`, `count` ) VALUES ";
        for (var id in titles) {
            row = titles[id];
            query += "(" + time() + "," + id + "," + row.sumTime + "," + row.count + "),";
        }
        query = query.substr(0, query.length - 1);
        DB.query(query, function () {
        });
    };

    this.getTextReport = function () {
        var output, row, rps;
        output = '';
        output += "id " + str_pad("title", maxTitleLength + 3) + "  sumTime    count   rps\r\n";
        titles.forEach(function (row) {
            row.rps = (row.count / (row.sumTime / 1000) * 10000) / 10000;
            if (!row.rps) {
                row.rps = 0;
            }
        });
        var data2 = titles.slice(0);
        data2.sort(function (a, b) {
            if (a.rps > b.rps) return -1;
            if (a.rps < b.rps) return 1;
            return 0;
        });
        for (var id in data2) {
            row = data2[id];
            output += str_pad(id.toString(), 3);
            output += ' ';
            output += str_pad(row.title, maxTitleLength + 3);
            output += ' ';
            output += str_pad((row.sumTime / 1000).toString(), 10);
            output += ' ';
            output += str_pad((row.count).toString(), 7);
            output += ' ';
            output += row.rps;
            output += "\r\n";
        }
        var memoryUsage = process.memoryUsage();
        output += "rss: " + Math.round(memoryUsage.rss / 1024 / 1024) + " Mb\r\n";
        output += "heapTotal: " + Math.round(memoryUsage.heapTotal / 1024 / 1024) + " Mb\r\n";
        output += "heapUsed: " + Math.round(memoryUsage.heapUsed / 1024 / 1024) + " Mb\r\n";
        return output;
    };

    this.init = function (afterInitCallback) {
        setInterval(Profiler.printReport, Config.Profiler.reportTimeout);
        setInterval(Profiler.saveToDB, Config.Profiler.saveToDBTimeout);
        afterInitCallback();
    };
};

/**
 * Статичный класс.
 * @type {Profiler}
 */
Profiler = new Profiler();

Profiler.depends = ['Logs'];