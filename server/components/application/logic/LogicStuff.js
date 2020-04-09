LogicStuff = function () {

    this.sendStuffToUser = function (userId) {
        createOrSend(userId);
    };

    let createOrSend = function (userId) {
        DataStuff.getByUserId(userId, function (data) {
            if (!data) {
                DataStuff.create(userId, function (data) {
                    CAPIStuff.gotStuff(userId, data);
                });
            } else {
                CAPIStuff.gotStuff(userId, data);
            }
        });
    };

    this.usedHummer = function (userId) {
        DataStuff.usedHummer(userId);
    };

    this.usedShuffle = function (userId) {
        DataStuff.usedShuffle(userId);
    };

    this.usedlightning = function (userId) {
        DataStuff.usedlightning(userId);
    };
};


LogicStuff = new LogicStuff();