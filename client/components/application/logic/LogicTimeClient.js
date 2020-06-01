/**
 * @type {LogicTimeClient}
 * @constructor
 */
let LogicTimeClient = function () {

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
        gotTime = Date.now();
        timeDiff = serverTime - gotTime;
        Logs.log("Time sync:" +
            //            timestamp +
            //          ' gotTime:' + gotTime +
            ' timeDiff:' + timeDiff
            , Logs.LEVEL_DETAIL);
    };

    this.getTime = function () {
        return Math.floor(this.getMTime() / 1000);
    };

    this.getMTime = function () {
        return Date.now();
    };

    this.convertToClient = function (timestamp) {
        let newTimestamp;
        newTimestamp = timestamp * 1000 - timeDiff;
        return newTimestamp / 1000;
    };
};

LogicTimeClient = new LogicTimeClient();