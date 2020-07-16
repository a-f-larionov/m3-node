SAPILogs = function () {

    this.log = function (cntx, message, level, details) {
        if (!cntx.isAuthorized) return Logs.log(arguments.callee.name + " not authorized", Logs.LEVEL_WARNING, cntx);
        if (!cntx.user) return Logs.log(arguments.callee.name + " not user", Logs.LEVEL_WARNING, cntx);
        if (!cntx.user.id) return Logs.log(arguments.callee.name + " not user id", Logs.LEVEL_WARNING, cntx);

        let prid = pStart(Profiler.ID_SAPILOGS_LOG);

        Logs.log(message, level, details, Logs.CHANNEL_CLIENT);

        pFinish(prid);
    };

    this.clientLoaded = function (cntx, prid) {
        if (!cntx.isAuthorized) return Logs.log(arguments.callee.name + " not authorized", Logs.LEVEL_WARNING, cntx);
        if (!cntx.user) return Logs.log(arguments.callee.name + " not user", Logs.LEVEL_WARNING, cntx);
        if (!cntx.user.id) return Logs.log(arguments.callee.name + " not user id", Logs.LEVEL_WARNING, cntx);

        pFinish(prid);
    };

    this.showMoneyDialog = function (cntx) {

        Logs.log("uid:" + cntx.user.id + " Show money dialog", Logs.LEVEL_NOTIFY, null, null, true);
    };


    this.closeMoneyDialog = function (cntx) {

        Logs.log("uid:" + cntx.user.id + " Close money dialog", Logs.LEVEL_NOTIFY, null, null, true);
    };
};

SAPILogs = new SAPILogs();