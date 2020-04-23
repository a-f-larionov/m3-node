let CAPITimeServer = function () {

    /**
     * Got a serverTime time
     * @param cntx
     * @param time
     */
    this.gotServerTime = function (cntx, time) {
        LogicTimeClient.setServerTime(time);
    };
};


/**
 * Static class
 * @type {CAPITimeServer}
 */
CAPITimeServer = new CAPITimeServer();