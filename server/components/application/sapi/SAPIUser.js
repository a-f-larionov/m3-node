const Logs = require("../../base/Logs.js").Logs
const Kafka = require("../../base/Kafka.js").Kafka
const DataUser = require("../../application/data/DataUser.js").DataUser
const DataPoints = require("../../application/data/DataPoints.js").DataPoints
var AsyncLock = require('async-lock');
var LOCK = new AsyncLock();

/**
 * @type {SAPIUser}
 * @constructor
 */
SAPIUser = function () {

    this.sendMeScores = function (cntx, pids, uids) {

        if (!(pids instanceof Array)) pids = [pids];
        if (!(uids instanceof Array)) uids = [uids];

        DataPoints.getScores(pids, uids, function (rows) {
            CAPIUser.gotScores(cntx.user.id, rows);
        });
//sendToT_MapsAndPoints
        //Kafka.send(Kafka.TOPIC_USERS, {userId: userId, pids: pids, uids: uids}, "SendScoresRqDto");
        Kafka.sendScores(pids, uids, cntx.user.id);
    };

    this.spendTurnsMoney = function (cntx, pointId) {

        let tid = LogicTid.getOne();

        Statistic.write(cntx.user.id, Statistic.ID_BUY_LOOSE_TURNS, DataShop.looseTurnsQuantity, DataShop.looseTurnsPrice);

        DataStuff.usedGold(cntx.user.id, DataShop.looseTurnsPrice, tid);

        Logs.log(
            "tid:" + tid +
            " uid:" + cntx.user.id + " купил " +
            DataShop.looseTurnsQuantity + " ходов за " +
            DataShop.looseTurnsPrice + " монет.",
            Logs.LEVEL_NOTIFY,
            null,
            null, true);

        Kafka.spendTurnsMoney(pointId, cntx.user.id);
    };

    /**
     * Авторизация через вКонтакте.
     * @param cntx контекст соединения
     * @param authParams параметры аутентифиакации.
     */
    this.auth = function (cntx, authParams) {

        /** Тут мы запомним его cid раз и на всегда */

        //@Todo remove after realis Log service
        Logs.log("🥰 ", Logs.LEVEL_NOTIFY,
            SocNet(SocNet.TYPE_VK).getUserProfileUrl(authParams.socNetUserId),
            Logs.CHANNEL_TELEGRAM
        );

        Kafka.auth({
            socNetType: authParams.socNetType,
            socNetUserId: authParams.socNetUserId,
            appId: authParams.appId,
            authKey: authParams.authKey,
            connectionId: cntx.cid
        });
    };

    this.logout = function (cntx) {
        if (cntx.userId) {
            Kafka.updateLastLogout(cntx.userId);
            DataUser.clearCache(cntx.userId);
        }
        // @todo clearContext
        cntx.userId = undefined;
        cntx.isAuthorized = undefined;
        cntx.user = undefined;
    };

    this.sendMeUserListInfo = function (cntx, ids) {
        Kafka.sendUserListInfo(ids, cntx.user.id);
    };

    this.sendMeMapFriends = function (cntx, mapId, fids) {
        Kafka.sendMapFriends(mapId, fids, cntx.user.id);
    };

    this.sendMeFriendIdsBySocNet = function (cntx, fids) {
        Kafka.sendFriendIdsBySocNet(fids, cntx.user.id);
    };

    this.sendMeTopUsers = function (cntx, fids) {
        Kafka.sendTopUsers(fids, cntx.user.id);
    };

    this.healthBack = function (cntx) {
        Kafka.healthBack(cntx.user.id);
    };

    this.zeroLife = function (cntx) {
        Kafka.zeroLife(cntx.user.id);
    };

    this.healthDown = function (cntx, pointId) {
        Statistic.write(cntx.user.id, Statistic.ID_START_PLAY, pointId);
        Kafka.healthDown(pointId, cntx.user.id);
    };

    this.exitGame = function (cntx, pointId) {
        Statistic.write(cntx.user.id, Statistic.ID_EXIT_GAME, pointId);
    };

    this.looseGame = function (cntx, pointId) {
        Statistic.write(cntx.user.id, Statistic.ID_LOOSE_GAME, pointId);
    };

};
/**
 * Статичный класс.
 * @type {SAPIUser}
 */
SAPIUser = new SAPIUser();
