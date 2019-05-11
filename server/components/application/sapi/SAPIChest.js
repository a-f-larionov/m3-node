SAPIChest = function () {

    this.openChest = function (cntx, chestId) {
        let chest, prize;
        if (!cntx.user) return Logs.log("send-me-stuff not user", Logs.LEVEL_WARNING, cntx);
        if (!cntx.user.id) return Logs.log("send-me-stuff not user id", Logs.LEVEL_WARNING, cntx);
        chest = DataChests.getById(chestId);
        if (!chest) Logs.log("no chest found", Logs.LEVEL_WARNING, arguments);

        DataChests.updateUsersChests(cntx.user.id, chestId, function (data) {
            CAPIMap.log(cntx.user.id, arguments);
            if (data.affectedRows) {
                // выдать приз
                DataPrizes.giveOutPrizes(cntx.user.id, chest.prizes);

            } else {
                Logs.log("", Logs.LEVEL_WARNING,
                    {userId: cntx.user.id, chestId: chestId});
            }
        });
    };
};

SAPIChest = new SAPIChest();