SAPITimeServer = function () {

    /**
     * Send server time to client.
     * @param cntx
     */
    this.sendMeTime = function (cntx) {
        /** Единственный случай, когда оптравка идёт не по user.id */
        ApiRouter.executeRequest(
            'CAPITimeServer',
            'gotServerTime',
            [LogicTimeServer.getMicroTime()],
            [cntx]
        );
    };
};

/**
 * Static class
 * @type {SAPITimeServer}
 */
SAPITimeServer = new SAPITimeServer();