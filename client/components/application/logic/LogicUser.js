/**
 * @type {LogicUser}
 * @constructor
 */
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

    let friendIds = [];

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
     * @param userId
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
    this.getCurrent = function () {
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

    let mapFriendIds = {};

    this.setMapFriendIds = function (mapId, fids) {
        let toLoadIds = [];
        fids.forEach(function (id) {
            if (!pendingIds[id]) {
                pendingIds[id] = true;
                toLoadIds.push(id);
            }
        });
        chunkIt(toLoadIds).forEach(function (chunk) {
            SAPIUser.sendMeUserListInfo(chunk);
        });
        mapFriendIds[mapId].ids = fids;
    };

    this.getMapFriendIds = function (mapId) {
        if (!getFriendIds()) return null;
        if (!mapFriendIds[mapId]) mapFriendIds[mapId] = {};
        if (!mapFriendIds[mapId].loading && (mapFriendIds[mapId].loading = true)) {
            SAPIUser.sendMeMapFriends(mapId, getFriendIds());
        }
        return mapFriendIds[mapId].ids;
    };

    let topUsers = [];

    this.getTopUsers = function () {
        let chunks;
        if (!getFriendIds()) return null;
        //@todo only panel, sorted by score
        if (!this.getTopUsers.loading && (this.getTopUsers.loading = true)) {
            chunks = chunkIt(getFriendIds());
            this.getTopUsers.chunksCount = chunks.length;
            chunks.forEach(function (chunk) {
                SAPIUser.sendMeTopUsers(chunk);
            });
        }
        if (!this.getTopUsers.complete) return null;
        return topUsers;
    };

    this.loadTopUsers = function (users) {
        this.getTopUsers.chunksCount--;
        users.forEach(function (user) {
            topUsers[user.id] = user;
        });
        if (this.getTopUsers.chunksCount === 0) {
            topUsers.sort(function (a, b) {
                if (a.nextPointId === b.nextPointId) return 0;
                return a.nextPointId < b.nextPointId ? 1 : -1;
            });
            topUsers = topUsers.slice(0, DataCross.topUsersLimit);
            self.getTopUsers.socInfoCount = DataCross.topUsersLimit;
            //@todo for fast - got users by one request.
            topUsers.forEach(function (user) {
                SocNet.getUserInfo(user.socNetUserId, function (socInfo) {
                    user.photo50 = socInfo[0].photo_50;
                    self.getTopUsers.socInfoCount--;
                    if (self.getTopUsers.socInfoCount === 0) {
                        self.getTopUsers.complete = true;
                        PageController.redraw();
                    }
                });
            });
        }
    };

    let getFriendIds = function () {
        let chunks;
        //@todo only panel, sorted by score
        if (!getFriendIds.loading && (getFriendIds.loading = true)) {
            SocNet.getFriendIds(function (ids) {
                chunks = chunkIt(ids);
                getFriendIds.chunksCount = chunks.length;
                chunks.forEach(function (chunk) {
                    SAPIUser.sendMeUserIdsBySocNet(chunk);
                });
            });
        }
        if (!getFriendIds.complete) return null;
        return friendIds;
    };

    this.loadFriendIds = function (chunkIds) {
        getFriendIds.chunksCount--;
        friendIds = friendIds.concat(chunkIds);
        /** Удаяем самих себя из друзей */
        friendIds.splice(friendIds.indexOf(authorizedUserId), 1);
        if (getFriendIds.chunksCount === 0) {
            getFriendIds.complete = true;
            PageController.redraw();
        }
    };

    this.getPointScores = function () {

        return [];
    };

    let pointTopScore = {};

    this.getPointTopScore = function (pointId) {
        let fids, chunks;
        if (!(fids = getFriendIds())) return undefined;

        if (!pointTopScore[pointId]) pointTopScore[pointId] = {top: {userPosition: -Infinity}};
        if (!pointTopScore[pointId].loading && (pointTopScore[pointId].loading = true)) {
            chunks = chunkIt(fids);
            pointTopScore[pointId].chunksCount = chunks.length;
            chunks.forEach(function (chunk) {
                SAPIMap.sendMePointTopScore(0, pointId, chunk, chunks.length);
            });
        }
        if (!pointTopScore[pointId].complete) return undefined;
        return pointTopScore[pointId].top;
    };

    this.loadPointTopScore = function (pid, top) {
        // предзакгрузка
        let uids;
        uids = [top.place1Uid, top.place2Uid, top.place3Uid].filter(v => !!v);
        if (uids.length) {
            DataPoints.loadScores([pid], uids);
            LogicUser.getList(uids);
        }

        if (pointTopScore[pid].top.userPosition < top.userPosition) {
            pointTopScore[pid].top = top;
        }
        pointTopScore[pid].chunksCount--;
        if (pointTopScore[pid].chunksCount === 0) {
            pointTopScore[pid].complete = true;
            PageController.redraw();
        }
    };

    let mapsFriendsLoadings = [];

    let loadFriendsScoreByMapId = function (mapId) {
        if (!mapId) mapId = currentMapId;
        if (!getFriendIds()) return;
        if (!mapsFriendsLoadings[mapId]) {
            mapsFriendsLoadings[mapId] = true;
            //@todo chunkit
            //SAPIMap.sendMeUsersScore(mapId, getFriendIds());
        }
    };

    this.getFriendIdsByMapId = function (mapId) {
        let lpid, fpid, ids;
        if (getFriendIds()) {
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
     * @param withCurrentUser
     * @returns {Array|Uint8Array|BigInt64Array|*[]|Float64Array|Int8Array|Float32Array|Int32Array|Uint32Array|Uint8ClampedArray|BigUint64Array|Int16Array|Uint16Array}
     */
    this.getFriendIdsByMapIdAndPointIdWithScore = function (mapId, pointId, withCurrentUser) {
        let ids, users, gamers, currentUserId;
        //return LogicUser.getList([1,2,3]);
        gamers = [];
        ids = LogicUser.getFriendIdsByMapId(mapId);
        currentUserId = LogicUser.getCurrent().id;
        if (withCurrentUser) ids.push(currentUserId);

        if (ids) {
            users = LogicUser.getList(ids);
        }
        if (users) {
            gamers = users
                .filter(function (user, i) {
                    if (!withCurrentUser && currentUserId === user.id) return false;
                    /** Remove duplicates */
                    if (users.indexOf(user) !== i) return false;
                    return user.nextPointId >= pointId;
                })
                .sort(function (a, b) {
                    return b.login_tm - a.login_tm;
                })
                .map(function (user) {
                    return user;
                });
        }
        return gamers;
    };

    this.getUserLastMapId = function () {
        return DataMap.getMapIdFromPointId(
            LogicUser.getCurrent().nextPointId
        );
    };

};

/**
 * Статичный класс.
 * @type {LogicUser}
 */
LogicUser = new LogicUser();

/** Alias **/
let LU = LogicUser;