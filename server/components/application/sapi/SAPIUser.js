const Kafka = require("../../base/Kafka.js").Kafka

/**
 * @type {SAPIUser}
 * @constructor
 */
SAPIUser = function () {

    this.sendMeScores = function (cntx, pids, uids) {
        Kafka.sendToGameplay({pids: pids, uids: uids}, cntx.user.id, Kafka.TYPE_SEND_ME_SCORES_RQ_DTO);
    };

    this.spendCoinsForTurns = function (cntx) {
        Kafka.sendToGameplay({}, cntx.user.id, Kafka.TYPE_SPEND_COINS_FOR_TURNS_RQ_DTO)
    };

    this.auth = function (cntx, authParams) {
        authParams.connectionId = cntx.cid;
        Kafka.sendToUsers(authParams, undefined, Kafka.TYPE_AUTH_RQ_DTO);
    };

    this.logout = function (cntx) {
        Kafka.sendToUsers({}, cntx.user.id, Kafka.TYPE_UPDATE_LAST_LOGOUT_RQ_DTO); /* updateLastLogout*/
        // @todo clearContext
        cntx.userId = undefined;
        cntx.isAuthorized = undefined;
        cntx.user = undefined;
    };

    this.sendMeUserListInfo = function (cntx, ids) {
        Kafka.sendToUsers({ids: ids}, cntx.user.id, Kafka.TYPE_SEND_USER_LIST_INFO_RQ_DTO);
    };

    this.sendMeMapFriends = function (cntx, mapId, fids) {
        Kafka.sendToUsers({mapId: mapId, fids: fids}, cntx.user.id, Kafka.TYPE_SEND_MAP_FRIENDS_RQ_DTO);
    };

    this.sendMeFriendIdsBySocNet = function (cntx, friendSocNetIds) {
        Kafka.sendToUsers({friendSocNetIds: friendSocNetIds}, cntx.user.id, Kafka.TYPE_SEND_FRIEND_IDS_BY_SOCNET_RQ_DTO);
    };

    this.sendMeTopUsers = function (cntx, fids) {
        Kafka.sendToUsers({fids: fids}, cntx.user.id, Kafka.TYPE_SEND_TOP_USERS_RQ_DTO);
    };

    this.healthBack = function (cntx) {
        Kafka.sendToUsers({}, cntx.user.id, Kafka.TYPE_HEALTH_BACK_RQ_DTO);
    };

    this.zeroLife = function (cntx) {
        Kafka.sendToUsers({}, cntx.user.id, Kafka.TYPE_ZERO_LIFE_RQ_DTO);
    };

    this.healthDown = function (cntx, pointId) {
        Kafka.sendToUsers({pointId: pointId}, cntx.user.id, Kafka.TYPE_HEALTH_DOWN_RQ_DTO);
        Kafka.sendToCommon({
            statId: Statistic.ID_START_PLAY, paramA: pointId
        }, cntx.user.id, Kafka.TYPE_STATISTIC_RQ_DTO);
    };

    this.exitGame = function (cntx, pointId) {
        Kafka.sendToCommon({
            statId: Statistic.ID_EXIT_GAME, paramA: pointId
        }, cntx.user.id, Kafka.TYPE_STATISTIC_RQ_DTO);
    };

    this.looseGame = function (cntx, pointId) {
        Kafka.sendToCommon({
            statId: Statistic.ID_LOOSE_GAME,
            paramA: pointId
        }, cntx.user.id, Kafka.TYPE_STATISTIC_RQ_DTO);
    };

};
/**
 * Статичный класс.
 * @type {SAPIUser}
 */
SAPIUser = new SAPIUser();
