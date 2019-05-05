LogicStuff = function () {

    this.sendStuffToUser = function (userId) {
        createOrSend(userId);
    };

    let createOrSend = function (userId) {
        DataStuff.getByUserId(userId, function (data) {
            if (!data) {
                createAndSend(userId);
            } else {
                CAPIStuff.gotStuff(userId, data);
            }
        });
    };

    let createAndSend = function (userId) {
        DataStuff.create(userId, function (data) {
            CAPIStuff.gotStuff(userId, data);
        });
    };

    this.usedHummer = function (userId) {
        DataStuff.usedHummer(userId);
    };
    this.usedShuffle = function (userId) {
        DataStuff.usedShuffle(userId);
    };
    this.usedLighting = function (userId) {
        DataStuff.usedLighting(userId);
    };
};


LogicStuff = new LogicStuff();