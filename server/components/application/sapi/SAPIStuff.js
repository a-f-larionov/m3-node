SAPIStuff = function () {

    this.sendMeStuff = function (cntx) {
        if (!cntx.user) return Logs.log("send-me-stuff not user", Logs.LEVEL_WARNING, cntx);
        if (!cntx.user.id) return Logs.log("send-me-stuff not user id", Logs.LEVEL_WARNING, cntx);
        LogicStuff.sendStuffToUser(cntx.user.id);
    };

    this.usedHummer = function (cntx) {
        if (!cntx.user) return Logs.log("used stuff not user", Logs.LEVEL_WARNING, cntx);
        if (!cntx.user.id) return Logs.log("user stuff not user id", Logs.LEVEL_WARNING, cntx);

        LogicStuff.usedHummer(cntx.user.id);
    };

    this.usedShuffle = function (cntx) {
        if (!cntx.user) return Logs.log("used stuff not user", Logs.LEVEL_WARNING, cntx);
        if (!cntx.user.id) return Logs.log("user stuff not user id", Logs.LEVEL_WARNING, cntx);

        LogicStuff.usedShuffle(cntx.user.id);
    };

    this.usedLighting= function (cntx) {
        if (!cntx.user) return Logs.log("used stuff not user", Logs.LEVEL_WARNING, cntx);
        if (!cntx.user.id) return Logs.log("user stuff not user id", Logs.LEVEL_WARNING, cntx);

        LogicStuff.usedLighting(cntx.user.id);
    };


};

SAPIStuff = new SAPIStuff();