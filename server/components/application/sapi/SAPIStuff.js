var AsyncLock = require('async-lock');
var LOCK = new AsyncLock();

SAPIStuff = function () {

    this.sendMeStuff = function (cntx) {
        if (!cntx.isAuthorized) return Logs.log(arguments.callee.name + " not authorized", Logs.LEVEL_WARNING, cntx);
        if (!cntx.user) return Logs.log(arguments.callee.name + " not user", Logs.LEVEL_WARNING, cntx);
        if (!cntx.user.id) return Logs.log(arguments.callee.name + " not user id", Logs.LEVEL_WARNING, cntx);

        LogicStuff.sendStuffToUser(cntx.user.id, pStart(Profiler.ID_SAPISTUFF_SEND_ME_STUFF));
    };

    this.usedHummer = function (cntx) {
        if (!cntx.isAuthorized) return Logs.log(arguments.callee.name + " not authorized", Logs.LEVEL_WARNING, cntx);
        if (!cntx.user) return Logs.log(arguments.callee.name + " not user", Logs.LEVEL_WARNING, cntx);
        if (!cntx.user.id) return Logs.log(arguments.callee.name + " not user id", Logs.LEVEL_WARNING, cntx);

        Statistic.write(cntx.userId, Statistic.ID_HUMMER_USE);
        let prid = pStart(Profiler.ID_SAPISTUFF_USED_HUMMER);
        DataStuff.usedHummer(cntx.user.id, LogicTid.getOne(), function () {
            pFinish(prid);
        });
    };

    this.usedLightning = function (cntx) {
        if (!cntx.isAuthorized) return Logs.log(arguments.callee.name + " not authorized", Logs.LEVEL_WARNING, cntx);
        if (!cntx.user) return Logs.log(arguments.callee.name + " not user", Logs.LEVEL_WARNING, cntx);
        if (!cntx.user.id) return Logs.log(arguments.callee.name + " not user id", Logs.LEVEL_WARNING, cntx);

        Statistic.write(cntx.userId, Statistic.ID_LIGHTNING_USE);
        let prid = pStart(Profiler.ID_SAPISTUFF_USED_LIGHTNING);
        DataStuff.usedLightning(cntx.user.id, LogicTid.getOne(), function () {
            pFinish(prid);
        });
    };

    this.usedShuffle = function (cntx) {
        if (!cntx.isAuthorized) return Logs.log(arguments.callee.name + " not authorized", Logs.LEVEL_WARNING, cntx);
        if (!cntx.user) return Logs.log(arguments.callee.name + " not user", Logs.LEVEL_WARNING, cntx);
        if (!cntx.user.id) return Logs.log(arguments.callee.name + " not user id", Logs.LEVEL_WARNING, cntx);

        Statistic.write(cntx.userId, Statistic.ID_SHUFFLE_USE);
        let prid = pStart(Profiler.ID_SAPISTUFF_USED_SHUFFLE);
        DataStuff.usedShuffle(cntx.user.id, LogicTid.getOne(), function () {
            pFinish(prid);
        });
    };

    this.buyHummer = function (cntx, itemIndex) {
        if (!cntx.isAuthorized) return Logs.log(arguments.callee.name + " not authorized", Logs.LEVEL_WARNING, cntx);
        if (!cntx.user) return Logs.log(arguments.callee.name + " not user", Logs.LEVEL_WARNING, cntx);
        if (!cntx.user.id) return Logs.log(arguments.callee.name + " not user id", Logs.LEVEL_WARNING, cntx);

        if (!DataShop.hummers[itemIndex]) return Logs.log("no item hummer " + itemIndex, Logs.LEVEL_WARNING, cntx);
        let tid;
        let prid = pStart(Profiler.ID_SAPISTUFF_BUY_HUMMER);
        DataStuff.usedGold(cntx.user.id, DataShop.hummers[itemIndex].gold, tid = LogicTid.getOne(), function (success) {
            if (success)
                DataStuff.giveAHummer(cntx.user.id, DataShop.hummers[itemIndex].quantity, tid, function () {
                    Statistic.write(cntx.userId, Statistic.ID_BUY_HUMMER, DataShop.hummers[itemIndex].quantity);
                    pFinish(prid);
                });
        });
    };

    this.buyLightning = function (cntx, itemIndex) {
        if (!cntx.isAuthorized) return Logs.log(arguments.callee.name + " not authorized", Logs.LEVEL_WARNING, cntx);
        if (!cntx.user) return Logs.log(arguments.callee.name + " not user", Logs.LEVEL_WARNING, cntx);
        if (!cntx.user.id) return Logs.log(arguments.callee.name + " not user id", Logs.LEVEL_WARNING, cntx);

        if (!DataShop.lightning[itemIndex]) return Logs.log("no item hummer " + itemIndex, Logs.LEVEL_WARNING, cntx);

        let tid;

        let prid = pStart(Profiler.ID_SAPISTUFF_BUY_LIGHTNING);

        DataStuff.usedGold(cntx.user.id, DataShop.lightning[itemIndex].gold, tid = LogicTid.getOne(), function (success) {
            if (success)
                DataStuff.giveALightning(cntx.user.id, DataShop.lightning[itemIndex].quantity, tid, function () {
                    Statistic.write(cntx.userId, Statistic.ID_BUY_LIGHTNING, DataShop.lightning[itemIndex].quantity);
                    pFinish(prid);
                });
        });
    };

    this.buyShuffle = function (cntx, itemIndex) {
        if (!cntx.isAuthorized) return Logs.log(arguments.callee.name + " not authorized", Logs.LEVEL_WARNING, cntx);
        if (!cntx.user) return Logs.log(arguments.callee.name + " not user", Logs.LEVEL_WARNING, cntx);
        if (!cntx.user.id) return Logs.log(arguments.callee.name + " not user id", Logs.LEVEL_WARNING, cntx);

        if (!DataShop.shuffle[itemIndex]) return Logs.log("no item shuffle " + itemIndex, Logs.LEVEL_WARNING, cntx);
        let tid;

        let prid = pStart(Profiler.ID_SAPISTUFF_BUY_SHUFFLE);

        DataStuff.usedGold(cntx.user.id, DataShop.shuffle[itemIndex].gold, tid = LogicTid.getOne(), function (success) {
            if (success)
                DataStuff.giveAShuffle(cntx.user.id, DataShop.shuffle[itemIndex].quantity, tid, function () {
                    Statistic.write(cntx.userId, Statistic.ID_BUY_SHUFFLE, DataShop.shuffle[itemIndex].quantity);
                    pFinish(prid);
                });
        });
    };

    this.buyHealth = function (cntx) {
        if (!cntx.isAuthorized) return Logs.log(arguments.callee.name + " not authorized", Logs.LEVEL_WARNING, cntx);
        if (!cntx.user) return Logs.log(arguments.callee.name + " not user", Logs.LEVEL_WARNING, cntx);
        if (!cntx.user.id) return Logs.log(arguments.callee.name + " not user id", Logs.LEVEL_WARNING, cntx);

        let tid = LogicTid.getOne();

        let prid = pStart(Profiler.ID_SAPISTUFF_BUY_HEALTH);

        LOCK.acquire(Keys.health(cntx.user.id), function (done) {
                setTimeout(done, 5 * 60 * 1000);
                DataUser.getById(cntx.user.id, function (user) {
                    if (LogicHealth.getHealths(user) > 0) {
                        Logs.log("buy health tid:" + tid + " uid:" + user.id + " NO ZERO", Logs.LEVEL_DETAIL, user, Logs.CHANNEL_VK_HEALTH);
                        done();
                        pFinish(prid);
                    } else {
                        Statistic.write(cntx.userId, Statistic.ID_BUY_HEALTH);
                        DataStuff.usedGold(cntx.user.id, DataShop.healthGoldPrice, tid, function (success) {
                            if (!success) {
                                Logs.log("buy health tid:" + tid + " uid:" + user.id + " CANCEL", Logs.LEVEL_DETAIL, user, Logs.CHANNEL_VK_HEALTH);
                                done();
                            } else {
                                Logs.log("buy health tid:" + tid + " uid:" + user.id + " +" + LogicHealth.getMaxHealth() + " OK", Logs.LEVEL_DETAIL, user, Logs.CHANNEL_VK_HEALTH);
                                LogicHealth.setMaxHealth(user);
                                DataUser.updateHealthAndStartTime(user, function () {
                                        CAPIUser.updateUserInfo(cntx.user.id, user);
                                        done();
                                        pFinish(prid);
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