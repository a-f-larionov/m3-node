const KafkaJS = require("kafkajs").Kafka;
//const { LogicUser } = require("../application/logic/LogicUser.js");

//const CAPIUser = require("../generated/CAPIUser.js");

const kafkaJs = new KafkaJS({
    clientId: "node-client",
    brokers: [
        "kafka:9092",
    ],
    retry: {
        initialRetryTime: 100,
        retries: 888
    }
});

const producer = kafkaJs.producer()
const consumer = kafkaJs.consumer({groupId: '1'})

const run = async () => {
    // Producing
    await producer.connect()

    // Consuming
    await consumer.connect()

    await consumer.subscribe({topic: 'topic-client', fromBeginning: true})

    await consumer.run({
        eachMessage: async ({topic, partition, message}) => {

            let msg = JSON.parse(message.value.toString());

            console.log("KAFKA." + topic + " > node");
            console.log(message.headers.__TypeId__.toString(), message.value.toString());

            // console.log({
            //     topic,
            //     partition,
            //     //offset: message.offset,
            //     //  value: message.value.toString(),
            //     //headers: message.headers,
            //     //__TypeId__: message.headers.__TypeId__,
            //     //__TypeId__: message.headers.__TypeId__.toString(),
            //     message: message
            // })

            // to client
            try {
                switch (message.headers.__TypeId__.toString()) {

                    // USERS
                    case 'm3.users.dto.rs.UpdateUserListInfoRsDto':
                        CAPIUser.updateUserListInfo(msg.userId,
                            msg.list
                        );
                        break;
                    case 'm3.users.dto.rs.AuthSuccessRsDto':
                        var cntx = ApiRouter.getConnectContext(msg.connectionId);
                        LogicUser.userAddConn(msg.id, msg.socNetUserId, cntx);
                        CAPIUser.authorizeSuccess(msg.userId,
                            {
                                id: msg.id,
                                connectionId: msg.connectionId,
                                createTm: msg.createTm,
                                firstName: msg.firstName,
                                fullRecoveryTime: msg.fullRecoveryTime,
                                lastName: msg.lastName,
                                loginTm: msg.loginTm,
                                logoutTm: msg.logoutTm,
                                nextPointId: msg.nextPointId,
                                online: msg.online,
                                photo50: msg.photo50,
                                photo100: msg.photo100,
                                socNetTypeId: msg.socNetTypeId,
                                socNetUserId: msg.socNetUserId,
                            }
                        );

                        break;
                    case 'm3.users.dto.rs.GotMapFriendIdsRsDto':
                        console.log(CAPIUser.gotMapFriendIds);
                        CAPIUser.gotMapFriendIds(msg.userId,
                            msg.mapId,
                            msg.ids);
                        break;
                    case 'm3.users.dto.rs.GotFriendsIdsRsDto':
                        CAPIUser.gotFriendsIds(msg.userId,
                            msg.fids
                        );
                        break;
                    case 'm3.users.dto.rs.GotTopUsersRsDto':
                        CAPIUser.gotTopUsers(msg.userId,
                            msg.users
                        );
                        break;
                    case 'm3.users.dto.rs.SendMeScoresRsDto':
                        CAPIUser.gotScores(msg.userId,
                            msg.pids,
                            msg.uids
                        );
                        break;
                    case 'm3.users.dto.rs.SetOneHealthHideRsDto':
                        CAPIUser.setOneHealthHide(msg.userId,
                            msg.oneHealthHide,
                            msg.fullRecoveryTime
                        );
                        break;
                    case 'm3.users.dto.rs.UpdateUserInfoRsDto':
                        CAPIUser.updateUserInfo(msg.userId, msg);
                        break;
                    // COMMMON
                    case 'm3.common.dto.rs.UpdateTimeRsDto':
                        var cntx = ApiRouter.getConnectContext(msg.connectionId);
                        ApiRouter.executeRequest("CAPITimeServer", "gotServerTime", [msg.timestamp], [cntx]);
                        break;
                    case 'm3.gameplay.dto.rs.GotMapInfoRsDto':
                        CAPIMap.gotMapsInfo(msg.userId, msg.mapId, msg.map, msg.points);
                        break;
                    case 'm3.gameplay.dto.rs.GotStuffRsDto':
                        CAPIStuff.gotStuff(msg.userId, msg);
                        break;
                    case 'm3.lib.dto.rs.ErrorRsDto':
                        CAPILog.log(msg.userId, msg);
                        break;
                    case 'm3.gameplay.dto.rs.GotPointTopScoreRsDto':
                        CAPIMap.gotPointTopScore(msg.userId, msg.pointId, msg);
                        break;
                    default:
                        console.log("Not found method");
                }
            } catch (e) {
                console.log(e);
            }
        },
    })
}


run().catch(console.error);

/**
 * @type {Kafka}
 */
var Kafka = function () {

    this.TOPIC_USERS = "topic-users";
    this.TOPIC_GAMEPLAY = "topic-gameplay";

    this.RQ_NS_LIB = "m3.lib.dto.rq";
    this.RQ_NS_USERS = "m3.users.dto.rq";
    this.RQ_NS_COMMON = "m3.common.dto.rq";
    this.RQ_NS_GAMEPLAY = "m3.gameplay.dto.rq";

    this.TYPE_STATISTIC_RQ_DTO = this.RQ_NS_LIB + ".StatisticRqDto";

    this.TYPE_LOG_RQ_DTO = this.TOPIC_GAMEPLAY + ".LogRqDto";
    this.TYPE_SENDMETIME_RQ_DTO = this.RQ_NS_COMMON + ".SendMeTimeRqDto";
    this.TYPE_SENDUSERAGENT_RQ_DTO = this.RQ_NS_COMMON + ".SendUserAgentRqDto";
    this.TYPE_SEND_ME_STUFF_RQ_DTO = this.RQ_NS_COMMON + ".SendMeStuffRqDto";

    this.TYPE_UPDATE_LAST_LOGOUT_RQ_DTO = this.RQ_NS_USERS + ".UpdateLastLogoutRqDto";
    this.TYPE_AUTH_RQ_DTO = this.RQ_NS_USERS + ".AuthRqDto";
    this.TYPE_SEND_USER_LIST_INFO_RQ_DTO = this.RQ_NS_USERS + ".SendUserListInfoRqDto";
    this.TYPE_SEND_MAP_FRIENDS_RQ_DTO = this.RQ_NS_USERS + ".SendMapFriendsRqDto";
    this.TYPE_SEND_FRIEND_IDS_BY_SOCNET_RQ_DTO = this.RQ_NS_USERS + ".SendFriendIdsBySocNetRqDto";
    this.TYPE_SEND_TOP_USERS_RQ_DTO = this.RQ_NS_USERS + ".SendTopUsersRqDto";
    this.TYPE_HEALTH_BACK_RQ_DTO = this.RQ_NS_USERS + ".HealthBackRqDto";
    this.TYPE_ZERO_LIFE_RQ_DTO = this.RQ_NS_USERS + ".ZeroLifeRqDto";
    this.TYPE_HEALTH_DOWN_RQ_DTO = this.RQ_NS_USERS + ".HealthDownRqDto";

    this.TYPE_SEND_ME_MAP_INFO_RQ_DTO = this.RQ_NS_GAMEPLAY + ".SendMeMapInfoRqDto";
    this.TYPE_ON_FINISH_RQ_DTO = this.RQ_NS_GAMEPLAY + ".OnFinishRqDto";
    this.TYPE_SEND_ME_SCORES_RQ_DTO = this.RQ_NS_GAMEPLAY + ".SendMeScoresRqDto";
    this.TYPE_SEND_ME_POINT_TOP_SCORE_RQ_DTO = this.RQ_NS_GAMEPLAY + ".SendMePointTopScoreRqDto";

    this.TYPE_USED_HUMMER_RQ_DTO = this.RQ_NS_GAMEPLAY + ".UsedHummerRqDto";
    this.TYPE_USED_LIGHTNING_RQ_DTO = this.RQ_NS_GAMEPLAY + ".UsedLightningRqDto";
    this.TYPE_USED_SHUFFLE_RQ_DTO = this.RQ_NS_GAMEPLAY + ".UsedShuffleRqDto";
    this.TYPE_SPEND_COINS_FOR_TURNS_RQ_DTO = this.RQ_NS_GAMEPLAY + ".SpendCoinsForTurnsRqDto";

    this.TYPE_BUY_HUMMER_RQ_DTO = this.RQ_NS_COMMON + ".BuyHummerRqDto";
    this.TYPE_BUY_SHUFFLE_RQ_DTO = this.RQ_NS_COMMON + ".BuyShuffleRqDto";
    this.TYPE_BUY_LIGHTNING_RQ_DTO = this.RQ_NS_COMMON + ".BuyLightningRqDto";
    this.TYPE_BUY_HEALTH_RQ_DTO = this.RQ_NS_COMMON + ".BuyHealthRqDto";

    this.init = function (afterInitCallback) {
        Logs.log("Kafka Init create Pool.", Logs.LEVEL_DEBUG);
        afterInitCallback();
    };

    this.sendToUsers = function (fields, userId, type) {
        fields.userId = userId;
        this.send(this.TOPIC_USERS, fields, type);
    }

    this.sendToCommon = function (fields, userId, type) {
        fields.userId = userId;
        this.send(this.TOPIC_COMMON, fields, type);
    };

    this.sendToMap = function (fields, userId, type) {
        fields.userId = userId;
        this.send(this.TOPIC_GAMEPLAY, fields, type);
    }

    this.sendToStuff = function (fields, userId, type) {
        fields.userId = userId;
        this.send(this.TOPIC_COMMON, fields, type);
    }

    this.sendToPayments = function (fields, userId, type) {
        fields.userId = userId;
        this.send(this.TOPIC_COMMON, fields, type);
    }

    this.send = function (topic, value, type) {
        console.log("KAFKA." + topic + " < ", type, JSON.stringify(value));
        producer.send({
            topic: topic,
            messages: [
                {
                    value: JSON.stringify(value),
                    headers: {
                        '__TypeId__': type
                    }
                }
            ]
        });
    }
};

Kafka = new Kafka();
Kafka.depends = ['Logs'];
global['Kafka'] = Kafka;
module.exports = {Kafka: Kafka}
