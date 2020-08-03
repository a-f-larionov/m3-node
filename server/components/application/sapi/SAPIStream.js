SAPIStream = function () {

    this.send = function (cntx, data) {
        if (!cntx.isAuthorized) return Logs.log(arguments.callee.name + " not authorized", Logs.LEVEL_WARNING, cntx);
        if (!cntx.user) return Logs.log(arguments.callee.name + " not user", Logs.LEVEL_WARNING, cntx);
        if (!cntx.user.id) return Logs.log(arguments.callee.name + " not user id", Logs.LEVEL_WARNING, cntx);

        console.log(data, data.length, typeof data, data.size);
    };
};

/**
 * @type {SAPIStream}
 */
SAPIStream = new SAPIStream();