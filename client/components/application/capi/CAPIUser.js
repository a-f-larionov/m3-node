CAPIUser = function () {

    /**
     * Авторизация успешна.
     * @param cntx {Object} контекст соединения.
     * @param userId {Number} какой id авторизованного юзера сообщаем.
     */
    this.authorizeSuccess = function (cntx, user) {
        //похоже на костыль, ну да ладно, время деньги
        CAPIUser.updateUserInfo(cntx, user);
        LogicUser.authorizeSuccess(user.id);
    };

    /**
     * Обновить данные о пользователи.
     * @param cntx {Object} контекст соединения.
     * @param user {Object} юзер инфо.
     */
    this.updateUserInfo = function (cntx, user) {
        user.createTimestamp = LogicTimeClient.convertToClient(user.createTimestamp);
        user.lastLoginTimestamp = LogicTimeClient.convertToClient(user.lastLoginTimestamp);
        user.healthStartTime = LogicTimeClient.convertToClient(user.healthStartTime);
        LogicUser.updateUserInfo(user);
    };

    this.gotFriendsIds = function (cntx, ids) {
        LogicUser.setFriendIds(ids);
    };
};

/**
 * Константный класс.
 * @type {CAPIUser}
 */
CAPIUser = new CAPIUser();