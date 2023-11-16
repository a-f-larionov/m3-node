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
        Kafka.sendToGameplay({pids: pids, uids: uids}, cntx.user.id, Kafka.TYPE_SEND_ME_SCORES_RQ_DTO);
    };

    this.spendCoinsForTurns = function (cntx) {

        let tid = LogicTid.getOne();

        Statistic.write(cntx.user.id, Statistic.ID_BUY_LOOSE_TURNS, DataShop.looseTurnsQuantity, DataShop.looseTurnsPrice);

        DataStuff.usedGold(cntx.user.id, DataShop.looseTurnsPrice, tid);

        Logs.log(
            " tid:" + tid +
            " uid:" + cntx.user.id + " купил " +
            DataShop.looseTurnsQuantity + " ходов за " +
            DataShop.looseTurnsPrice + " монет.",
            Logs.LEVEL_NOTIFY,
            null,
            null, true);

        //@todo-method
        //Kafka.sendToGameplay({}, Kafka.TYPE_SPEND_COINS_FOR_TURNS_RQ_DTO)
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
        Kafka.sendToUsers(authParams, undefined, Kafka.TYPE_AUTH_RQ_DTO);
    };

    this.logout = function (cntx) {
        if (cntx.userId) {
            Kafka.sendToUsers({}, cntx.user.id, Kafka.TYPE_UPDATE_LAST_LOGOUT_RQ_DTO); /* updateLastLogout*/
            DataUser.clearCache(cntx.userId);
        }
        // @todo clearContext
        cntx.userId = undefined;
        cntx.isAuthorized = undefined;
        cntx.user = undefined;
    };

    this.sendMeUserListInfo = function (cntx, ids) {
        Kafka.sendToUsers({ids: ids}, cntx.user.id, Kafka.TYPE_SEND_USER_LIST_INFO_RQ_DTO); /* sendUserListInfo*/
    };

    this.sendMeMapFriends = function (cntx, mapId, fids) {
        Kafka.sendToUsers({mapId: mapId, fids: fids}, cntx.user.id, Kafka.TYPE_SEND_MAP_FRIENDS_RQ_DTO); /* sendMapFriends*/
    };

    this.sendMeFriendIdsBySocNet = function (cntx, friendSocNetIds) {
        Kafka.sendToUsers({friendSocNetIds: friendSocNetIds}, cntx.user.id, Kafka.TYPE_SEND_FRIEND_IDS_BY_SOCNET_RQ_DTO); /* sendFriendIdsBySocNet*/
    };

    this.sendMeTopUsers = function (cntx, fids) {
        Kafka.sendToUsers({fids: fids}, cntx.user.id, Kafka.TYPE_SEND_TOP_USERS_RQ_DTO); /* sendTopUsers*/
    };

    this.healthBack = function (cntx) {
        Kafka.sendToUsers({}, cntx.user.id, Kafka.TYPE_HEALTH_BACK_RQ_DTO); /* healthBack*/
        Kafka.sendToCommon({statId: Statistic.ID_FINISH_PLAY}, cntx.user.id, Kafka.TYPE_STATISTIC_RQ_DTO);
    };

    this.zeroLife = function (cntx) {
        Kafka.sendToUsers({}, cntx.user.id, Kafka.TYPE_ZERO_LIFE_RQ_DTO); /* zeroLife*/
    };

    this.healthDown = function (cntx, pointId) {
        Kafka.sendToUsers({pointId: pointId}, cntx.user.id, Kafka.TYPE_HEALTH_DOWN_RQ_DTO); /* healthDown*/
        Kafka.sendToCommon({
            statId: Statistic.ID_START_PLAY,
            pointId: pointId
        }, cntx.user.id, Kafka.TYPE_STATISTIC_RQ_DTO);
    };

    this.exitGame = function (cntx, pointId) {
        Kafka.sendToCommon({
            statId: Statistic.ID_EXIT_GAME,
            pointId: pointId
        }, cntx.user.id, Kafka.TYPE_STATISTIC_RQ_DTO);
    };

    this.looseGame = function (cntx, pointId) {
        Kafka.sendToCommon({
            statId: Statistic.ID_LOOSE_GAME,
            pointId: pointId
        }, cntx.user.id, Kafka.TYPE_STATISTIC_RQ_DTO);
    };

};
/**
 * Статичный класс.
 * @type {SAPIUser}
 */
SAPIUser = new SAPIUser();
