const KafkaJS = require("kafkajs").Kafka;
//const { LogicUser } = require("../application/logic/LogicUser.js");

//const CAPIUser = require("../generated/CAPIUser.js");

const kafkaJs = new KafkaJS({
    clientId: 'node',
    brokers: [
        "kafka:9092",
    ]
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

            console.log("KAFKA<<< " + topic);
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
                        CAPITimeServer.gotServerTime(cntx, msg);
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
    let self = this;

    this.TOPIC_USERS = "topic-users";
    this.TOPIC_MAP_AND_POINTS = "topic-map-and-points";
    this.TOPIC_STUFF = "topic-stufs";
    this.TOPIC_COMMON = "topic-common";
    this.TOPIC_PAYMENTS = "topic-payments";

    this.init = function (afterInitCallback) {

        Logs.log("Kafka Init create Pool.", Logs.LEVEL_DEBUG);
        afterInitCallback();
    };

    this.sendToUsers = function (fields, userId, type) {
        fields.userId = userId;
        this.send(this.TOPIC_USERS, fields, type);
    }

    this.sendToMapAndPoints = function (fields, userId, type) {
        fields.userId = userId;
        this.send(this.TOPIC_MAP_AND_POINTS, fields, type);
    }

    this.sendToStuff = function (fields, userId, type) {
        fields.userId = userId;
        this.send(this.TOPIC_STUFF, fields, type);
    }

    this.sendToPayment = function (fields, userId, type) {
        fielsd.userId = userId;
        this.send(this.TOPIC_PAYMENTS, fields, type);
    }

    this.sendToCommon = function (fields, userId, type) {
        this.send(this.TOPIC_COMMON, fields, type);
    };

    this.send = function (topic, value, type) {
        console.log("KAFKA>>> " + topic, type, JSON.stringify(value));
        producer.send({
            topic: topic,
            messages: [
                {
                    value: JSON.stringify(value),
                    headers: {
                        '__TypeId__': "m3.users.dto.rq." + type
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