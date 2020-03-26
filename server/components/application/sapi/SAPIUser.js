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
     * Отправляет внутрение id пользователей по их socNetUserId.
     * Тип социальной сети определяется по cntx.user
     * @param cntx
     * @param userIds
     */
    this.sendMeUserIdsBySocNet = function (cntx, userIds) {
        if (!cntx.isAuthorized) return Logs.log(arguments.callee.name + " not authorized", Logs.LEVEL_WARNING, cntx);
        if (!cntx.user) return Logs.log(arguments.callee.name + " not user", Logs.LEVEL_WARNING, cntx);
        if (!cntx.user.id) return Logs.log(arguments.callee.name + " not user id", Logs.LEVEL_WARNING, cntx);

        // @Todo validate userIds

        DataUser.getById(cntx.user.id, function (user) {
            DataUser.getUserIdsBySocNet(user.socNetTypeId, userIds, function (ids) {
                CAPIUser.gotFriendsIds(cntx.user.id, ids);
            });
        });
    };


    this.onPlayFinish = function (cntx) {
        if (!cntx.isAuthorized) return Logs.log(arguments.callee.name + " not authorized", Logs.LEVEL_WARNING, cntx);
        if (!cntx.user) return Logs.log(arguments.callee.name + " not user", Logs.LEVEL_WARNING, cntx);
        if (!cntx.user.id) return Logs.log(arguments.callee.name + " not user id", Logs.LEVEL_WARNING, cntx);

        LOCK.acquire('stuff-' + cntx.user.id + '-health', function (done) {
            DataUser.getById(cntx.user.id, function (user) {
                let now, recoveryTime;
                if (user.health > 0) {
                    user.health++;
                    user.health = Math.max(user.health, LogicHealth.getMaxHealth());
                    now = LogicTimeServer.getCurrentTime();
                    recoveryTime = LogicHealth.getHealthRecoveryTime();
                    if (now > (user.healthStartTime + recoveryTime)) {
                        user.healthStartTime = now;
                    }
                    DataUser.updateHealthAndStartTime(
                        user.id,
                        user.health,
                        user.healthStartTime,
                        function () {
                            CAPIUser.updateUserInfo(cntx.user.id, user);
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

        LOCK.acquire('stuff-' + cntx.user.id + '-health', function (done) {
            DataUser.getById(cntx.user.id, function (user) {
                let now, recoveryTime;
                if (user.health > 0) {
                    user.health--;
                    now = LogicTimeServer.getCurrentTime();
                    recoveryTime = LogicHealth.getHealthRecoveryTime();
                    if (now > (user.healthStartTime + recoveryTime)) {
                        user.healthStartTime = now;
                    }
                    DataUser.updateHealthAndStartTime(
                        user.id,
                        user.health,
                        user.healthStartTime,
                        function () {
                            CAPIUser.updateUserInfo(cntx.user.id, user);
                        }
                    );
                    done();
                } else {
                    done();
                }
            })
        });
    };

    this.checkHealth = function (cntx) {
        if (!cntx.isAuthorized) return Logs.log(arguments.callee.name + " not authorized", Logs.LEVEL_WARNING, cntx);
        if (!cntx.user) return Logs.log(arguments.callee.name + " not user", Logs.LEVEL_WARNING, cntx);
        if (!cntx.user.id) return Logs.log(arguments.callee.name + " not user id", Logs.LEVEL_WARNING, cntx);

        LogicHealth.checkHealth(cntx.user.id);
    };

    this.zeroLife = function (cntx) {
        if (!cntx.isAuthorized) return Logs.log(arguments.callee.name + " not authorized", Logs.LEVEL_WARNING, cntx);
        if (!cntx.user) return Logs.log(arguments.callee.name + " not user", Logs.LEVEL_WARNING, cntx);
        if (!cntx.user.id) return Logs.log(arguments.callee.name + " not user id", Logs.LEVEL_WARNING, cntx);

        DataUser.getById(cntx.user.id, function (user) {
            user.health = 0;
            user.healthStartTime = LogicTimeServer.getCurrentTime();
            DataUser.updateHealthAndStartTime(
                user.id,
                0,
                LogicTimeServer.getCurrentTime(),
                function () {
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
