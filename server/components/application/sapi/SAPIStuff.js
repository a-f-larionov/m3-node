var AsyncLock = require('async-lock');
var LOCK = new AsyncLock();

SAPIStuff = function () {

    this.sendMeStuff = function (cntx) {
        if (!cntx.user) return Logs.log("send-me-stuff not user", Logs.LEVEL_WARNING, cntx);
        if (!cntx.user.id) return Logs.log("send-me-stuff not user id", Logs.LEVEL_WARNING, cntx);

        LogicStuff.sendStuffToUser(cntx.user.id);
    };

    this.usedHummer = function (cntx) {
        if (!cntx.user) return Logs.log("used stuff not user", Logs.LEVEL_WARNING, cntx);
        if (!cntx.user.id) return Logs.log("user stuff not user id", Logs.LEVEL_WARNING, cntx);

        DataStuff.usedHummer(cntx.user.id, LogicTid.getOne());
    };

    this.usedShuffle = function (cntx) {
        if (!cntx.user) return Logs.log("used stuff not user", Logs.LEVEL_WARNING, cntx);
        if (!cntx.user.id) return Logs.log("user stuff not user id", Logs.LEVEL_WARNING, cntx);

        DataStuff.usedShuffle(cntx.user.id, LogicTid.getOne());
    };

    this.usedLighting = function (cntx) {
        if (!cntx.user) return Logs.log("used stuff not user", Logs.LEVEL_WARNING, cntx);
        if (!cntx.user.id) return Logs.log("user stuff not user id", Logs.LEVEL_WARNING, cntx);

        DataStuff.usedLighting(cntx.user.id, LogicTid.getOne());
    };

    this.buyHummer = function (cntx, itemIndex) {
        if (!cntx.user) return Logs.log("used stuff not user", Logs.LEVEL_WARNING, cntx);
        if (!cntx.user.id) return Logs.log("user stuff not user id", Logs.LEVEL_WARNING, cntx);
        if (!DataShop.hummers[itemIndex]) return Logs.log("no item hummer " + itemIndex, Logs.LEVEL_WARNING, cntx);
        let tid;

        DataStuff.usedGold(cntx.user.id, DataShop.hummers[itemIndex].gold, tid = LogicTid.getOne(), function (success) {
            if (success)
                DataStuff.giveAHummer(cntx.user.id, DataShop.hummers[itemIndex].quantity, tid);
        });
    };

    this.buyShuffle = function (cntx, itemIndex) {
        if (!cntx.user) return Logs.log("used stuff not user", Logs.LEVEL_WARNING, cntx);
        if (!cntx.user.id) return Logs.log("user stuff not user id", Logs.LEVEL_WARNING, cntx);
        if (!DataShop.shuffle[itemIndex]) return Logs.log("no item shuffle " + itemIndex, Logs.LEVEL_WARNING, cntx);
        let tid;

        DataStuff.usedGold(cntx.user.id, DataShop.shuffle[itemIndex].gold, tid = LogicTid.getOne(), function (success) {
            if (success)
                DataStuff.giveAShuffle(cntx.user.id, DataShop.shuffle[itemIndex].quantity, tid);
        });
    };

    this.buyLighting = function (cntx, itemIndex) {
        if (!cntx.user) return Logs.log("used stuff not user", Logs.LEVEL_WARNING, cntx);
        if (!cntx.user.id) return Logs.log("user stuff not user id", Logs.LEVEL_WARNING, cntx);
        if (!DataShop.lighting[itemIndex]) return Logs.log("no item hummer " + itemIndex, Logs.LEVEL_WARNING, cntx);

        let tid;
        DataStuff.usedGold(cntx.user.id, DataShop.lighting[itemIndex].gold, tid = LogicTid.getOne(), function (success) {
            if (success)
                DataStuff.giveALighting(cntx.user.id, DataShop.lighting[itemIndex].quantity, tid);
        });
    };

    this.buyHealth = function (cntx, itemIndex) {
        if (!cntx.user) return Logs.log("used health not user", Logs.LEVEL_WARNING, cntx);
        if (!cntx.user.id) return Logs.log("user health not user id", Logs.LEVEL_WARNING, cntx);
        if (!DataShop.health[itemIndex]) return Logs.log("no item health " + itemIndex, Logs.LEVEL_WARNING, cntx);

        let tid = LogicTid.getOne();
        //@todo lock
        // get user
        // check user.health
        // check user.gold
        // do exchange
        //@todo unlock

        LOCK.acquire('buy-health-' + cntx.user.id, function (done) {
            setTimeout(done, 5 * 60 * 1000);
            DataUser.getById(cntx.user.id, function (user) {
                if (user.health < LogicUser.getMaxHealth()) {
                    DataStuff.usedGold(cntx.user.id, DataShop.health[itemIndex].gold, tid, function (success) {
                        if (success) {
                            Logs.log("Health tid:" + tid + "uid:" + user.id + " +" + DataShop.health[itemIndex].quantity + " OK", Logs.LEVEL_DETAIL, {
                                itemIndex: itemIndex, user: user
                            }, Logs.CHANNEL_VK_HEALTH);
                            user.health += DataShop.health[itemIndex].quantity;
                            user.health = Math.max(user.health, LogicUser.getMaxHealth());

                            DataUser.updateHealthAndStartTime(
                                user.id,
                                DataShop.health[itemIndex].quantity,
                                user.healthStartTime,
                                function () {
                                    CAPIUser.updateUserInfo(cntx.user.id, user);
                                }
                            );
                        }
                        done();
                    });
                } else {

                    Logs.log("Health tid:" + tid + " uid:" + user.id + " NO BECAUSE MAX", Logs.LEVEL_DETAIL, {
                        itemIndex: itemIndex, user: user
                    }, Logs.CHANNEL_VK_HEALTH);
                }
            })

        });
    }
};

SAPIStuff = new SAPIStuff();