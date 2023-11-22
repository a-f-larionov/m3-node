const Kafka = require("../../base/Kafka.js").Kafka

var AsyncLock = require('async-lock');
var LOCK = new AsyncLock();

SAPIStuff = function () {

    this.sendMeStuff = function (cntx) {
        Kafka.sendToGameplay({}, cntx.user.id, Kafka.TYPE_SEND_ME_STUFF_RQ_DTO);
    };

    this.usedHummer = function (cntx) {

        // Statistic.write(cntx.userId, Statistic.ID_HUMMER_USE);
        // let prid = pStart(Profiler.ID_SAPISTUFF_USED_HUMMER);
        // DataStuff.usedHummer(cntx.user.id, LogicTid.getOne(), function (result, current) {
        //     if (result) Logs.log("Игрок " + cntx.user.socNetUserId + " использовал молоток 🔨, теперь " + current, Logs.LEVEL_TRACE, undefined, Logs.CHANNEL_TELEGRAM);
        //
        //     pFinish(prid);
        // });
        // //@todo-method
        Kafka.sendToGameplay({}, cntx.user.id, Kafka.TYPE_USED_HUMMER_RQ_DTO);
    };

    this.usedLightning = function (cntx) {

        Kafka.sendToGameplay({}, cntx.user.id, Kafka.TYPE_USED_LIGHTNING_RQ_DTO);
    };

    this.usedShuffle = function (cntx) {
        // if (!cntx.isAuthorized) return Logs.log(arguments.callee.name + " not authorized", Logs.LEVEL_WARN, cntx);
        // if (!cntx.user) return Logs.log(arguments.callee.name + " not user", Logs.LEVEL_WARN, cntx);
        // if (!cntx.user.id) return Logs.log(arguments.callee.name + " not user id", Logs.LEVEL_WARN, cntx);
        //
        // Statistic.write(cntx.userId, Statistic.ID_SHUFFLE_USE);
        // let prid = pStart(Profiler.ID_SAPISTUFF_USED_SHUFFLE);
        // DataStuff.usedShuffle(cntx.user.id, LogicTid.getOne(), function (result, current) {
        //     if (result) Logs.log("Игрок " + cntx.user.socNetUserId + " использовал вихрь 🌪, теперь " + current, Logs.LEVEL_TRACE, undefined, Logs.CHANNEL_TELEGRAM);
        //     pFinish(prid);
        // });
        // //@todo-method
        Kafka.sendToGameplay({}, cntx.user.id, Kafka.TYPE_USED_SHUFFLE_RQ_DTO);
    };

    this.buyHummer = function (cntx, itemIndex) {
        Kafka.sendToGameplay({index: itemIndex}, cntx.user.id, Kafka.TYPE_BUY_HUMMER_RQ_DTO);
    };

    this.buyLightning = function (cntx, itemIndex) {
        Kafka.sendToGameplay({index: itemIndex}, cntx.user.id, Kafka.TYPE_BUY_LIGHTNING_RQ_DTO);
    };

    this.buyShuffle = function (cntx, itemIndex) {
        Kafka.sendToGameplay({index: itemIndex}, cntx.user.id, Kafka.TYPE_BUY_SHUFFLE_RQ_DTO);
    };

    this.buyHealth = function (cntx) {
        if (!cntx.isAuthorized) return Logs.log(arguments.callee.name + " not authorized", Logs.LEVEL_WARN, cntx);
        if (!cntx.user) return Logs.log(arguments.callee.name + " not user", Logs.LEVEL_WARN, cntx);
        if (!cntx.user.id) return Logs.log(arguments.callee.name + " not user id", Logs.LEVEL_WARN, cntx);

        let tid = LogicTid.getOne();

        let prid = pStart(Profiler.ID_SAPISTUFF_BUY_HEALTH);

        //@todo-method
        //  Kafka.sendToPayments({}, cntx.user.id, Kafka.TYPE_BUY_HEALTH_RQ_DTO);

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