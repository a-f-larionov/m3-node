SAPIStuff = function () {

    this.sendMeStuff = function (cntx) {
        if (!cntx.user) return Logs.log("send-me-stuff not user", Logs.LEVEL_WARNING, cntx);
        if (!cntx.user.id) return Logs.log("send-me-stuff not user id", Logs.LEVEL_WARNING, cntx);
        LogicStuff.sendStuffToUser(cntx.user.id);
    };
};

SAPIStuff = new SAPIStuff();