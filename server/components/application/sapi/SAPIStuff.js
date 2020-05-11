var AsyncLock = require('async-lock');
var LOCK = new AsyncLock();

SAPIStuff = function () {

    this.sendMeStuff = function (cntx) {
        if (!cntx.isAuthorized) return Logs.log(arguments.callee.name + " not authorized", Logs.LEVEL_WARNING, cntx);
        if (!cntx.user) return Logs.log(arguments.callee.name + " not user", Logs.LEVEL_WARNING, cntx);
        if (!cntx.user.id) return Logs.log(arguments.callee.name + " not user id", Logs.LEVEL_WARNING, cntx);

        LogicStuff.sendStuffToUser(cntx.user.id);
    };

    this.usedHummer = function (cntx) {
        if (!cntx.isAuthorized) return Logs.log(arguments.callee.name + " not authorized", Logs.LEVEL_WARNING, cntx);
        if (!cntx.user) return Logs.log(arguments.callee.name + " not user", Logs.LEVEL_WARNING, cntx);
        if (!cntx.user.id) return Logs.log(arguments.callee.name + " not user id", Logs.LEVEL_WARNING, cntx);

        DataStuff.usedHummer(cntx.user.id, LogicTid.getOne());
    };

    this.usedShuffle = function (cntx) {
        if (!cntx.isAuthorized) return Logs.log(arguments.callee.name + " not authorized", Logs.LEVEL_WARNING, cntx);
        if (!cntx.user) return Logs.log(arguments.callee.name + " not user", Logs.LEVEL_WARNING, cntx);
        if (!cntx.user.id) return Logs.log(arguments.callee.name + " not user id", Logs.LEVEL_WARNING, cntx);

        DataStuff.usedShuffle(cntx.user.id, LogicTid.getOne());
    };

    this.usedlightning = function (cntx) {
        if (!cntx.isAuthorized) return Logs.log(arguments.callee.name + " not authorized", Logs.LEVEL_WARNING, cntx);
        if (!cntx.user) return Logs.log(arguments.callee.name + " not user", Logs.LEVEL_WARNING, cntx);
        if (!cntx.user.id) return Logs.log(arguments.callee.name + " not user id", Logs.LEVEL_WARNING, cntx);

        DataStuff.usedlightning(cntx.user.id, LogicTid.getOne());
    };

    this.buyHummer = function (cntx, itemIndex) {
        if (!cntx.isAuthorized) return Logs.log(arguments.callee.name + " not authorized", Logs.LEVEL_WARNING, cntx);
        if (!cntx.user) return Logs.log(arguments.callee.name + " not user", Logs.LEVEL_WARNING, cntx);
        if (!cntx.user.id) return Logs.log(arguments.callee.name + " not user id", Logs.LEVEL_WARNING, cntx);

        if (!DataShop.hummers[itemIndex]) return Logs.log("no item hummer " + itemIndex, Logs.LEVEL_WARNING, cntx);
        let tid;

        DataStuff.usedGold(cntx.user.id, DataShop.hummers[itemIndex].gold, tid = LogicTid.getOne(), function (success) {
            if (success)
                DataStuff.giveAHummer(cntx.user.id, DataShop.hummers[itemIndex].quantity, tid);
        });
    };

    this.buyShuffle = function (cntx, itemIndex) {
        if (!cntx.isAuthorized) return Logs.log(arguments.callee.name + " not authorized", Logs.LEVEL_WARNING, cntx);
        if (!cntx.user) return Logs.log(arguments.callee.name + " not user", Logs.LEVEL_WARNING, cntx);
        if (!cntx.user.id) return Logs.log(arguments.callee.name + " not user id", Logs.LEVEL_WARNING, cntx);

        if (!DataShop.shuffle[itemIndex]) return Logs.log("no item shuffle " + itemIndex, Logs.LEVEL_WARNING, cntx);
        let tid;

        DataStuff.usedGold(cntx.user.id, DataShop.shuffle[itemIndex].gold, tid = LogicTid.getOne(), function (success) {
            if (success)
                DataStuff.giveAShuffle(cntx.user.id, DataShop.shuffle[itemIndex].quantity, tid);
        });
    };

    this.buylightning = function (cntx, itemIndex) {
        if (!cntx.isAuthorized) return Logs.log(arguments.callee.name + " not authorized", Logs.LEVEL_WARNING, cntx);
        if (!cntx.user) return Logs.log(arguments.callee.name + " not user", Logs.LEVEL_WARNING, cntx);
        if (!cntx.user.id) return Logs.log(arguments.callee.name + " not user id", Logs.LEVEL_WARNING, cntx);

        if (!DataShop.lightning[itemIndex]) return Logs.log("no item hummer " + itemIndex, Logs.LEVEL_WARNING, cntx);

        let tid;
        DataStuff.usedGold(cntx.user.id, DataShop.lightning[itemIndex].gold, tid = LogicTid.getOne(), function (success) {
            if (success)
                DataStuff.giveALightning(cntx.user.id, DataShop.lightning[itemIndex].quantity, tid);
        });
    };

    this.buyHealth = function (cntx) {
        if (!cntx.isAuthorized) return Logs.log(arguments.callee.name + " not authorized", Logs.LEVEL_WARNING, cntx);
        if (!cntx.user) return Logs.log(arguments.callee.name + " not user", Logs.LEVEL_WARNING, cntx);
        if (!cntx.user.id) return Logs.log(arguments.callee.name + " not user id", Logs.LEVEL_WARNING, cntx);

        let tid = LogicTid.getOne();

        LOCK.acquire(Keys.health(cntx.user.id), function (done) {
                setTimeout(done, 5 * 60 * 1000);
                DataUser.getById(cntx.user.id, function (user) {
                    if (LogicHealth.getHealths(user) > 0) {
                        Logs.log("Health tid:" + tid + " uid:" + user.id + " NO ZERO", Logs.LEVEL_DETAIL, user, Logs.CHANNEL_VK_HEALTH);
                        done();
                    } else {
                        DataStuff.usedGold(cntx.user.id, DataShop.healthPrice, tid, function (success) {
                            if (!success) {
                                Logs.log("Health tid:" + tid + " uid:" + user.id + " CANCEL", Logs.LEVEL_DETAIL, user, Logs.CHANNEL_VK_HEALTH);
                                done();
                            } else {
                                Logs.log("Health tid:" + tid + " uid:" + user.id + " +" + LogicHealth.getMaxHealth() + " OK", Logs.LEVEL_DETAIL, user, Logs.CHANNEL_VK_HEALTH);
                                LogicHealth.setMaxHealth(user);
                                DataUser.updateHealthAndStartTime(user, function () {
                                        CAPIUser.updateUserInfo(cntx.user.id, user);
                                        done();
                                    }
                                )
                            }
                        });
                    }
                })
            }
        );
    }
};

SAPIStuff = new SAPIStuff();