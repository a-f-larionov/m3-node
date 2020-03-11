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

    let incrementStuff = function (fieldName, userId, quantity) {
        Logs.log("vk_stuff inc start", Logs.LEVEL_NOTIFY, {fieldName: fieldName, userId: userId, quantity: quantity});
        Logs.log("vk_stuff inc start", Logs.LEVEL_NOTIFY, {
            fieldName: fieldName,
            userId: userId,
            quantity: quantity
        }, Logs.CHANNEL_VK_STUFF);
        DB.query("UPDATE " + tableName + "" +
            " SET `" + fieldName + "` = `" + fieldName + "` + " + parseInt(quantity) +
            " WHERE `userId` = " + parseInt(userId), function (data) {
            Logs.log("vk_stuff inc ok ", Logs.LEVEL_NOTIFY, {
                fieldName: fieldName,
                userId: userId,
                quantity: quantity,
                affectedRows: data.affectedRows,
                changedRows: data.changedRows
            });
            Logs.log("vk_stuff inc ok", Logs.LEVEL_NOTIFY, {
                fieldName: fieldName,
                userId: userId,
                quantity: quantity,
                affectedRows: data.affectedRows,
                changedRows: data.changedRows
            }, Logs.CHANNEL_VK_STUFF);
        });
    };

    let decrementStuff = function (fieldName, userId, quantity, callback) {
        Logs.log("vk_stuff dec start", Logs.LEVEL_NOTIFY, arguments);
        Logs.log("vk_stuff dec start", Logs.LEVEL_NOTIFY, arguments, Logs.CHANNEL_VK_STUFF);
        DB.beginTransaction(function (connection) {

            DB.query("SELECT `" + fieldName + "`" +
                " FROM `" + tableName + "`" +
                " WHERE `userId` = " + parseInt(userId), function (data) {

                if (data[0][fieldName] < quantity) {
                    Logs.log("No more stuff `" + fieldName + "` !", Logs.LEVEL_WARNING, {
                        userId: userId,
                        quantity: quantity,
                        goldQty: data[0][fieldName]
                    });
                    Logs.log("vk_stuff dec rollback", Logs.LEVEL_NOTIFY, {
                        fieldName:fieldName,
                        userId:userId,
                        quantity:quantity,
                        affectedRows: data.affectedRows,
                        changedRows: data.changedRows
                    });
                    Logs.log("vk_stuff dec rollback", Logs.LEVEL_NOTIFY, {
                        fieldName:fieldName,
                        userId:userId,
                        quantity:quantity,
                        affectedRows: data.affectedRows,
                        changedRows: data.changedRows
                    }, Logs.CHANNEL_VK_STUFF);
                    connection.rollback();
                    callback(false);
                    return;
                }

                DB.query("UPDATE `" + tableName + "`" +
                    " SET `" + fieldName + "` = `" + fieldName + "` -" + parseInt(quantity) +
                    " WHERE `userId` = " + parseInt(userId), function () {
                    Logs.log("vk_stuff dec ok ", Logs.LEVEL_NOTIFY, arguments);
                    Logs.log("vk_stuff dec ok ", Logs.LEVEL_NOTIFY, arguments, Logs.CHANNEL_VK_STUFF);
                });
                connection.commit();
                callback(true);
            });
        });
    };

    this.usedGold = function (userId, quantity, callback) {
        decrementStuff('goldQty', userId, quantity, callback)
    };

    this.usedHummer = function (userId, callback) {
        decrementStuff('hummerQty', userId, 1, callback)
    };

    this.usedShuffle = function (userId, callback) {
        decrementStuff('shuffleQty', userId, 1, callback)
    };

    this.usedLighting = function (userId, callback) {
        decrementStuff('lightingQty', userId, 1, callback)
    };


    this.giveAGold = function (userId, quantity) {
        incrementStuff('goldQty', userId, quantity);
    };

    this.giveAHummer = function (userId, quantity) {
        incrementStuff('hummerQty', userId, quantity);
    };

    this.giveAShuffle = function (userId, quantity) {
        incrementStuff('shuffleQty', userId, quantity);
    };

    this.giveALighting = function (userId, quantity) {
        incrementStuff('shuffleQty', userId, quantity);
    };
};

/**
 * Статичный класс.
 * @type {DataStuff}
 */
DataStuff = new DataStuff();

DataStuff.depends = ['Logs', 'Profiler', 'DB'];