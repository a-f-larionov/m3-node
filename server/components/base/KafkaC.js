const { Kafka } = require('kafkajs')

const kafka = new Kafka({
          clientId: 'node',
          brokers: ['kafka:9092'],
        })


const producer = kafka.producer()
const consumer = kafka.consumer({ groupId: 'test-group' })

const run = async () => {
  // Producing
  await producer.connect()

 // Consuming
  await consumer.connect()
  await consumer.subscribe({ topic: 'topic5', fromBeginning: true })

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {

      console.log({
        partition,
        offset: message.offset,
        value: message.value.toString(),
      })

        console.log("You do it!");
    },
  })
 }


 run().catch(console.error);

let KafkaC = function () {
    let self = this;

    this.init = function (afterInitCallback) {

        Logs.log("Kafka Init create Pool.", Logs.LEVEL_NOTIFY);

        afterInitCallback();
    };


    this.send = function(msg){
        producer.send({
              topic: 'topic4',
              messages: [
                { value: msg },
              ],
        })

    }

};

KafkaC = new KafkaC();

KafkaC.depends = ['Logs'];

global['KafkaC'] = KafkaC;