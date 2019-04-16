var FS = require('fs');

SAPIUser = function () {

    var auhthorizeValidateParams = function (cntx, socNetUserId, authParams) {
        if (!socNetUserId) {
            Logs.log("SAPIUser.auhthorizeValidateParams: must have socNetUserId", Logs.LEVEL_WARNING);
            return false;
        }
        if (!authParams || typeof authParams !== 'object') {
            Logs.log("SAPIUser.auhthorizeValidateParams: must have authParams", Logs.LEVEL_WARNING);
            return false;
        }
        if (cntx.isAuthorized) {
            Logs.log("SAPIUser.auhthorizeValidateParams: user already authorized", Logs.LEVEL_WARNING, {
                userId: cntx.userId,
                socNetUserId: socNetUserId
            });
            return false;
        }
        return true;
    };

    /**
     * Авторизация через вКонтакте.
     * @param cntx контекст соединения
     * @param socNetUserId id юзера в соц сети
     * @param authParams параметры аутентифиакации.
     */
    this.authorizeByVK = function (cntx, socNetUserId, authParams) {
        if (!auhthorizeValidateParams(cntx, socNetUserId, authParams)) {
            return false;
        }
        LogicUser.authorizeByVK(socNetUserId, authParams, cntx);
    };

    /**
     * Авторизация через Сайт.
     * @param cntx контекст соединения
     * @param socNetUserId id юзера в соц сети
     * @param authParams параметры аутентифиакации.
     */
    this.authorizeByStandalone = function (cntx, socNetUserId, authParams) {
        if (!auhthorizeValidateParams(cntx, socNetUserId, authParams)) {
            return false;
        }
        LogicUser.authorizeByStandalone(socNetUserId, authParams, cntx);
    };

    /**
     * Отправяел информацию о пользователи в текущие соединение.
     * @param cntx object
     * @param userId number
     */
    this.sendMeUserInfo = function (cntx, userId) {
        if (!cntx.isAuthorized) {
            Logs.log("SAPIUser.sendMeUserInfo: must be authorized", Logs.LEVEL_WARNING);
            return;
        }
        if (!userId || typeof userId !== 'number') {
            Logs.log("SAPIUser.sendMeUserInfo: must have userId", Logs.LEVEL_WARNING, userId);
            return;
        }
        LogicUser.sendUserInfo(userId, cntx.userId);
    };

    /**
     * Отправляет внутрение id пользователей по их socNetUserId.
     * Тип социальной сети определяется по cntx.user
     * @param cntx
     * @param userIds
     */
    this.sendMeUserIdsBySocNet = function (cntx, userIds) {
// @Todo validate userIds
        DataUser.getById(cntx.user.id, function (user) {
            DataUser.getUserIdsBySocNet(user.socNetTypeId, userIds, function (ids) {
                CAPIUser.gotFriendsIds(cntx.user.id, ids);
            });
        });
    };

    this.onTurnsLoose = function (cntx) {
        DataUser.getById(cntx.user.id, function (user) {
            if (user.healths > 1) {
                DataUser.updateHealths(user.id, user.healths - 1, function () {
                });
            }
        })
    }
};
/**
 * Статичный класс.
 * @type {SAPIUser}
 */
SAPIUser = new SAPIUser();
