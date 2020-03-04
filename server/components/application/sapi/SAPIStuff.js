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

    this.usedLighting = function (cntx) {
        if (!cntx.user) return Logs.log("used stuff not user", Logs.LEVEL_WARNING, cntx);
        if (!cntx.user.id) return Logs.log("user stuff not user id", Logs.LEVEL_WARNING, cntx);

        LogicStuff.usedLighting(cntx.user.id);
    };

    this.buyHummer = function (cntx, itemIndex) {
        if (!cntx.user) return Logs.log("used stuff not user", Logs.LEVEL_WARNING, cntx);
        if (!cntx.user.id) return Logs.log("user stuff not user id", Logs.LEVEL_WARNING, cntx);
        if (!DataShop.hummers[itemIndex]) return Logs.log("no item hummer " + itemIndex, Logs.LEVEL_WARNING, cntx);

        //@todo transaction
        DataStuff.giveAHummer(cntx.user.id, DataShop.hummers[itemIndex].quantity);
        DataStuff.usedGold(cntx.user.id, DataShop.hummers[itemIndex].gold);
        CAPIStuff.decrementGold(cntx.user.id, DataShop.hummers[itemIndex].gold);
    };

    this.buyShuffle = function (cntx, itemIndex) {
        if (!cntx.user) return Logs.log("used stuff not user", Logs.LEVEL_WARNING, cntx);
        if (!cntx.user.id) return Logs.log("user stuff not user id", Logs.LEVEL_WARNING, cntx);
        if (!DataShop.shuffle[itemIndex]) return Logs.log("no item shuffle " + itemIndex, Logs.LEVEL_WARNING, cntx);
        //@todo transaction
        DataStuff.giveAShuffle(cntx.user.id, DataShop.shuffle[itemIndex].quantity);
        DataStuff.usedGold(cntx.user.id, DataShop.shuffle[itemIndex].gold);
        CAPIStuff.decrementGold(cntx.user.id, DataShop.shuffle[itemIndex].gold);

    };

    this.buyLighting = function (cntx, itemIndex) {
        if (!cntx.user) return Logs.log("used stuff not user", Logs.LEVEL_WARNING, cntx);
        if (!cntx.user.id) return Logs.log("user stuff not user id", Logs.LEVEL_WARNING, cntx);
        if (!DataShop.lighting[itemIndex]) return Logs.log("no item hummer " + itemIndex, Logs.LEVEL_WARNING, cntx);
        //@todo transaction
        DataStuff.giveALighting(cntx.user.id, DataShop.lighting[itemIndex].quantity);
        DataStuff.usedGold(cntx.user.id, DataShop.lighting[itemIndex].gold);
        CAPIStuff.decrementGold(cntx.user.id, DataShop.lighting[itemIndex].gold);
    };

};

SAPIStuff = new SAPIStuff();