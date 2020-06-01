let FS = require('fs');
var AsyncLock = require('async-lock');
var LOCK = new AsyncLock();

/**
 * @type {SAPIUser}
 * @constructor
 */
SAPIUser = function () {

    let auhthorizeValidateParams = function (cntx, socNetUserId, authParams) {
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
        socNetUserId = Valid.DBUINT(socNetUserId);
        if (!socNetUserId) {
            Logs.log("SAPIUser.auhthorizeValidateParams invalid socNetUserId" + socNetUserId, Logs.LEVEL_ALERT);
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

    this.logout = function (cntx) {
        if (cntx.userId) DataUser.updateLastLogout(cntx.userId);
        cntx.userId = undefined;
        cntx.isAuthorized = undefined;
        cntx.user = undefined;

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
            return Logs.log("SAPIUser.sendMeUserInfo: must have userId", Logs.LEVEL_WARNING, userId);
        }

        LogicUser.sendUserInfo(userId, cntx.userId, pStart(Profiler.ID_SAPIUSER_SEND_ME_INFO));
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
        LogicUser.sendUserListInfo(ids, cntx.userId, pStart(Profiler.ID_SAPIUSER_SEND_ME_USER_LIST_INFO));
    };

    /**
     * Отправляет внутрение id пользователей по их socNetUserId.
     * Тип социальной сети определяется по cntx.user
     * @param cntx {Object}
     * @param socIds
     * @param limit
     */
    this.sendMeUserIdsBySocNet = function (cntx, socIds) {
        if (!cntx.isAuthorized) return Logs.log(arguments.callee.name + " not authorized", Logs.LEVEL_WARNING, cntx);
        if (!cntx.user) return Logs.log(arguments.callee.name + " not user", Logs.LEVEL_WARNING, cntx);
        if (!cntx.user.id) return Logs.log(arguments.callee.name + " not user id", Logs.LEVEL_WARNING, cntx);
        //if (!limit) return Logs.log(arguments.callee.name + " limit not found", Logs.LEVEL_WARNING, cntx);
        socIds = Valid.DBUINTArray(socIds);
        // @Todo validate userIds
        if (!socIds) return Logs.log(arguments.callee.name + " wrong params", Logs.LEVEL_WARNING, {cntx, userIds: socIds});

        let prid = pStart(Profiler.ID_SAPIUSER_SEND_ME_USER_IDS_BY_SOC_NET);
        //@todo add check ids and length no more 1000
        DataUser.getById(cntx.user.id, function (user) {
            DataUser.getUserIdsBySocNet(user.socNetTypeId, socIds, function (ids) {

                CAPIUser.gotFriendsIds(cntx.user.id, ids);
                pFinish(prid);
            });
        });
    };

    this.sendMeTopUsers = function (cntx, fids) {
        if (!cntx.isAuthorized) return Logs.log(arguments.callee.name + " not authorized", Logs.LEVEL_WARNING, cntx);
        if (!cntx.user) return Logs.log(arguments.callee.name + " not user", Logs.LEVEL_WARNING, cntx);
        if (!cntx.user.id) return Logs.log(arguments.callee.name + " not user id", Logs.LEVEL_WARNING, cntx);

        //@todo cache it at day
        if (!Valid.DBUINTArray(fids)) return Logs.log("invalid data", Logs.LEVEL_ALERT, fids);

        DataUser.getList(fids, function (users) {
            //@todo
            CAPIUser.gotTopUsers(cntx.user.id, users);
        }, ' ORDER BY nextPointId DESC LIMIT ' + DataCross.topUsersLimit);
    };

    this.sendMeScore = function (cntx, pointId, userId) {
        if (!cntx.isAuthorized) return Logs.log(arguments.callee.name + " not authorized", Logs.LEVEL_WARNING, cntx);
        if (!cntx.user) return Logs.log(arguments.callee.name + " not user", Logs.LEVEL_WARNING, cntx);
        if (!cntx.user.id) return Logs.log(arguments.callee.name + " not user id", Logs.LEVEL_WARNING, cntx);

        if (!Valid.DBUINT(pointId)) Logs.log("invalid adata", Logs.LEVEL_ALERT, pointId);
        if (!Valid.DBUINT(userId)) Logs.log("invalid adata", Logs.LEVEL_ALERT, userId);

        DataPoints.getScore(pointId, userId, function (score) {
            CAPIUser.gotScore(cntx.user.id, pointId, userId, score);
        });
    };

    /**
     *
     * @param cntx {Object}
     * @returns {undefined}
     */
    this.onFinish = function (cntx) {
        if (!cntx.isAuthorized) return Logs.log(arguments.callee.name + " not authorized", Logs.LEVEL_WARNING, cntx);
        if (!cntx.user) return Logs.log(arguments.callee.name + " not user", Logs.LEVEL_WARNING, cntx);
        if (!cntx.user.id) return Logs.log(arguments.callee.name + " not user id", Logs.LEVEL_WARNING, cntx);

        let prid = pStart(Profiler.ID_SAPIUSER_ON_FINISH);

        /** Возвращаем жизнь */
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
                    pFinish(prid);
                } else {
                    done();
                    pClear(prid);
                }
            })
        });
    };

    this.onStart = function (cntx) {
        if (!cntx.isAuthorized) return Logs.log(arguments.callee.name + " not authorized", Logs.LEVEL_WARNING, cntx);
        if (!cntx.user) return Logs.log(arguments.callee.name + " not user", Logs.LEVEL_WARNING, cntx);
        if (!cntx.user.id) return Logs.log(arguments.callee.name + " not user id", Logs.LEVEL_WARNING, cntx);

        let prid = pStart(Profiler.ID_SAPIUSER_ON_START);

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
                    pFinish(prid);
                } else {
                    done();
                    pClear(prid);
                }
            })
        });
    };

    this.zeroLife = function (cntx) {
        if (!cntx.isAuthorized) return Logs.log(arguments.callee.name + " not authorized", Logs.LEVEL_WARNING, cntx);
        if (!cntx.user) return Logs.log(arguments.callee.name + " not user", Logs.LEVEL_WARNING, cntx);
        if (!cntx.user.id) return Logs.log(arguments.callee.name + " not user id", Logs.LEVEL_WARNING, cntx);

        //@todo lock
        DataUser.getById(cntx.user.id, function (user) {

            if (user.socNetTypeId !== SocNet.TYPE_STANDALONE) return;

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
