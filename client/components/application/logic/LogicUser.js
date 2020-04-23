let LogicUser = function () {
    let self = this;

    /**
     * Id пользователя под которым мы сидим.
     */
    let authorizedUserId = null;

    /**
     * Тут мы будем хранить данные пользователей.
     * @type {Array}
     */
    let users = [];

    let friendIds = null;

    /**
     * Авторизация пользователя.
     */
    this.authorize = function () {
        let socNetUserId, authParams;
        socNetUserId = SocNet.getSocNetUserId();
        authParams = SocNet.getAuthParams();
        switch (SocNet.getType()) {
            case SocNet.TYPE_VK:
                SAPIUser.authorizeByVK(socNetUserId, authParams);
                break;
            case SocNet.TYPE_STANDALONE:
                SAPIUser.authorizeByStandalone(socNetUserId, authParams);
                break;
            default:
                Logs.log("Wrong soc net type", Logs.LEVEL_FATAL_ERROR);
                break;
        }
    };

    /**
     * Метод для обработки ответа от сервера об успешной авторизации.
     * @param user
     */
    this.authorizeSuccess = function (userId) {
        authorizedUserId = userId;
        pendingIds = {};
        LogicMain.onAuthorizeSuccess();
    };

    /**
     * Авторизован ли текущий юзер.
     * @returns {Boolean}
     */
    this.isAuthorized = function () {
        return !!authorizedUserId;
    };

    /**
     * Возвращает текущего(авторизованного пользователя).
     * @returns {null|Object}
     */
    this.getCurrentUser = function () {
        return this.getById(authorizedUserId);
    };

    /**
     * Получить данные пользователя по его id.
     * @param id
     * @returns {null|Object}
     */
    this.getById = function (id) {
        if (users[id]) {
            return users[id];
        } else {
            self.loadUserInfoById(id);
            /** Некоторая заглушка */
            return getDummy();
        }
    };

    this.getList = function (ids) {
        let out, toLoadIds;
        out = [];
        if (!ids || !ids.length) return out;
        toLoadIds = [];
        ids.forEach(function (id) {
            if (!users[id] && !pendingIds[id]) {
                pendingIds[id] = true;
                users[id] = false;
                toLoadIds.push(id);
            }
        });
        if (toLoadIds.length) {
            SAPIUser.sendMeUserListInfo(toLoadIds);
        }

        ids.forEach(function (id) {
            if (self.getById(id).photo50) {
                out.push(self.getById(id));
            }
        });
        return out;
    };

    let getDummy = function () {
        return {
            id: null,
            online: false
        };
    };

    /**
     * Запомним, чьи загрузки мы уже ждём, что бы не повторять лишних запросов.
     * @type {Object}
     */
    let pendingIds = {};

    /**
     * Загрузить данные о пользователе.
     * @param userId {int}
     */
    this.loadUserInfoById = function (userId) {
        if (authorizedUserId === null) {
            return;
        }
        if (!pendingIds[userId]) {
            pendingIds[userId] = true;
            SAPIUser.sendMeUserInfo(userId);
        }
    };

    /**
     * Обновить данные о пользователе.
     * Обновит\создаст, только переданные поля!
     * При создании, создаются дефолтовые поля: firstName: '', lastName: '',
     * @param user {Object}
     */
    this.updateUserInfo = function (user) {
        pendingIds[user.id] = false;
        if (!users[user.id]) {
            users[user.id] = getDummy();
        }
        for (let field in user) {
            users[user.id][field] = user[field];
        }
        if (!users[user.id].photo50) {
            SocNet.getUserInfo(user.socNetUserId, function (data) {
                users[user.id].photo50 = data[0].photo_50;
                users[user.id].photo100 = data[0].photo_100;
                users[user.id].firstName = data[0].first_name;
                users[user.id].lastName = data[0].last_name;
                PageController.redraw();
            });
        }
        PageController.redraw();
    };

    this.setFriendIds = function (ids) {
        friendIds = ids;
        PageController.redraw();
    };

    let friendIdsLoading = false;

    this.getFriendIds = function (limit) {
        //@todo only panel, sorted by score
        if (!friendIds && !friendIdsLoading) {
            /** Запросить друзей у ВК */
            friendIdsLoading = true;
            SocNet.getFriendIds(function (ids) {
                SAPIUser.sendMeUserIdsBySocNet(ids/*,limit*/);
            });
            return null;
        }
        if (!friendIds) return null;
        if (limit) return friendIds.slice(0, limit);
        return friendIds;
    };

    this.getMapFriendIds = function (mapId) {
        let points;
        if (this.getFriendIds()) {
            points = DataPoints.getPointsByMapId(mapId);

            friendIds.forEach(function (friendId) {

            });
        }
        return null;
    };

    let mapsFriendsLoadings = [];

    let loadFriendsScoreByMapId = function (mapId) {
        if (!mapId) mapId = currentMapId;
        if (!LogicUser.getFriendIds()) return;
        if (!mapsFriendsLoadings[mapId]) {
            mapsFriendsLoadings[mapId] = true;
            SAPIMap.sendMeUsersScore(mapId, LogicUser.getFriendIds());
        }
    };

    this.getFriendIdsByMapId = function (mapId) {
        let lpid, fpid, ids;
        if (this.getFriendIds()) {
            fpid = DataMap.getFirstPointId();
            lpid = DataMap.getLastPointId();
            // get every friendIds
            ids = this.getList(friendIds)
                .filter(function (user) {
                    return user.nextPointId >= fpid && user.nextPointId <= lpid;
                }).map(function (user) {
                    return user.id;
                });
            //@todo не очень краисо загружать это здесь)
            loadFriendsScoreByMapId(mapId, ids);
            return ids;
        } else {
            return [];
        }
    };

    /**
     * Возвращает id игроков-друзей на этой точке.
     * @param mapId
     * @param pointId
     * @param widthCurrentUser
     * @returns {Array|Uint8Array|BigInt64Array|*[]|Float64Array|Int8Array|Float32Array|Int32Array|Uint32Array|Uint8ClampedArray|BigUint64Array|Int16Array|Uint16Array}
     */
    this.getFriendIdsByMapIdAndPointIdWithScore = function (mapId, pointId, widthCurrentUser) {
        let ids, users, gamers, currentUserId;
        //return LogicUser.getList([1,2,3]);
        gamers = [];
        ids = LogicUser.getFriendIdsByMapId(mapId);
        currentUserId = LogicUser.getCurrentUser().id;
        if (widthCurrentUser) {
            ids.push(currentUserId);
        }
        if (ids) {
            users = LogicUser.getList(ids);
        }
        if (users) {
            gamers = users
                .filter(function (user, i) {
                    if (!widthCurrentUser && currentUserId === user.id) return false;
                    /** Remove duplicates */
                    if (users.indexOf(user) !== i) return false;
                    return user.nextPointId >= pointId;
                })
                .sort(function (a, b) {
                    return b.lastLoginTimestamp - a.lastLoginTimestamp;
                })
                .map(function (user) {
                    return user;
                });
        }
        return gamers;
    };
}
;

/**
 * Статичный класс.
 * @type {LogicUser}
 */
LogicUser = new LogicUser();

/** Alias **/
LU = LogicUser;