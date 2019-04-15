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

    let friendIds = [];

    let friendsByMapId = [];

    /**
     * По сути кэш
     * @type {null}
     */
    let friends = [];

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
     * @param userId
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
        ids.forEach(function (id) {
            out.push(self.getById(id));
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
        SocNet.getUserInfo(user.socNetUserId, function (data) {
            users[user.id].photo50 = data[0].photo_50;
            users[user.id].photo100 = data[0].photo_100;
            users[user.id].firstName = data[0].first_name;
            users[user.id].lastName= data[0].last_name;
            PageController.redraw();
        });
        PageController.redraw();
    };

    this.setFriendIds = function (ids) {
        friendIds = ids;
        PageController.redraw();
    };

    let friendIdsLoading = false;

    this.getFriendIds = function () {
        if (!friendIds.length && !friendIdsLoading) {
            //  - запросить друзей у ВК
            friendIdsLoading = true;
            SocNet.getFriendIds(function (ids) {
                SAPIUser.sendMeUserIdsBySocNet(ids);
            });
        }
        return friendIds;
    };

    this.getFriends = function () {
        if (!friendIds) return friends;
        if (friends.length === friendIds.length) return friends;
        friends = [];
        friendIds = friendIds.slice(0, 5);
        friendIds.forEach(function (id) {
            let user = LogicUser.getById(id);
            if (user && user.id) friends.push(user);
        });
        return friendIds;
    };

    this.setFriendIdsByMapId = function (mapId, uids) {
        console.log('setFriendIdsByMapId', mapId, uids);
        friendsByMapId[mapId] = uids
    };

    let mapsFriendsLoadings = [];
    let loadMapFriends = function (mapId) {
        if (!mapId) mapId = currentMapId;
        console.log('friends-23');
        if (!LogicUser.getFriendIds().length) return;
        console.log('friends-22',mapsFriendsLoadings[mapId]);
        if (!mapsFriendsLoadings[mapId]) {
            mapsFriendsLoadings[mapId] = true;
            console.log('friends-5');
            SAPIMap.sendMeMapFriends(mapId, LogicUser.getFriendIds());
        }
    };

    this.getFriendIdsByMapId = function (mapId) {
        if (!friendsByMapId[mapId]) {
            loadMapFriends(mapId);
        }
        return friendsByMapId[mapId];
    }
};

/**
 * Статичный класс.
 * @type {LogicUser}
 */
LogicUser = new LogicUser();
