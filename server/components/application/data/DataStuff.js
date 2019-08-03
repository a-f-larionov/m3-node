DataStuff = function () {

    var tableName = 'users_stuff';

    var fromDBToData = function (data) {
        if (!data) return data;
        if (data.userId) data.userId = parseInt(data.userId);
        if (data.hummerQty) data.hummerQty = parseInt(data.hummerQty);
        if (data.shuffleQty) data.shuffleQty = parseInt(data.shuffleQty);
        if (data.lightingQty) data.lightingQty = parseInt(data.lightingQty);
        return data;
    };

    this.getByUserId = function (userId, callback) {
        DB.queryWhere(tableName, {
            userId: [userId]
        }, function (rows) {
            callback(fromDBToData(rows[0]));
        });
    };

    this.create = function (userId, callback) {
        let data = {
            userId: userId,
            hummerQty: 0,
            shuffleQty: 0,
            lightingQty: 0,
            goldQty: 0
        };
        DB.insert(tableName, data, function (result) {
            // result = {"fieldCount":0,"affectedRows":1,"insertId":0,"serverStatus":2,"warningCount":0,"message":"","protocol41":true,"changedRows":0}
            callback(data);
        });
    };

    this.usedHummer = function (userId) {
        DB.query("UPDATE " + tableName + "" +
            " SET hummerQty = hummerQty -1" +
            " WHERE userId = " + parseInt(userId), function () {
        });
    };

    this.usedShuffle = function (userId) {
        DB.query("UPDATE " + tableName + "" +
            " SET shuffleQty = shuffleQty -1" +
            " WHERE userId = " + parseInt(userId), function () {
        });
    };

    this.usedLighting = function (userId) {
        DB.query("UPDATE " + tableName + "" +
            " SET lightingQty = lightingQty -1" +
            " WHERE userId = " + parseInt(userId), function () {
        });
    };

    this.giveAHummer = function (userId, count) {
        DB.query("UPDATE " + tableName + "" +
            " SET hummerQty = hummerQty + " + parseInt(count) +
            " WHERE userId = " + parseInt(userId), function () {
        });
    };

    this.giveAGold = function (userId, count) {
        DB.query("UPDATE " + tableName + "" +
            " SET goldQty = goldQty+ " + parseInt(count) +
            " WHERE userId = " + parseInt(userId), function () {
        });
    };

    this.giveAShuffle = function (userId, count) {
        DB.query("UPDATE " + tableName + "" +
            " SET shuffleQty = shuffleQty + " + parseInt(count) +
            " WHERE userId = " + parseInt(userId), function () {
        });
    };

    this.giveALighting = function (userId, count) {
        DB.query("UPDATE " + tableName + "" +
            " SET lightingQty = lightingQty + " + parseInt(count) +
            " WHERE userId = " + parseInt(userId), function () {
        });
    };
};

/**
 * Статичный класс.
 * @type {DataStuff}
 */
DataStuff = new DataStuff();

DataStuff.depends = ['Logs', 'Profiler', 'DB'];