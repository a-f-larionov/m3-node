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
};

DataUser = new DataUser();
DataUser.depends = ['Logs', 'Profiler', 'DB'];
global["DataUser"] = DataUser;
module.exports = { DataUser };