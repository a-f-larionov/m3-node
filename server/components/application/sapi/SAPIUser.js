const Logs = require("../../base/Logs.js").Logs
const Kafka = require("../../base/Kafka.js").Kafka
const DataUser = require("../../application/data/DataUser.js").DataUser
const DataPoints = require("../../application/data/DataPoints.js").DataPoints

/**
 * @type {SAPIUser}
 * @constructor
 */
SAPIUser = function () {

    this.sendMeScores = function (cntx, pids, uids) {

        DataPoints.getScores(pids, uids, function (rows) {
            CAPIUser.gotScores(cntx.user.id, rows);
        });
        //@todo-method
        Kafka.sendToMapAndPoints({pids: pids, uids: uids}, cntx.user.id, "SendMeScoresRqDto");
    };

    this.spendCoinsForTurns = function (cntx) {

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

        //@todo-method
        Kafka.sendToStuff({}, "SpendCoinsForTurnsRqDto")
    };

    /**
     * Авторизация через вКонтакте.
     * @param cntx контекст соединения
     * @param authParams параметры аутентифиакации.
     */
    this.auth = function (cntx, authParams) {

        /** Тут мы запомним его cid раз и на всегда */
        //@Todo remove after realis Log service
        // Logs.log("🥰 ", Logs.LEVEL_NOTIFY,
        //     SocNet(SocNet.TYPE_VK).getUserProfileUrl(authParams.socNetUserId),
        //     Logs.CHANNEL_TELEGRAM
        // );
        SAPILogs.log(cntx, "Игрок вошел в игру 🥰 ", Logs.LEVEL_INFO,
            SocNet(authParams.socNetType)
                .getUserProfileUrl(authParams.socNetUserId),
            true);

        authParams.connectionId = cntx.cid;
        Kafka.sendToUsers(authParams, undefined, "AuthRqDto");
    };

    this.logout = function (cntx) {
        if (cntx.userId) {
            Kafka.sendToUsers({}, cntx.user.id, "UpdateLastLogoutRqDto"); /* updateLastLogout*/
            DataUser.clearCache(cntx.userId);
        }
        // @todo clearContext
        cntx.userId = undefined;
        cntx.isAuthorized = undefined;
        cntx.user = undefined;
    };

    this.sendMeUserListInfo = function (cntx, ids) {
        Kafka.sendToUsers({ids: ids}, cntx.user.id, "SendUserListInfoRqDto"); /* sendUserListInfo*/
    };

    this.sendMeMapFriends = function (cntx, mapId, fids) {
        Kafka.sendToUsers({mapId: mapId, fids: fids}, cntx.user.id, "SendMapFriendsRqDto"); /* sendMapFriends*/
    };

    this.sendMeFriendIdsBySocNet = function (cntx, friendSocNetIds) {
        Kafka.sendToUsers({friendSocNetIds: friendSocNetIds}, cntx.user.id, "SendFriendIdsBySocNetRqDto"); /* sendFriendIdsBySocNet*/
    };

    this.sendMeTopUsers = function (cntx, fids) {
        Kafka.sendToUsers({fids: fids}, cntx.user.id, "SendTopUsersRqDto"); /* sendTopUsers*/
    };

    this.healthBack = function (cntx) {
        Kafka.sendToUsers({}, cntx.user.id, "HealthBackRqDto"); /* healthBack*/
        Kafka.sendToCommon({statId: Statistic.ID_FINISH_PLAY}, cntx.user.id, Kafka.TYPE_STATISTIC_RQ_DTO);
    };

    this.zeroLife = function (cntx) {
        Kafka.sendToUsers({}, cntx.user.id, "ZeroLifeRqDto"); /* zeroLife*/
    };

    this.healthDown = function (cntx, pointId) {
        Kafka.sendToUsers({pointId: pointId}, cntx.user.id, "HealthDownRqDto"); /* healthDown*/
        Kafka.sendToCommon({statId: Statistic.ID_START_PLAY, pointId: pointId}, cntx.user.id, Kafka.TYPE_STATISTIC_RQ_DTO);
    };

    this.exitGame = function (cntx, pointId) {
        Kafka.sendToCommon({statId: Statistic.ID_EXIT_GAME, pointId: pointId}, cntx.user.id, Kafka.TYPE_STATISTIC_RQ_DTO);
    };

    this.looseGame = function (cntx, pointId) {
        Kafka.sendToCommon({statId: Statistic.ID_LOOSE_GAME, pointId: pointId}, cntx.user.id, Kafka.TYPE_STATISTIC_RQ_DTO);
    };

};
/**
 * Статичный класс.
 * @type {SAPIUser}
 */
SAPIUser = new SAPIUser();
