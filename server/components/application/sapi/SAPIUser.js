let FS = require('fs');
var AsyncLock = require('async-lock');
var LOCK = new AsyncLock();

SAPIUser = function () {

    let auhthorizeValidateParams = function (cntx, socNetUserId, authParams) {
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
        if (!cntx.isAuthorized) return Logs.log(arguments.callee.name + " not authorized", Logs.LEVEL_WARNING, cntx);
        if (!cntx.user) return Logs.log(arguments.callee.name + " not user", Logs.LEVEL_WARNING, cntx);
        if (!cntx.user.id) return Logs.log(arguments.callee.name + " not user id", Logs.LEVEL_WARNING, cntx);


        if (!userId || typeof userId !== 'number') {
            Logs.log("SAPIUser.sendMeUserInfo: must have userId", Logs.LEVEL_WARNING, userId);
            return;
        }
        LogicUser.sendUserInfo(userId, cntx.userId);
    };

    /**
     * Отправяел информацию о пользователи в текущие соединение.
     * @param cntx object
     * @param ids [number]
     */
    this.sendMeUserListInfo = function (cntx, ids) {
        if (!cntx.isAuthorized) return Logs.log(arguments.callee.name + " not authorized", Logs.LEVEL_WARNING, cntx);
        if (!cntx.user) return Logs.log(arguments.callee.name + " not user", Logs.LEVEL_WARNING, cntx);
        if (!cntx.user.id) return Logs.log(arguments.callee.name + " not user id", Logs.LEVEL_WARNING, cntx);

        if (!ids || typeof ids !== 'object') {
            Logs.log(arguments.callee.name + ": must have ids", Logs.LEVEL_WARNING, ids);
            return;
        }
        LogicUser.sendUserListInfo(ids, cntx.userId);
    };

    /**
     * Отправляет внутрение id пользователей по их socNetUserId.
     * Тип социальной сети определяется по cntx.user
     * @param cntx {Object}
     * @param userIds
     * @param limit
     */
    this.sendMeUserIdsBySocNet = function (cntx, userIds, limit) {
        if (!cntx.isAuthorized) return Logs.log(arguments.callee.name + " not authorized", Logs.LEVEL_WARNING, cntx);
        if (!cntx.user) return Logs.log(arguments.callee.name + " not user", Logs.LEVEL_WARNING, cntx);
        if (!cntx.user.id) return Logs.log(arguments.callee.name + " not user id", Logs.LEVEL_WARNING, cntx);
        //if (!limit) return Logs.log(arguments.callee.name + " limit not found", Logs.LEVEL_WARNING, cntx);

        // @Todo validate userIds
        if (typeof userIds !== 'object' || !userIds.length) return Logs.log(arguments.callee.name + " wrong params", Logs.LEVEL_WARNING, {
            cntx, userIds: userIds
        });

        DataUser.getById(cntx.user.id, function (user) {
            DataUser.getUserIdsBySocNet(user.socNetTypeId, userIds, limit, function (ids) {
                CAPIUser.gotFriendsIds(cntx.user.id, ids);
            });
        });
    };

    /**
     *
     * @param cntx {Object}
     * @returns {undefined}
     */
    this.onPlayFinish = function (cntx) {
        if (!cntx.isAuthorized) return Logs.log(arguments.callee.name + " not authorized", Logs.LEVEL_WARNING, cntx);
        if (!cntx.user) return Logs.log(arguments.callee.name + " not user", Logs.LEVEL_WARNING, cntx);
        if (!cntx.user.id) return Logs.log(arguments.callee.name + " not user id", Logs.LEVEL_WARNING, cntx);

        LOCK.acquire(Keys.health(cntx.user.id), function (done) {
            setTimeout(done, 5 * 60 * 1000);
            DataUser.getById(cntx.user.id, function (user) {
                if (!LogicHealth.isMaxHealths(user)) {
                    LogicHealth.decrementHealth(user, -1);
                    DataUser.updateHealthAndStartTime(user, function () {
                            CAPIUser.updateUserInfo(cntx.user.id, user);
                            CAPIUser.setOneHealthHide(cntx.user.id, false);
                        }
                    );
                    done();
                } else {
                    done();
                }
            })
        });
    };

    this.onPlayStart = function (cntx) {
        if (!cntx.isAuthorized) return Logs.log(arguments.callee.name + " not authorized", Logs.LEVEL_WARNING, cntx);
        if (!cntx.user) return Logs.log(arguments.callee.name + " not user", Logs.LEVEL_WARNING, cntx);
        if (!cntx.user.id) return Logs.log(arguments.callee.name + " not user id", Logs.LEVEL_WARNING, cntx);

        LOCK.acquire(Keys.health(cntx.user.id), function (done) {
            //@todo auto LOCK timeout(with keys!)
            setTimeout(done, 5 * 60 * 1000);
            DataUser.getById(cntx.user.id, function (user) {
                if (LogicHealth.getHealths(user) > 0) {
                    LogicHealth.decrementHealth(user, 1);
                    DataUser.updateHealthAndStartTime(user, function () {
                            CAPIUser.updateUserInfo(user.id, user);
                            CAPIUser.setOneHealthHide(cntx.user.id, true);
                        }
                    );
                    done();
                } else {
                    done();
                }
            })
        });
    };

    /*
    this.checkHealth = function (cntx) {
        if (!cntx.isAuthorized) return Logs.log(arguments.callee.name + " not authorized", Logs.LEVEL_WARNING, cntx);
        if (!cntx.user) return Logs.log(arguments.callee.name + " not user", Logs.LEVEL_WARNING, cntx);
        if (!cntx.user.id) return Logs.log(arguments.callee.name + " not user id", Logs.LEVEL_WARNING, cntx);

        LogicHealth.checkHealth(cntx.user.id);
    };

     */

    this.zeroLife = function (cntx) {
        if (!cntx.isAuthorized) return Logs.log(arguments.callee.name + " not authorized", Logs.LEVEL_WARNING, cntx);
        if (!cntx.user) return Logs.log(arguments.callee.name + " not user", Logs.LEVEL_WARNING, cntx);
        if (!cntx.user.id) return Logs.log(arguments.callee.name + " not user id", Logs.LEVEL_WARNING, cntx);

        //@todo lock
        DataUser.getById(cntx.user.id, function (user) {

            LogicHealth.zeroLife(user);

            DataUser.updateHealthAndStartTime(user, function () {
                CAPIUser.updateUserInfo(user.id, user);
            });
        });
    };
};
/**
 * Статичный класс.
 * @type {SAPIUser}
 */
SAPIUser = new SAPIUser();
