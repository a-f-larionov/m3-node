const Kafka = require("../../base/Kafka.js").Kafka

var AsyncLock = require('async-lock');
var LOCK = new AsyncLock();

SAPIStuff = function () {

    this.sendMeStuff = function (cntx) {
        if (!cntx.isAuthorized) return Logs.log(arguments.callee.name + " not authorized", Logs.LEVEL_WARN, cntx);
        if (!cntx.user) return Logs.log(arguments.callee.name + " not user", Logs.LEVEL_WARN, cntx);
        if (!cntx.user.id) return Logs.log(arguments.callee.name + " not user id", Logs.LEVEL_WARN, cntx);

        LogicStuff.sendStuffToUser(cntx.user.id, pStart(Profiler.ID_SAPISTUFF_SEND_ME_STUFF));
        //@todo-method
       // Kafka.sendToStuff({}, cntx.user.id, "SendMeStuffRqDto");
    };

    this.usedHummer = function (cntx) {
        if (!cntx.isAuthorized) return Logs.log(arguments.callee.name + " not authorized", Logs.LEVEL_WARN, cntx);
        if (!cntx.user) return Logs.log(arguments.callee.name + " not user", Logs.LEVEL_WARN, cntx);
        if (!cntx.user.id) return Logs.log(arguments.callee.name + " not user id", Logs.LEVEL_WARN, cntx);

        Statistic.write(cntx.userId, Statistic.ID_HUMMER_USE);
        let prid = pStart(Profiler.ID_SAPISTUFF_USED_HUMMER);
        DataStuff.usedHummer(cntx.user.id, LogicTid.getOne(), function (result, current) {
            if (result) Logs.log("Игрок " + cntx.user.socNetUserId + " использовал молоток 🔨, теперь " + current, Logs.LEVEL_TRACE, undefined, Logs.CHANNEL_TELEGRAM);

            pFinish(prid);
        });
        //@todo-method
        Kafka.sendToStuff({}, cntx.user.id, "UsedHummerRqDto");
    };

    this.usedLightning = function (cntx) {
        if (!cntx.isAuthorized) return Logs.log(arguments.callee.name + " not authorized", Logs.LEVEL_WARN, cntx);
        if (!cntx.user) return Logs.log(arguments.callee.name + " not user", Logs.LEVEL_WARN, cntx);
        if (!cntx.user.id) return Logs.log(arguments.callee.name + " not user id", Logs.LEVEL_WARN, cntx);

        Statistic.write(cntx.userId, Statistic.ID_LIGHTNING_USE);
        let prid = pStart(Profiler.ID_SAPISTUFF_USED_LIGHTNING);
        DataStuff.usedLightning(cntx.user.id, LogicTid.getOne(), function (result, current) {
            if (result) Logs.log("Игрок " + cntx.user.socNetUserId + " использовал молнию ⚡, теперь " + current, Logs.LEVEL_TRACE, undefined, Logs.CHANNEL_TELEGRAM);
            pFinish(prid);
        });
        //@todo-method
        Kafka.sendToStuff({}, cntx.user.id, "UsedLightningRqDto");
    };

    this.usedShuffle = function (cntx) {
        if (!cntx.isAuthorized) return Logs.log(arguments.callee.name + " not authorized", Logs.LEVEL_WARN, cntx);
        if (!cntx.user) return Logs.log(arguments.callee.name + " not user", Logs.LEVEL_WARN, cntx);
        if (!cntx.user.id) return Logs.log(arguments.callee.name + " not user id", Logs.LEVEL_WARN, cntx);

        Statistic.write(cntx.userId, Statistic.ID_SHUFFLE_USE);
        let prid = pStart(Profiler.ID_SAPISTUFF_USED_SHUFFLE);
        DataStuff.usedShuffle(cntx.user.id, LogicTid.getOne(), function (result, current) {
            if (result) Logs.log("Игрок " + cntx.user.socNetUserId + " использовал вихрь 🌪, теперь " + current, Logs.LEVEL_TRACE, undefined, Logs.CHANNEL_TELEGRAM);
            pFinish(prid);
        });
        //@todo-method
        Kafka.sendToStuff({}, cntx.user.id, "UsedShuffleRqDto");
    };

    this.buyHummer = function (cntx, itemIndex) {
        if (!cntx.isAuthorized) return Logs.log(arguments.callee.name + " not authorized", Logs.LEVEL_WARN, cntx);
        if (!cntx.user) return Logs.log(arguments.callee.name + " not user", Logs.LEVEL_WARN, cntx);
        if (!cntx.user.id) return Logs.log(arguments.callee.name + " not user id", Logs.LEVEL_WARN, cntx);

        if (!DataShop.hummers[itemIndex]) return Logs.log("no item hummer " + itemIndex, Logs.LEVEL_WARN, cntx);
        let tid;
        let prid = pStart(Profiler.ID_SAPISTUFF_BUY_HUMMER);
        DataStuff.usedGold(cntx.user.id, DataShop.hummers[itemIndex].gold, tid = LogicTid.getOne(), function (success, currentGold) {
            if (success)
                DataStuff.giveAHummer(cntx.user.id, DataShop.hummers[itemIndex].quantity, tid, function (result, currentStuff) {
                    Statistic.write(cntx.userId, Statistic.ID_BUY_HUMMER, DataShop.hummers[itemIndex].quantity);
                    if (result) Logs.log("Игрок " + cntx.user.socNetUserId + " купил молоток 🔨, теперь: " + currentStuff +
                        ", 💰 " + currentGold + "(-" + DataShop.hummers[itemIndex].gold + ")", Logs.LEVEL_TRACE,
                        undefined, Logs.CHANNEL_TELEGRAM);
                    pFinish(prid);
                });
        });
        //@todo-method
        Kafka.sendToPayments({}, cntx.user.id, "BuyHummerRqDto");
    };

    this.buyLightning = function (cntx, itemIndex) {
        if (!cntx.isAuthorized) return Logs.log(arguments.callee.name + " not authorized", Logs.LEVEL_WARN, cntx);
        if (!cntx.user) return Logs.log(arguments.callee.name + " not user", Logs.LEVEL_WARN, cntx);
        if (!cntx.user.id) return Logs.log(arguments.callee.name + " not user id", Logs.LEVEL_WARN, cntx);

        if (!DataShop.lightning[itemIndex]) return Logs.log("no item hummer " + itemIndex, Logs.LEVEL_WARN, cntx);

        let tid;

        let prid = pStart(Profiler.ID_SAPISTUFF_BUY_LIGHTNING);

        DataStuff.usedGold(cntx.user.id, DataShop.lightning[itemIndex].gold, tid = LogicTid.getOne(), function (success, currentGold) {
            if (success)
                DataStuff.giveALightning(cntx.user.id, DataShop.lightning[itemIndex].quantity, tid, function (result, currentStuff) {
                    Statistic.write(cntx.userId, Statistic.ID_BUY_LIGHTNING, DataShop.lightning[itemIndex].quantity);
                    if (result) Logs.log("Игрок " + cntx.user.socNetUserId + " купил молнию ⚡, теперь: " + currentStuff +
                        ", 💰 " + currentGold + "(-" + DataShop.lightning[itemIndex].gold + ")", Logs.LEVEL_TRACE,
                        undefined, Logs.CHANNEL_TELEGRAM);
                    pFinish(prid);
                });
        });
        //@todo-method
        Kafka.sendToPayments({}, cntx.user.id, "BuyLightningRqDto");
    };

    this.buyShuffle = function (cntx, itemIndex) {
        if (!cntx.isAuthorized) return Logs.log(arguments.callee.name + " not authorized", Logs.LEVEL_WARN, cntx);
        if (!cntx.user) return Logs.log(arguments.callee.name + " not user", Logs.LEVEL_WARN, cntx);
        if (!cntx.user.id) return Logs.log(arguments.callee.name + " not user id", Logs.LEVEL_WARN, cntx);

        if (!DataShop.shuffle[itemIndex]) return Logs.log("no item shuffle " + itemIndex, Logs.LEVEL_WARN, cntx);
        let tid;

        let prid = pStart(Profiler.ID_SAPISTUFF_BUY_SHUFFLE);

        DataStuff.usedGold(cntx.user.id, DataShop.shuffle[itemIndex].gold, tid = LogicTid.getOne(), function (success, currentGold) {
            if (success)
                DataStuff.giveAShuffle(cntx.user.id, DataShop.shuffle[itemIndex].quantity, tid, function (result, currentStuff) {
                    Statistic.write(cntx.userId, Statistic.ID_BUY_SHUFFLE, DataShop.shuffle[itemIndex].quantity);
                    if (result) Logs.log("Игрок " + cntx.user.socNetUserId + " купил вихрь 🌪, теперь: " + currentStuff +
                        ", 💰 " + currentGold + "(-" + DataShop.lightning[itemIndex].gold + ")", Logs.LEVEL_TRACE,
                        undefined, Logs.CHANNEL_TELEGRAM);
                    pFinish(prid);
                });
        });
        //@todo-method
        Kafka.sendToPayments({}, cntx.user.id, "BuyShuffleRqDto");
    };

    this.buyHealth = function (cntx) {
        if (!cntx.isAuthorized) return Logs.log(arguments.callee.name + " not authorized", Logs.LEVEL_WARN, cntx);
        if (!cntx.user) return Logs.log(arguments.callee.name + " not user", Logs.LEVEL_WARN, cntx);
        if (!cntx.user.id) return Logs.log(arguments.callee.name + " not user id", Logs.LEVEL_WARN, cntx);

        let tid = LogicTid.getOne();

        let prid = pStart(Profiler.ID_SAPISTUFF_BUY_HEALTH);

        //@todo-method
        Kafka.sendToPayments({}, cntx.user.id, "BuyHealthRqDto");

        LOCK.acquire(Keys.health(cntx.user.id), function (done) {
                setTimeout(done, 5 * 60 * 1000);
                DataUser.getById(cntx.user.id, function (user) {
                    if (LogicHealth.getHealths(user) > 0) {
                        Logs.log("buy health tid:" + tid + " uid:" + user.id + " NO ZERO", Logs.LEVEL_INFO, user, Logs.TYPE_VK_HEALTH);
                        done();
                        pFinish(prid);
                    } else {
                        Statistic.write(cntx.userId, Statistic.ID_BUY_HEALTH);
                        DataStuff.usedGold(cntx.user.id, DataShop.healthGoldPrice, tid, function (success, currentGold) {
                            if (!success) {
                                Logs.log("buy health tid:" + tid + " uid:" + user.id + " CANCEL", Logs.LEVEL_INFO, user, Logs.TYPE_VK_HEALTH);
                                done();
                            } else {
                                Logs.log("buy health tid:" + tid + " uid:" + user.id + " +" + LogicHealth.getMaxHealth() + " OK", Logs.LEVEL_TRACE, user, Logs.TYPE_VK_HEALTH, true);
                                LogicHealth.setMaxHealth(user);
                                Logs.log("Игрок " + cntx.user.socNetUserId + " купил жизней❤❤❤❤❤, 💰  " + currentGold + "(-" + DataShop.healthGoldPrice + ")", Logs.LEVEL_TRACE,
                                    undefined, Logs.CHANNEL_TELEGRAM);
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