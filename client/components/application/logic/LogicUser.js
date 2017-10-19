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

    /** Кол-во онлайн пользователей */
    var onlineCount = null;

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
        SAPITimeServer.sendMeTime();
        waitForLoadingUser = [];
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
        if (id == 0) {
            return robotDummy();
        }
        if (users[id]) {
            /* Догрузим данные, это немного костыль... но время деньги :) */
            if (!users[id].socNetUserId) {
                self.loadUserInfoById(id);
            }
            return users[id];
        } else {
            self.loadUserInfoById(id);
            /* некоторая заглушка */
            return getDummy();
        }
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
     * При создании, создаются дефолтовые поля: firstName: '', lastName: '', isBusy: false, onGameId: 0
     * @param user {Object}
     */
    this.updateUserInfo = function (user) {
        waitForLoadingUser[user.id] = false;
        if (!users[user.id]) {
            users[user.id] = getDummy();
        }
        for (var field in user) {
            users[user.id][field] = user[field];
        }
        PageController.redraw();
    };

    this.loadNameCase = function (user, nom) {
        VK.api('users.get', {
            user_ids: user.socNetUserId,
            name_case: nom
        }, function (result) {
            Logs.log("VK.users.get response", Logs.LEVEL_DETAIL, result);
            users[user.id]['firstName_' + nom] = result.response[0].first_name;
            users[user.id]['lastName_' + nom] = result.response[0].last_name;
        });
    };
};

/**
 * Статичный класс.
 * @type {LogicUser}
 */
LogicUser = new LogicUser();
