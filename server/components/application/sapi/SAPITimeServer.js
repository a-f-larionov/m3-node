const Kafka = require("../../base/Kafka.js").Kafka

SAPITimeServer = function () {

    /**
     * Send server time to client.
     * @param cntx
     */
    this.sendMeTime = function (cntx) {
        Kafka.sendToCommon({connectionId : cntx.cid}, undefined, Kafka.TYPE_SENDMETIME_RQ_DTO);
    };
};

/**
 * Static class
 * @type {SAPITimeServer}
 */
SAPITimeServer = new SAPITimeServer();