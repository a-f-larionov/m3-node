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

    this.sendUserAgent = function (cntx, userAgentString) {
        DataUser.updateUserAgentString(cntx.user.id, userAgentString);
    };

    this.showMoneyDialog = function (cntx, message) {

        Logs.log("Игрок " + cntx.user.socNetUserId + " Открыл диалог покупки голосов: " + message,
            Logs.LEVEL_NOTIFY, null, null, true);
    };


    this.closeMoneyDialog = function (cntx) {

        Logs.log("Игрок:" + cntx.user.socNetUserId + "  Закрыл диалог покупки голосов", Logs.LEVEL_NOTIFY, null, null, true);
    };

    this.showStuffShopDialog = function (cntx, stuffFieldName) {

        Logs.log("Игрок:" + cntx.user.socNetUserId + " открыл покупку магии " + stuffFieldName, Logs.LEVEL_NOTIFY, null, null, true);
    }
};

SAPILogs = new SAPILogs();