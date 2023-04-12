const { Kafka } = require("kafkajs")

const kafka = new Kafka({
    clientId: 'node',
    brokers: [
        "kafka:9092",
    ]
});


const producer = kafka.producer()
const consumer = kafka.consumer({ groupId: '1' })

const run = async () => {
    // Producing
    await producer.connect()

    // Consuming
    await consumer.connect()

    await consumer.subscribe({ topic: 't-node', fromBeginning: true })

    await consumer.run({
        eachMessage: async ({ topic, partition, message }) => {

            console.log("You do it!" + topic + " ");

            console.log({
                partition,
                offset: message.offset,
                value: message.value.toString(),
                headers: message.headers,
                __TypeId__: message.headers.__TypeId__,
                __TypeId__: message.headers.__TypeId__.toString(),
                message: message
            })

            switch (message.headers.__TypeId__.toString()) {
                case 'm3.users.dto.rs.UpdateUserListInfoRsDto':
                    CAPIUser.updateUserListInfo(
                        JSON.parse(message.value.toString()).toUserId,
                        JSON.parse(message.value.toString()).list
                    );
                    break;
                default:
                    console.log("default---------);");
            }

            console.log("You do it!");
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

    this.updateLastLogout = function (userId) {
        this.sendToT_Users({
            userId: userId
        }, 'UpdateLastLogoutRqDto');
    };

    this.updateLastLogin = function (userId) {
        this.sendToT_Users({
            userId: userId
        }, 'UpdateLastLoginRqDto');
    }

    this.sendUserListInfo = function (ids, toUserId) {
        this.sendToT_Users({
            toUserId: toUserId,
            ids: ids
        }, "SendMeUserInfoRqDto");
    }

    this.sendToT_Users = function (value, type) {
        this.send("t-users", value, type);
    }

    this.send = function (topic, value, type) {
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
module.exports = { KafkaModule }
