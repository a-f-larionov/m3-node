SAPILogs = function () {

    this.log = function (cntx, message, level, details) {
        if (!cntx.isAuthorized) return Logs.log(arguments.callee.name + " not authorized", Logs.LEVEL_WARNING, cntx);
        if (!cntx.user) return Logs.log(arguments.callee.name + " not user", Logs.LEVEL_WARNING, cntx);
        if (!cntx.user.id) return Logs.log(arguments.callee.name + " not user id", Logs.LEVEL_WARNING, cntx);

        Logs.log(message, level, details, Logs.CHANNEL_CLIENT);
    };
};

SAPILogs = new SAPILogs();