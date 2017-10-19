LogicTimeClient = function () {

    /**
     * Server time
     * @type {number}
     */
    var serverTime = 0;
    /**
     * Time of receipt
     * @type {number}
     */
    var gotTime = 0;

    /**
     * Server vs client diff time
     * @type {number}
     */
    var timeDiff = 0;

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
        var newTimestamp;
        newTimestamp = timestamp - timeDiff;
        return newTimestamp;
    };
};

LogicTimeClient = new LogicTimeClient();