const Logs = require("../../base/Logs.js").Logs
const KafkaModule = require("../../base/KafkaModule.js").KafkaModule
const LogicUser = require("../../application/logic/LogicUser.js").LogicUser
const DataUser = require("../../application/data/DataUser.js").DataUser
const DataPoints = require("../../application/data/DataPoints.js").DataPoints
let FS = require('fs');
var AsyncLock = require('async-lock');
var LOCK = new AsyncLock();

/**
 * @type {SAPIUser}
 * @constructor
 */
SAPIUser = function () {

    /**
     * Авторизация через вКонтакте.
     * @param cntx контекст соединения
     * @param authParams параметры аутентифиакации.
     */
    this.auth = function (cntx, authParams) {
        KafkaModule.auth({
            socNetType: authParams.socNetType,
            socNetUserId: authParams.socNetUserId,
            appId: authParams.appId,
            authKey: authParams.authKey,
            connectionId: cntx.cid
        });
    };

    this.logout = function (cntx) {
        if (cntx.userId) {
            KafkaModule.updateLastLogout(cntx.userId);
            DataUser.clearCache(cntx.userId);
        }
        // @todo clearContext
        cntx.userId = undefined;
        cntx.isAuthorized = undefined;
        cntx.user = undefined;
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

        if (!Validator.DBUINTArray(ids)) Logs.log(arguments.callee.name + ": must have ids", Logs.LEVEL_WARNING, ids);

        KafkaModule.sendUserListInfo(ids, cntx.userId);
    };

    this.sendMeMapFriends = function (cntx, mapId, fids) {
        if (!cntx.isAuthorized) return Logs.log(arguments.callee.name + " not authorized", Logs.LEVEL_WARNING, cntx);
        if (!cntx.user) return Logs.log(arguments.callee.name + " not user", Logs.LEVEL_WARNING, cntx);
        if (!cntx.user.id) return Logs.log(arguments.callee.name + " not user id", Logs.LEVEL_WARNING, cntx);

        let prid = pStart(Profiler.ID_SAPIUSER_SEND_ME_MAP_FRIENDS);
        DataUser.getMapFriendIds(mapId, fids, function (fids) {
            CAPIUser.gotMapFriendIds(cntx.user.id, mapId, fids);
            pFinish(prid);
        });
    };

    /**
     * Отправляет внутрение id пользователей по их socNetUserId.
     * Тип социальной сети определяется по cntx.user
     * @param cntx {Object}
     * @param fids
     */
    this.sendMeFriendIdsBySocNet = function (cntx, fids) {
        if (!cntx.isAuthorized) return Logs.log(arguments.callee.name + " not authorized", Logs.LEVEL_WARNING, cntx);
        if (!cntx.user) return Logs.log(arguments.callee.name + " not user", Logs.LEVEL_WARNING, cntx);
        if (!cntx.user.id) return Logs.log(arguments.callee.name + " not user id", Logs.LEVEL_WARNING, cntx);
        //if (!limit) return Logs.log(arguments.callee.name + " limit not found", Logs.LEVEL_WARNING, cntx);

        fids = Validator.DBUINTArray(fids);
        if (!fids) return Logs.log(arguments.callee.name + " wrong params", Logs.LEVEL_WARNING, arguments);

        let prid = pStart(Profiler.ID_SAPIUSER_SEND_ME_USER_IDS_BY_SOC_NET);
        //@todo add check ids and length no more 1000
        DataUser.getById(cntx.user.id, function (user) {
            if (user.socNetTypeId == SocNet.TYPE_STANDALONE) {
                DataUser.getListWhere({}, function (rows) {

                    let ids = [];
                    if (rows) {
                        rows.forEach(function (row) {
                            ids.push(row.id);
                        });

                        CAPIUser.gotFriendsIds(cntx.user.id, ids);
                    }
                    pFinish(prid);
                })

            } else {
                DataUser.getUserIdsBySocNet(user.socNetTypeId, fids, function (ids) {

                    CAPIUser.gotFriendsIds(cntx.user.id, ids);
                    pFinish(prid);
                });
            }
        });
    };

    this.sendMeTopUsers = function (cntx, fids) {
        if (!cntx.isAuthorized) return Logs.log(arguments.callee.name + " not authorized", Logs.LEVEL_WARNING, cntx);
        if (!cntx.user) return Logs.log(arguments.callee.name + " not user", Logs.LEVEL_WARNING, cntx);
        if (!cntx.user.id) return Logs.log(arguments.callee.name + " not user id", Logs.LEVEL_WARNING, cntx);

        //@todo profiler
        //@todo cache it at day
        if (!Validator.DBUINTArray(fids)) return Logs.log("invalid data", Logs.LEVEL_ALERT, fids);

        let prid = pStart(Profiler.ID_SAPIUSER_SEND_ME_TOP_USER_SCORES);

        DataUser.getList(fids, function (users) {
            CAPIUser.gotTopUsers(cntx.user.id, users);
            pFinish(prid);
        }, ' ORDER BY nextPointId DESC LIMIT ' + DataCross.topUsersLimit);
    };

    this.sendMeScores = function (cntx, pids, uids) {
        //@todo validate context method
        if (!cntx.isAuthorized) return Logs.log(arguments.callee.name + " not authorized", Logs.LEVEL_WARNING, cntx);
        if (!cntx.user) return Logs.log(arguments.callee.name + " not user", Logs.LEVEL_WARNING, cntx);
        if (!cntx.user.id) return Logs.log(arguments.callee.name + " not user id", Logs.LEVEL_WARNING, cntx);

        if (!(pids instanceof Array)) pids = [pids];
        if (!(uids instanceof Array)) uids = [uids];

        if (!(pids = Validator.DBUINTArray(pids))) return Logs.log("invalid data pids", Logs.LEVEL_ALERT, arguments);
        if (!(uids = Validator.DBUINTArray(uids))) return Logs.log("invalid data uids", Logs.LEVEL_ALERT, arguments);

        let prid = pStart(Profiler.ID_SAPIUSER_SEND_ME_SCORES);
        //@todo prid
        DataPoints.getScores(pids, uids, function (rows) {
            CAPIUser.gotScores(cntx.user.id, rows);
            pFinish(prid);
        });
    };

    /**
     *
     * @param cntx {Object}
     * @returns {undefined}
     */
    this.healthBack = function (cntx) {
        if (!cntx.isAuthorized) return Logs.log(arguments.callee.name + " not authorized", Logs.LEVEL_WARNING, cntx);
        if (!cntx.user) return Logs.log(arguments.callee.name + " not user", Logs.LEVEL_WARNING, cntx);
        if (!cntx.user.id) return Logs.log(arguments.callee.name + " not user id", Logs.LEVEL_WARNING, cntx);

        let prid = pStart(Profiler.ID_SAPIUSER_HEALTH_BACK);

        /** Возвращаем жизнь */
        LOCK.acquire(Keys.health(cntx.user.id), function (done) {
            setTimeout(done, 5 * 60 * 1000);
            DataUser.getById(cntx.user.id, function (user) {
                if (!LogicHealth.isMaxHealths(user)) {
                    LogicHealth.decrementHealth(user, -1);
                    DataUser.updateHealthAndStartTime(user, function () {
                        CAPIUser.setOneHealthHide(cntx.user.id, false, user.fullRecoveryTime);
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

    this.healthDown = function (cntx, pointId) {
        if (!cntx.isAuthorized) return Logs.log(arguments.callee.name + " not authorized", Logs.LEVEL_WARNING, cntx);
        if (!cntx.user) return Logs.log(arguments.callee.name + " not user", Logs.LEVEL_WARNING, cntx);
        if (!cntx.user.id) return Logs.log(arguments.callee.name + " not user id", Logs.LEVEL_WARNING, cntx);

        let prid = pStart(Profiler.ID_SAPIUSER_HEALTH_DOWN);
        Statistic.write(cntx.userId, Statistic.ID_START_PLAY, pointId);

        LOCK.acquire(Keys.health(cntx.user.id), function (done) {
            //@todo auto LOCK timeout(with keys!)
            setTimeout(done, 5 * 60 * 1000);
            DataUser.getById(cntx.user.id, function (user) {
                if (LogicHealth.getHealths(user) > 0) {
                    LogicHealth.decrementHealth(user, 1);
                    DataUser.updateHealthAndStartTime(user, function () {
                        CAPIUser.setOneHealthHide(cntx.user.id, true, user.fullRecoveryTime);
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

    this.spendTurnsMoney = function (cntx, pointId) {
        if (!cntx.isAuthorized) return Logs.log(arguments.callee.name + " not authorized", Logs.LEVEL_WARNING, cntx);
        if (!cntx.user) return Logs.log(arguments.callee.name + " not user", Logs.LEVEL_WARNING, cntx);
        if (!cntx.user.id) return Logs.log(arguments.callee.name + " not user id", Logs.LEVEL_WARNING, cntx);

        let tid = LogicTid.getOne();
        Statistic.write(cntx.userId, Statistic.ID_BUY_LOOSE_TURNS, DataShop.looseTurnsQuantity, DataShop.looseTurnsPrice);

        DataStuff.usedGold(cntx.user.id, DataShop.looseTurnsPrice, tid);

        Logs.log(
            "tid:" + tid +
            " uid:" + cntx.user.id + " купил " +
            DataShop.looseTurnsQuantity + " ходов за " +
            DataShop.looseTurnsPrice + " монет.",
            Logs.LEVEL_NOTIFY,
            null,
            null, true);
    };

    this.exitGame = function (cntx, pointId) {
        if (!cntx.isAuthorized) return Logs.log(arguments.callee.name + " not authorized", Logs.LEVEL_WARNING, cntx);
        if (!cntx.user) return Logs.log(arguments.callee.name + " not user", Logs.LEVEL_WARNING, cntx);
        if (!cntx.user.id) return Logs.log(arguments.callee.name + " not user id", Logs.LEVEL_WARNING, cntx);

        Statistic.write(cntx.user.id, Statistic.ID_EXIT_GAME, pointId);
    };

    this.looseGame = function (cntx, pointId) {
        if (!cntx.isAuthorized) return Logs.log(arguments.callee.name + " not authorized", Logs.LEVEL_WARNING, cntx);
        if (!cntx.user) return Logs.log(arguments.callee.name + " not user", Logs.LEVEL_WARNING, cntx);
        if (!cntx.user.id) return Logs.log(arguments.callee.name + " not user id", Logs.LEVEL_WARNING, cntx);

        Statistic.write(cntx.user.id, Statistic.ID_LOOSE_GAME, pointId);
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
