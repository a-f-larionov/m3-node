SAPIStuff = function () {

    this.sendMeStuff = function (cntx) {
        if (!cntx.user) return Logs.log("send-me-stuff not user", Logs.LEVEL_WARNING, cntx);
        if (!cntx.user.id) return Logs.log("send-me-stuff not user id", Logs.LEVEL_WARNING, cntx);
        LogicStuff.sendStuffToUser(cntx.user.id);
    };

    this.usedHummer = function (cntx) {
        if (!cntx.user) return Logs.log("used stuff not user", Logs.LEVEL_WARNING, cntx);
        if (!cntx.user.id) return Logs.log("user stuff not user id", Logs.LEVEL_WARNING, cntx);

        DataStuff.usedHummer(cntx.user.id, function () {
        });
    };

    this.usedShuffle = function (cntx) {
        if (!cntx.user) return Logs.log("used stuff not user", Logs.LEVEL_WARNING, cntx);
        if (!cntx.user.id) return Logs.log("user stuff not user id", Logs.LEVEL_WARNING, cntx);

        DataStuff.usedShuffle(cntx.user.id, function () {
        });
    };

    this.usedLighting = function (cntx) {
        if (!cntx.user) return Logs.log("used stuff not user", Logs.LEVEL_WARNING, cntx);
        if (!cntx.user.id) return Logs.log("user stuff not user id", Logs.LEVEL_WARNING, cntx);

        DataStuff.usedLighting(cntx.user.id, function () {
        });
    };

    this.buyHummer = function (cntx, itemIndex) {
        if (!cntx.user) return Logs.log("used stuff not user", Logs.LEVEL_WARNING, cntx);
        if (!cntx.user.id) return Logs.log("user stuff not user id", Logs.LEVEL_WARNING, cntx);
        if (!DataShop.hummers[itemIndex]) return Logs.log("no item hummer " + itemIndex, Logs.LEVEL_WARNING, cntx);

        DataStuff.usedGold(cntx.user.id, DataShop.hummers[itemIndex].gold, function (success) {
            if (success)
                DataStuff.giveAHummer(cntx.user.id, DataShop.hummers[itemIndex].quantity);
        });
    };

    this.buyShuffle = function (cntx, itemIndex) {
        if (!cntx.user) return Logs.log("used stuff not user", Logs.LEVEL_WARNING, cntx);
        if (!cntx.user.id) return Logs.log("user stuff not user id", Logs.LEVEL_WARNING, cntx);
        if (!DataShop.shuffle[itemIndex]) return Logs.log("no item shuffle " + itemIndex, Logs.LEVEL_WARNING, cntx);

        DataStuff.usedGold(cntx.user.id, DataShop.shuffle[itemIndex].gold, function (success) {
            if (success)
                DataStuff.giveAShuffle(cntx.user.id, DataShop.shuffle[itemIndex].quantity);
        });
    };

    this.buyLighting = function (cntx, itemIndex) {
        if (!cntx.user) return Logs.log("used stuff not user", Logs.LEVEL_WARNING, cntx);
        if (!cntx.user.id) return Logs.log("user stuff not user id", Logs.LEVEL_WARNING, cntx);
        if (!DataShop.lighting[itemIndex]) return Logs.log("no item hummer " + itemIndex, Logs.LEVEL_WARNING, cntx);

        DataStuff.usedGold(cntx.user.id, DataShop.lighting[itemIndex].gold, function (success) {
            if (success)
                DataStuff.giveALighting(cntx.user.id, DataShop.lighting[itemIndex].quantity);
        });
    };

};

SAPIStuff = new SAPIStuff();