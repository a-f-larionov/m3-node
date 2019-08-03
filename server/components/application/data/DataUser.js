DataUser = function () {

    var tableName = 'users';

    var fromDBToData = function (data) {
        if (!data) return data;
        if (data.id) data.id = parseInt(data.id);
        if (data.socNetTypeId) data.socNetTypeId = parseInt(data.socNetTypeId);
        if (data.socNetUserId) data.socNetUserId = parseInt(data.socNetUserId);
        return data;
    };

    var autoIncrementValue = null;

    this.init = function (afterInitCallback) {
        DB.query("SELECT `AUTO_INCREMENT` as autoIncrement FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = '" + Config.DB.database + "' AND TABLE_NAME   = '" + tableName + "';", function (rows) {
            autoIncrementValue = rows[0].autoIncrement;
            Logs.log("users.autoincrementId:" + autoIncrementValue, Logs.LEVEL_NOTIFY);
            afterInitCallback();
        });
    };

    /**
     * Вернуть пользователя по данным из соцаильной сети
     * @param socNetTypeId тип социальнйо сети SocNet.TYPE_*
     * @param socNetUserId id пользователя в социальной сети.
     * @param callback
     */
    this.getBySocNet = function (socNetTypeId, socNetUserId, callback) {
        DB.queryWhere(tableName, {
            socNetTypeId: [socNetTypeId],
            socNetUserId: [socNetUserId]
        }, function (rows) {
            callback(fromDBToData(rows[0]) || null);
        });
    };

    /**
     * Возвращает внутрение id-шники по их id в социальной сети.
     * Отсортировано по point
     * @param socNetTypeId
     * @param socNetUserIds
     * @param callback
     */
    this.getUserIdsBySocNet = function (socNetTypeId, socNetUserIds, callback) {
        let query;
        query = "SELECT id FROM " + tableName + " WHERE ";
        query += " socNetTypeId = " + DB.escape(socNetTypeId);
        query += " AND socNetUserId IN ( " + DB.escape(socNetUserIds) + " ) ";
        query += " ORDER BY currentPoint DESC";

        DB.query(query, function (rows) {
            let ids = [];
            rows.forEach(function (row) {
                ids.push(row.id);
            });
            callback(ids);
        });
    };

    var cache = {};
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

    var waitForCreateBySocNet = [];
    /**
     * Создать пользователя по данным из социальной сети.
     * @param socNetTypeId id социальной сети SocNet.TYPE_*
     * @param socNetUserId id в социальнйо сети.
     * @param callback
     */
    this.createFromSocNet = function (socNetTypeId, socNetUserId, callback) {
        /* Предотвращение двойной мгновенной регистрации. */
        if (waitForCreateBySocNet[socNetUserId]) return;
        waitForCreateBySocNet[socNetUserId] = true;
        var user = {
            id: autoIncrementValue++,
            socNetTypeId: parseInt(socNetTypeId),
            socNetUserId: parseInt(socNetUserId),
            createTimestamp: new Date().getTime(),
            lastLoginTimestamp: new Date().getTime(),
            currentPoint: 1,
            health: LogicUser.getMaxHealth(),
        };
        cache[user.id] = user;
        callback(user);
        DB.insert(tableName, user, function (result) {
            if (result.insertId != user.id) {
                Logs.log("DataUser.createFromSocNet. result.insertId != user.id", Logs.LEVEL_FATAL_ERROR);
            }
            delete waitForCreateBySocNet[socNetUserId];
        });
    };

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
        var data;
        cache[user.id] = user;
        data = {
            id: user.id,
            socNetTypeId: user.socNetTypeId,
            socNetUserId: user.socNetUserId,
            createTimestamp: user.createTimestamp,
            lastLoginTimestamp: user.lastLoginTimestamp,
            currentPoint: user.currentPoint
        };
        callback(user);
        DB.update(tableName, data, function (result) {
        });
    };

    /**
     * Обновить данные о последнем выходе игрока.
     * @param userId {int} внутрений id пользователя.
     */
    this.updateLastLogout = function (userId) {
        if (!userId) {
            Logs.log("DataUser.udpateLastLogout. Must be userId", Logs.LEVEL_WARNING, userId);
            return;
        }
        if (cache[userId]) {
            cache[userId] = null;
        }
        DB.query("UPDATE " + tableName + " SET lastLogoutTimestamp = " + (new Date().getTime()) + " WHERE id = " + userId, function () {
        });
    };

    /**
     * Обновить данные о последнем входе игрока.
     * @param userId {int} внутрений id пользователя.
     */
    this.updateLastLogin = function (userId) {
        if (!userId) {
            Logs.log("DataUser.udpateLastLogin. Must be userId", Logs.LEVEL_WARNING, userId);
            return;
        }
        let time = (new Date().getTime());
        if (cache[userId]) {
            cache[userId].lastLoginTimestamp = time;
        }
        DB.query("UPDATE " + tableName + " SET lastLoginTimestamp = " + time + " WHERE id = " + userId, function () {
        });
    };

    this.updateCurrentPoint = function (userId, pointId, callback) {
        if (cache[userId]) {
            cache[userId].currentPoint = pointId;
        }
        DB.query("UPDATE " + tableName + " SET currentPoint = " + pointId + " WHERE id = " + userId, callback);
    };

    this.updateHealth = function (userId, health, callback) {
        if (cache[userId]) {
            cache[userId].health = health;
        }
        DB.query("UPDATE " + tableName +
            " SET health = " + health +
            " WHERE id = " + userId, callback);
    };

    this.updateHealthAndStartTime = function (userId, health, healthStartTime, callback) {
        if (cache[userId]) {
            cache[userId].health = health;
            cache[userId].healthStartTime = healthStartTime;
        }
        DB.query("UPDATE " + tableName +
            " SET health = " + health +
            " , healthStartTime = " + healthStartTime +
            " WHERE id = " + userId, callback);
    };
};

/**
 * Статичный класс.
 * @type {DataUser}
 */
DataUser = new DataUser();

DataUser.depends = ['Logs', 'Profiler', 'DB'];