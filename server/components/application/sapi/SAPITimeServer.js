SAPITimeServer = function () {

    /**
     * Send server time to client.
     * @param cntx
     */
    this.sendMeTime = function (cntx) {
        CAPITimeServer.gotServerTime(cntx.userId, LogicTimeServer.getCurrentTime());
    };
};

/**
 * Static class
 * @type {SAPITimeServer}
 */
SAPITimeServer = new SAPITimeServer();