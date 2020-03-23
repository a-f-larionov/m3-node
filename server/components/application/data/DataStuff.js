var AsyncLock = require('async-lock');
var LOCK = new AsyncLock();

DataStuff = function () {

    let tableName = 'users_stuff';

    let fromDBToData = function (data) {
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

    let incrementStuff = function (fieldName, userId, quantity, tid) {
        LOCK.acquire('stuff-' + userId + "-" + fieldName, function (done) {
            setTimeout(done, 5 * 60 * 1000);
            DB.query("UPDATE " + tableName + "" +
                " SET `" + fieldName + "` = `" + fieldName + "` + " + parseInt(quantity) +
                " WHERE `userId` = " + parseInt(userId), function (data) {
                Logs.log("vk_stuff tid:" + tid + " uid:"
                    + userId + " " + fieldName + " +" + quantity + " " + data.affectedRows + " " + data.changedRows,
                    Logs.LEVEL_NOTIFY, undefined, Logs.CHANNEL_VK_STUFF);
                done();
            });
        });
    };

    let decrementStuff = function (fieldName, userId, quantity, tid, callback) {
        LOCK.acquire('stuff-' + userId + "-" + fieldName, function (done) {
            setTimeout(done, 5 * 60 * 1000);

            DB.query("SELECT `" + fieldName + "`" +
                " FROM `" + tableName + "`" +
                " WHERE `userId` = " + parseInt(userId), function (data) {

                if (data[0][fieldName] < quantity) {
                    Logs.log("No more stuff `" + fieldName + "` !", Logs.LEVEL_WARNING, {
                        userId: userId,
                        quantity: quantity,
                        goldQty: data[0][fieldName]
                    });
                    Logs.log("vk_stuff tid:" + tid + " uid:" + userId + " " + fieldName
                        + " -" + quantity + " CANCEL", Logs.LEVEL_NOTIFY, data, Logs.CHANNEL_VK_STUFF);
                    done();
                    if (callback) callback(false);
                    return;
                }

                DB.query("UPDATE `" + tableName + "`" +
                    " SET `" + fieldName + "` = `" + fieldName + "` -" + parseInt(quantity) +
                    " WHERE `userId` = " + parseInt(userId), function () {
                    Logs.log("vk_stuff tid:" + tid + " uid:" + userId + " "
                        + fieldName + " -" + quantity + " OK", Logs.LEVEL_NOTIFY, undefined, Logs.CHANNEL_VK_STUFF);
                    done();
                    if (callback) callback(true);
                });
            });
        });
    };

    this.usedGold = function (userId, quantity, tid, callback) {
        decrementStuff('goldQty', userId, quantity, tid, callback)
    };

    this.usedHummer = function (userId, tid, callback) {
        decrementStuff('hummerQty', userId, 1, tid, callback)
    };

    this.usedShuffle = function (userId, tid, callback) {
        decrementStuff('shuffleQty', userId, 1, tid, callback)
    };

    this.usedLighting = function (userId, tid, callback) {
        decrementStuff('lightingQty', userId, 1, tid, callback)
    };

    this.giveAGold = function (userId, quantity, tid) {
        incrementStuff('goldQty', userId, quantity, tid);
    };

    this.giveAHummer = function (userId, quantity, tid) {
        incrementStuff('hummerQty', userId, quantity, tid);
    };

    this.giveAShuffle = function (userId, quantity, tid) {
        incrementStuff('shuffleQty', userId, quantity, tid);
    };

    this.giveALighting = function (userId, quantity, tid) {
        incrementStuff('lightingQty', userId, quantity, tid);
    };
};

/**
 * Статичный класс.
 * @type {DataStuff}
 */
DataStuff = new DataStuff();

DataStuff.depends = ['Logs', 'Profiler', 'DB'];