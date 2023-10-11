const Kafka = require("../../base/Kafka.js").Kafka

const LogicTimeServer = require("../logic/LogicTimeServer.js").LogicTimeServer;

SAPITimeServer = function () {

    /**
     * Send server time to client.
     * @param cntx
     */
    this.sendMeTime = function (cntx) {
        let prid = pStart(Profiler.ID_SEND_ME_TIME)
        /** Единственный случай, когда оптравка идёт не по user.id */
        ApiRouter.executeRequest(
            'CAPITimeServer',
            'gotServerTime',
            [LogicTimeServer.getMTime()],
            [cntx]
        );
        pFinish(prid);
        //@todo-method
        Kafka.sendToCommon({connectionId : cntx.cid}, undefined, "SendMeTimeRqDto");
    };
};

/**
 * Static class
 * @type {SAPITimeServer}
 */
SAPITimeServer = new SAPITimeServer();