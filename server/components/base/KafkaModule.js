const {Kafka} = require("kafkajs");
//const { LogicUser } = require("../application/logic/LogicUser.js");

//const CAPIUser = require("../generated/CAPIUser.js");

const kafka = new Kafka({
    clientId: 'node',
    brokers: [
        "kafka:9092",
    ]
});


const producer = kafka.producer()
const consumer = kafka.consumer({groupId: '1'})

const run = async () => {
    // Producing
    await producer.connect()

    // Consuming
    await consumer.connect()

    await consumer.subscribe({topic: 't-node', fromBeginning: true})

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


            try {
                switch (message.headers.__TypeId__.toString()) {

                    case 'm3.users.dto.rs.UpdateUserListInfoRsDto':
                        CAPIUser.updateUserListInfo(
                            msg.userId,
                            msg.list
                        );
                        break;
                    case 'm3.users.dto.rs.AuthSuccessRsDto':
                        let cntx = ApiRouter.getConnectContext(msg.connectionId);

                        LogicUser.userAddConn(msg.userId, msg.socNetUserId, cntx);
                        CAPIUser.authorizeSuccess(
                            msg.userId,
                            msg
                        );
                        break;
                    case 'm3.users.dto.rs.GotMapFriendIdsRsDto':
                        console.log(CAPIUser.gotMapFriendIds);
                        CAPIUser.gotMapFriendIds(
                            msg.userId,
                            msg.mapId,
                            msg.ids);
                        break;
                    case 'm3.users.dto.rs.GotFriendsIdsRsDto':
                        CAPIUser.gotFriendsIds(
                            msg.userId,
                            msg.fids
                        );
                        break;
                    case 'm3.users.dto.rs.GotTopUsersRsDto':
                        CAPIUser.gotTopUsers(
                            msg.userId,
                            msg.users
                        );
                        break;
                    case 'm3.users.dto.rs.SendMeScoresRsDto':
                        CAPIUser.gotScores(
                            msg.userId,
                            msg.pids,
                            msg.uids
                        );
                        break;
                    case 'm3.users.dto.rs.SetOneHealthHideRsDto':
                        CAPIUser.setOneHealthHide(
                            msg.userId,
                            msg.oneHealthHide,
                            msg.fullRecoveryTime
                        );
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
 * @type {KafkaModule}
 */
var KafkaModule = function () {
    let self = this;

    this.init = function (afterInitCallback) {

        Logs.log("Kafka Init create Pool.", Logs.LEVEL_NOTIFY);
        afterInitCallback();
    };

    this.auth = function (authParams) {
        this.sendToT_Users(authParams, 'AuthRqDto');
    }

    this.updateLastLogout = function (userId) {
        this.sendToT_Users({userId: userId}, 'UpdateLastLogoutRqDto');
    };

    this.updateLastLogin = function (userId) {
        this.sendToT_Users({userId: userId}, 'UpdateLastLoginRqDto');
    }

    this.sendUserListInfo = function (ids, userId) {
        this.sendToT_Users({userId: userId, ids: ids}, "SendUserListInfoRqDto");
    }

    this.sendMapFriends = function (mapId, fids, userId) {
        this.sendToT_Users({userId: userId, mapId: mapId, fids: fids}, "SendMapFriendsRqDto");
    }

    this.sendFriendIdsBySocNet = function (fids, userId) {
        this.sendToT_Users({userId: userId, friendSocNetIds: fids}, "SendFriendIdsBySocNetRqDto")
    }
    this.sendTopUsers = function (fids, userId) {
        this.sendToT_Users({userId: userId, fids: fids}, "SendTopUsersRqDto")
    }
    this.sendScores = function (pids, uids, userId) {
        this.sendToT_MapsAndPoints({userId: userId, pids: pids, uids: uids}, "SendScoresRqDto")
    }
    this.healthBack = function (userId) {
        this.sendToT_Users({userId: userId}, "HealthBackRqDto")
    }
    this.healthDown = function (pointId, userId) {
        this.sendToT_Users({userId: userId, pointId: pointId}, "HealthDownRqDto")
    }
    this.spendTurnsMoney = function (pointId, userId) {
        this.sendToT_Users({userId: userId, pointId: pointId}, "SpendTurnsMoneyRqDto")
    }
    this.zeroLife = function (userId) {
        this.sendToT_Users({userId: userId}, "ZeroLifeRqDto")
    }

    this.sendToT_Users = function (value, type) {
        this.send("t-users", value, type);
    }

    this.sendToT_MapsAndPoints = function (value, type) {
        this.send("t-map-and-points", value, type);
    }

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

KafkaModule = new KafkaModule();
KafkaModule.depends = ['Logs'];
global['KafkaModule'] = KafkaModule;
module.exports = {KafkaModule}
