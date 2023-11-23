const Kafka = require("../../base/Kafka.js").Kafka

SAPITimeServer = function () {

    this.sendMeTime = function (cntx) {
        Kafka.sendToCommon({connectionId : cntx.cid}, undefined, Kafka.TYPE_SENDMETIME_RQ_DTO);
    };
};

/**
 * Static class
 * @type {SAPITimeServer}
 */
SAPITimeServer = new SAPITimeServer();