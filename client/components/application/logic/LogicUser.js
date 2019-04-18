LogicUser = function () {
    var self = this;

    /**
     * Id пользователя под которым мы сидим.
     */
    var authorizedUserId = null;

    /**
     * Тут мы будем хранить данные пользователей.
     * @type {Array}
     */
    var users = [];

    let friendIds = null;

    let friendsByMapId = [];

    /**
     * Авторизация пользователя.
     */
    this.authorize = function () {
        var socNetUserId, authParams;
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
        Logs.log("Authorization success. userId:" + userId, Logs.LEVEL_NOTIFY);
        waitForLoadingUser = [];
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
            /* некоторая заглушка */
            return getDummy();
        }
    };

    this.getList = function (ids) {
        let out;
        out = [];
        if (!ids) return out;
        ids.forEach(function (id) {
            if (self.getById(id).photo50) {
                out.push(self.getById(id));
            }
        });
        return out;
    };

    var getDummy = function () {
        return {
            id: null,
            online: false
        };
    };

    /**
     * Запомним, чьи загрузки мы уже ждём, что бы не повторять лишних запросов.
     * @type {Array}
     */
    var waitForLoadingUser = [];

    /**
     * Загрузить данные о пользователе.
     * @param userId {int}
     */
    this.loadUserInfoById = function (userId) {
        if (authorizedUserId === null) {
            return;
        }
        if (!waitForLoadingUser[userId]) {
            waitForLoadingUser[userId] = true;
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
        waitForLoadingUser[user.id] = false;
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

    this.isFriendIdsLoaded = false;

    this.setFriendIds = function (ids) {
        self.isFriendIdsLoaded = true;
        friendIds = ids;
        PageController.redraw();
    };

    let friendIdsLoading = false;

    this.getFriendIds = function (limit) {
        if (!friendIds && !friendIdsLoading) {
            //  - запросить друзей у ВК
            friendIdsLoading = true;
            SocNet.getFriendIds(function (ids) {
                SAPIUser.sendMeUserIdsBySocNet(ids);
            });
            return null;
        }
        if (!friendIds) return null;
        if (limit) return friendIds.slice(0, limit);
        return friendIds;
    };

    this.setFriendIdsByMapId = function (mapId, uids) {
        friendsByMapId[mapId] = uids;
        PageController.redraw();
    };

    let mapsFriendsLoadings = [];
    let loadMapFriends = function (mapId) {
        if (!mapId) mapId = currentMapId;
        if (!LogicUser.getFriendIds()) return;
        if (!mapsFriendsLoadings[mapId]) {
            mapsFriendsLoadings[mapId] = true;
            SAPIMap.sendMeMapFriends(mapId, LogicUser.getFriendIds());
        }
    };

    this.getFriendIdsByMapId = function (mapId) {
        if (!friendsByMapId[mapId]) {
            loadMapFriends(mapId);
        }
        return friendsByMapId[mapId];
    };

    this.onTurnsLoose = function () {
        users[authorizedUserId].health--;
        SAPIUser.onTurnsLoose();
    };

    this.getHealthTime = function () {

    };


    this.getMaxHealth = function () {
        return 5;
    };

    this.getHealthRecoveryTime = function () {
        // @todo нужны общие настройки
        return 60 * 0.1;
    };

    this.clearHealthCheckFlag = function () {
        checkHealthFlag = false;
    };

    let checkHealthFlag = false;

    this.checkHealth = function () {
        let recoveryTime, healthStartTime, now, left, healthToUp, maxHealth, user;
        user = LogicUser.getCurrentUser();
        maxHealth = LogicUser.getMaxHealth();
        if (user.health < maxHealth) {
            recoveryTime = LogicUser.getHealthRecoveryTime();
            healthStartTime = user.healthStartTime / 1000;
            now = LogicTimeClient.getTime();
            left = recoveryTime - (now - healthStartTime);
            if (left > 0) return;

            healthToUp = Math.min(
                Math.floor(Math.abs((now - healthStartTime) / recoveryTime)),
                (maxHealth - user.health)
            );
            users[user.id].health += healthToUp;

            if (users[user.id].health < maxHealth) {
                user.healthStartTime += (recoveryTime * healthToUp) * 1000;
            }

            PageController.redraw();
            console.log('here', left, checkHealthFlag);
            if (left <= 0 && !checkHealthFlag) {
                checkHealthFlag = true;
                SAPIUser.checkHealth();
            }
        }
    };
};

/**
 * Статичный класс.
 * @type {LogicUser}
 */
LogicUser = new LogicUser();
