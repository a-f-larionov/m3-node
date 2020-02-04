LogicTimeClient = function () {

    /**
     * Server time
     * @type {number}
     */
    let serverTime = 0;
    /**
     * Time of receipt
     * @type {number}
     */
    let gotTime = 0;

    /**
     * Server vs client diff time
     * @type {number}
     */
    let timeDiff = 0;

    this.setServerTime = function (timestamp) {
        serverTime = timestamp;
        gotTime = (new Date).getTime();
        timeDiff = serverTime - gotTime;
        Logs.log("Got server time: servertime:" + timestamp + ' gotTime:' + gotTime + ' timeDiff:' + timeDiff, Logs.LEVEL_NOTIFY);
    };

    this.getTime = function () {
        return Math.floor(((new Date()).getTime() + timeDiff) / 1000);
    };

    this.getMicroTime = function () {
        return new Date().getTime() + timeDiff;
    };

    this.convertToClient = function (timestamp) {
        let newTimestamp;
        newTimestamp = timestamp - timeDiff;
        return newTimestamp;
    };
};

LogicTimeClient = new LogicTimeClient();