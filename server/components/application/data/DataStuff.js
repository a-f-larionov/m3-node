let AsyncLock = require('async-lock');
let LOCK = new AsyncLock();

/**
 * @type {DataStuff}
 * @constructor
 */
DataStuff = function () {

    this.STUFF_LIGTNING = 'lightningQty';
    this.STUFF_HUMMER = 'hummerQty';
    this.STUFF_SHUFFLE = 'shuffleQty';
    this.STUFF_GOLD = 'goldQty';

    let tableName = 'users_stuff';

    let fromDBToData = function (data) {
        if (!data) return data;
        if (data.userId) data.userId = parseInt(data.userId);
        if (data.hummerQty) data.hummerQty = parseInt(data.hummerQty);
        if (data.shuffleQty) data.shuffleQty = parseInt(data.shuffleQty);
        if (data.lightningQty) data.lightningQty = parseInt(data.lightningQty);
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
            lightningQty: 0,
            goldQty: 0
        };
        DB.insert(tableName, data, function (result) {
            // result = {"fieldCount":0,"affectedRows":1,"insertId":0,"serverStatus":2,"warningCount":0,"message":"","protocol41":true,"changedRows":0}
            callback(data);
        });
    };

    let incrementStuff = function (fieldName, userId, quantity, tid, callback) {
        LOCK.acquire(Keys.stuff(userId, fieldName), function (done) {
            setTimeout(done, 5 * 60 * 1000);
            DB.query("UPDATE " + tableName + "" +
                " SET `" + fieldName + "` = `" + fieldName + "` + " + parseInt(quantity) +
                " WHERE `userId` = " + parseInt(userId), function (data) {
                Logs.log("vk_stuff tid:" + tid + " uid:"
                    + userId + " " + fieldName + " +" + quantity + " " + data.affectedRows + " " + data.changedRows,
                    Logs.LEVEL_NOTIFY, undefined, Logs.CHANNEL_VK_STUFF);

                if (callback) callback();
                done();
            });
        });
    };

    let decrementStuff = function (fieldName, userId, quantity, tid, callback) {
        LOCK.acquire(Keys.stuff(userId, fieldName), function (done) {
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
        decrementStuff(DataStuff.STUFF_GOLD, userId, quantity, tid, callback)
    };

    this.usedHummer = function (userId, tid, callback) {
        decrementStuff(DataStuff.STUFF_HUMMER, userId, 1, tid, callback)
    };

    this.usedShuffle = function (userId, tid, callback) {
        decrementStuff(DataStuff.STUFF_SHUFFLE, userId, 1, tid, callback)
    };

    this.usedLightning = function (userId, tid, callback) {
        decrementStuff(DataStuff.STUFF_LIGTNING, userId, 1, tid, callback)
    };

    this.giveAGold = function (userId, quantity, tid) {
        incrementStuff(DataStuff.STUFF_GOLD, userId, quantity, tid);
    };

    this.giveAHummer = function (userId, quantity, tid, callback) {
        incrementStuff(DataStuff.STUFF_HUMMER, userId, quantity, tid, callback);
    };

    this.giveAShuffle = function (userId, quantity, tid, callback) {
        incrementStuff(DataStuff.STUFF_SHUFFLE, userId, quantity, tid, callback);
    };

    this.giveALightning = function (userId, quantity, tid, callback) {
        incrementStuff(DataStuff.STUFF_LIGTNING, userId, quantity, tid, callback);
    };
};

/**
 * Статичный класс.
 * @type {DataStuff}
 */
DataStuff = new DataStuff();

DataStuff.depends = ['Logs', 'Profiler', 'DB'];