SAPITimeServer = function () {

    /**
     * Send server time to client.
     * @param cntx
     */
    this.sendMeTime = function (cntx) {
        if (!cntx.isAuthorized) return Logs.log(arguments.callee.name + " not authorized", Logs.LEVEL_WARNING, cntx);
        if (!cntx.user) return Logs.log(arguments.callee.name + " not user", Logs.LEVEL_WARNING, cntx);
        if (!cntx.user.id) return Logs.log(arguments.callee.name + " not user id", Logs.LEVEL_WARNING, cntx);

        CAPITimeServer.gotServerTime(cntx.userId, LogicTimeServer.getCurrentTime());
    };
};

/**
 * Static class
 * @type {SAPITimeServer}
 */
SAPITimeServer = new SAPITimeServer();