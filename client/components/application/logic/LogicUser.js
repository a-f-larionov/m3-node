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
     * Запомним, чьи загрузки мы уже ждём, чтобы не повторять лишних запросов.
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

    this.getMapFriendIds = function (mapId) {
        let chunks;
        if (!getFriendIds()) return null;
        if (!mapId) return null;
        if (!mapFriendIds[mapId]) mapFriendIds[mapId] = {ids: []};
        if (!mapFriendIds[mapId].loading && (mapFriendIds[mapId].loading = true)) {
            chunks = chunkIt(getFriendIds());
            mapFriendIds[mapId].chunksCount = chunks.length;
            chunks.forEach(function (chunk) {
                SAPIUser.sendMeMapFriends(mapId, chunk);
            });
        }
        if (!mapFriendIds[mapId].complete) return null;
        return mapFriendIds[mapId].ids;
    };

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
        mapFriendIds[mapId].chunksCount--;
        mapFriendIds[mapId].ids = mapFriendIds[mapId].ids.concat(fids);
        if (mapFriendIds[mapId].chunksCount === 0) {
            mapFriendIds[mapId].complete = true;
            PageController.redraw();
        }
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

    let pointTopScore = {};

    this.getPointTopScore = function (pointId) {
        let fids, chunks;
        if (!(fids = getFriendIds())) return undefined;

        if (!pointTopScore[pointId]) pointTopScore[pointId] = {top: {pos: -Infinity}};
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

        if (pointTopScore[pid].top.pos < top.pos) {
            pointTopScore[pid].top = top;
        }
        pointTopScore[pid].chunksCount--;
        if (pointTopScore[pid].chunksCount === 0) {
            pointTopScore[pid].complete = true;
            PageController.redraw();
        }
    };

    this.flushPointTopScore = function (pid, uid) {
        if (pointTopScore[pid]) pointTopScore[pid][uid] = undefined;
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