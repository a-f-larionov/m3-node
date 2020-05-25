LogicStuff = function () {

    this.sendStuffToUser = function (userId, prid) {
        createOrSend(userId, prid);
    };

    let createOrSend = function (userId, prid) {
        DataStuff.getByUserId(userId, function (data) {
            if (!data) {
                DataStuff.create(userId, function (data) {
                    CAPIStuff.gotStuff(userId, data);
                    pFinish(prid);
                });
            } else {
                CAPIStuff.gotStuff(userId, data);
                pFinish(prid);
            }
        });
    };

    this.usedHummer = function (userId) {
        DataStuff.usedHummer(userId);
    };

    this.usedShuffle = function (userId) {
        DataStuff.usedShuffle(userId);
    };

    this.usedLightning = function (userId) {
        DataStuff.usedLightning(userId);
    };
};


LogicStuff = new LogicStuff();