CAPIUser = function () {

    /**
     * Авторизация успешна.
     * @param cntx {Object} контекст соединения.
     * @param user {Object} какой id авторизованного юзера сообщаем.
     */
    this.authorizeSuccess = function (cntx, user) {
        /** @todo похоже на костыль, ну да ладно, время деньги */
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
        user.fullRecoveryTime = LogicTimeClient.convertToClient(user.fullRecoveryTime);
        LogicUser.updateUserInfo(user);
    };

    this.gotFriendsIds = function (cntx, ids) {
        LogicUser.setFriendIds(ids);
    };

    /**
     * @param cntx {Object}
     * @param value {bool}
     */
    this.setOneHealthHide = function (cntx, value) {
        PageBlockPanel.oneHealthHide = value;
    }
};

/**
 * Константный класс.
 * @type {CAPIUser}
 */
CAPIUser = new CAPIUser();