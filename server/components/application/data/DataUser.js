//const LogicTimeServer = require("../../application/logic/LogicTimeServer.js").LogicTimeServer
/**
 * @type {DataUser}
 */
var DataUser = function () {

    let tableName = 'users';

    let fromDBToData = function (data) {
        if (!data) return data;
        if (data.id) data.id = parseInt(data.id);
        if (data.socNetTypeId) data.socNetTypeId = parseInt(data.socNetTypeId);
        if (data.socNetUserId) data.socNetUserId = parseInt(data.socNetUserId);
        return data;
    };

    let autoIncrementValue = null;

    this.init = function (afterInitCallback) {
        DB.query("SELECT MAX(id) as maxId FROM users",

            function (rows) {
                if (rows === undefined) {
                    autoIncrementValue = 1;
                } else {
                    autoIncrementValue = rows[0].maxId + 1;
                }
                Logs.log("users.autoincrementId:" + autoIncrementValue, Logs.LEVEL_DEBUG, rows);
                afterInitCallback();
            });
    };

    /**
     * Вернуть пользователя по данным из соцаильной сети
     * @param socNetTypeId тип социальнйо сети SocNet.TYPE_*
     * @param socNetUserId id пользователя в социальной сети.
     * @param callback
     */
    this.getBySocNet = function (socNetTypeId, socNetUserId) {
        return new Promise(function (resolve, reject) {
            DB.queryWhere(tableName, {
                socNetTypeId: [socNetTypeId],
                socNetUserId: [socNetUserId]
            }, function (rows) {
                if (rows === undefined) {
                    return resolve(null);
                } else {
                    resolve(fromDBToData(rows[0]) || null);
                }
            });
        })
    };

    /**
     * Возвращает внутренние id-шники по их id в социальной сети.
     * Отсортировано по point
     * @param socNetTypeId
     * @param socNetUserIds
     * @param callback
     */
    this.getUserIdsBySocNet = function (socNetTypeId, socNetUserIds, callback) {
        let query;
        if (socNetUserIds.length === 0) return callback([]);
        query = "SELECT id FROM " + tableName + " WHERE ";
        query += " socNetTypeId = " + DB.escape(socNetTypeId);
        query += " AND socNetUserId IN ( " + DB.escape(socNetUserIds) + " ) ";
        query += " ORDER BY nextPointId DESC ";
        //if (limit) query += " LIMIT " + DB.escape(limit);

        DB.query(query, function (rows) {
            let ids = [];
            rows.forEach(function (row) {
                ids.push(row.id);
            });
            callback(ids);
        });
    };

    let cache = {};
    /**
     * Вернуть пользователя по id.
     * @param userId внутрений id пользовтаеля.
     * @param callback
     */
    this.getById = function (userId, callback) {
        if (cache[userId]) {
            callback(cache[userId]);
            return;
        }
        DB.queryWhere(tableName, {
            id: [userId]
        }, function (rows) {
            cache[userId] = fromDBToData(rows[0]) || null;
            callback(cache[userId]);
        });
    };

    /**
     * Вернуть пользователя по id.
     * @param ids внутрений id пользовтаеля.
     * @param callback
     */
    this.getList = function (ids, callback, queryAdd) {
        if (!ids.length) return callback([]);
        //@todo no cache cheked?!
        DB.queryWhere(tableName, {
            id: [ids, DB.WHERE_IN]
        }, function (rows) {
            if (!rows) return callback([]);
            rows.forEach(function (row, i) {
                cache[row.id] = fromDBToData(row) || null;
                rows[i] = cache[row.id];
            });
            callback(rows);
        }, queryAdd);
    };

    let waitForCreateBySocNet = [];
    /**
     * Создать пользователя по данным из социальной сети.
     * @param socNetTypeId id социальной сети SocNet.TYPE_*
     * @param socNetUserId id в социальнйо сети.
     * @param callback
     */
    // this.createFromSocNet = function (socNetTypeId, socNetUserId, callback) {
    //     /** Предотвращение двойной мгновенной регистрации. */
    //     if (waitForCreateBySocNet[socNetUserId]) return;
    //     waitForCreateBySocNet[socNetUserId] = true;
    //     let user = {
    //         id: autoIncrementValue++,
    //         socNetTypeId: parseInt(socNetTypeId),
    //         socNetUserId: parseInt(socNetUserId),
    //         create_tm: LogicTimeServer.getTime(),
    //         login_tm: LogicTimeServer.getTime(),
    //         //@todo is not current, is it next point id
    //         nextPointId: 1,
    //     };
    //     LogicHealth.setMaxHealth(user);
    //     cache[user.id] = user;
    //     callback(user);
    //     //create user here
    //     //DataPoints.updateUsersPoints(user.id, 0, 0);
    //     DB.insert(tableName, user, function (result) {
    //         if (result.insertId !== user.id) {
    //             Logs.log("DataUser.createFromSocNet. result.insertId != user.id",
    //                 Logs.LEVEL_ERROR, {
    //                 user: user,
    //                 autoIncrementValue: autoIncrementValue,
    //                 result: result
    //             }
    //             );
    //         }
    //         delete waitForCreateBySocNet[socNetUserId];
    //     });
    // };

    /**
     * Возвращает список юзеров по параметрам.
     * @param where {object} фильтр.
     * @param callback
     */
    this.getListWhere = function (where, callback) {
        DB.queryWhere(tableName, where, function (rows) {
            callback(rows);
        });
    };

    /**
     * Сохраняет юзера.
     * @param user {Object}
     * @param callback {Function}
     */
    this.save = function (user, callback) {
        let data;
        cache[user.id] = user;
        data = {
            id: user.id,
            socNetTypeId: user.socNetTypeId,
            socNetUserId: user.socNetUserId,
            create_tm: user.create_tm,
            login_tm: user.login_tm,
            nextPointId: user.nextPointId
        };
        callback(user);
        DB.update(tableName, data, function (result) {
        });
    };

    /**
     * Обновить данные о последнем выходе игрока.
     * @param userId {int} внутрений id пользователя.
     */
    this.clearCache = function (userId) {
        if (!userId) {
            Logs.log("DataUser.clearCache. Must be userId", Logs.LEVEL_WARN, userId);
            return;
        }
        if (cache[userId]) {
            cache[userId] = null;
        }
    };

    /**
     * Обновить данные о последнем входе игрока.
     * @param userId {int} внутрений id пользователя.
     */
    // this.cacheUpdateLastLogin = function (userId) {
    //     let time;
    //     if (!userId) {
    //         Logs.log("DataUser.cacheUpdateLastLogin. Must be userId", Logs.LEVEL_WARN, userId);
    //         return;
    //     }
    //     if (cache[userId]) {
    //         cache[userId].login_tm = time;
    //     }
    // };

    this.updateNextPointId = function (userId, pointId, callback) {
        if (cache[userId]) {
            cache[userId].nextPointId = pointId;
        }
        DB.query("UPDATE " + tableName + " SET nextPointId = " + pointId + " WHERE id = " + userId, callback);
    };

    this.updateHealthAndStartTime = function (user, callback) {
        if (cache[user.id]) {
            cache[user.id].fullRecoveryTime = user.fullRecoveryTime;
        }
        DB.query("UPDATE " + tableName +
            " SET fullRecoveryTime = " + user.fullRecoveryTime +
            " WHERE id = " + user.id, callback);
    };

    this.updateUserAgentString = function (userId, string) {
        DB.query(
            "INSERT INTO user_agents (`uid`, `agent`) VALUES " +
            "( " + parseInt(userId) +
            ", " + DB.escape(string) + "" +
            " )", function () {
            }
        )
    }
};

DataUser = new DataUser();
DataUser.depends = ['Logs', 'Profiler', 'DB'];
global["DataUser"] = DataUser;
module.exports = { DataUser };