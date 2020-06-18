/**
 * @type {CAPIUser}
 * @constructor
 */
let CAPIUser = function () {

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
        // user.create_tm = LogicTimeClient.convertToClient(user.create_tm);
        // user.login_tm = LogicTimeClient.convertToClient(user.login_tm);
        // user.logout_tm = LogicTimeClient.convertToClient(user.logout_tm);
        user.fullRecoveryTime = LogicTimeClient.convertToClient(user.fullRecoveryTime);
        LogicUser.updateUserInfo(user);
    };

    this.updateUserListInfo = function (cntx, userList) {
        userList = userList.map(function (user) {
            return {
                id: user[0],
                nextPointId: user[1],
                socNetUserId: user[2],
                fullRecoveryTime: user[3]
            };
        });
        PageController.pendingData(true);
        userList.forEach(function (user) {
            CAPIUser.updateUserInfo(cntx, user);
        });
        PageController.pendingData(false);
    };

    this.gotFriendsIds = function (cntx, ids) {
        //@todo got userIds for that map
        LogicUser.loadFriendIds(ids);
    };

    this.gotMapFriendIds = function (cntx, mapId, fids) {
        LogicUser.setMapFriendIds(mapId, fids);
    };

    this.gotTopUsers = function (cntx, users) {
        console.log('got users', users);
        LogicUser.loadTopUsers(users);
    };

    this.gotScores = function (cntx, rows) {
        rows.forEach(function (row) {
            DataPoints.setPointUserScore(row.pointId, row.userId, row.score);
        });
        PageController.redraw();
    };

    /**
     * @param cntx {Object}
     * @param value {boolean}
     */
    this.setOneHealthHide = function (cntx, value, fullRecoveryTime) {
        PageBlockPanel.oneHealthHide = value;
        let user = LogicUser.getCurrent();
        user.fullRecoveryTime = fullRecoveryTime;
        user.fullRecoveryTime = LogicTimeClient.convertToClient(user.fullRecoveryTime);
        LogicUser.updateUserInfo(user);
    }
};

/**
 * Константный класс.
 * @type {CAPIUser}
 */
CAPIUser = new CAPIUser();