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

};


LogicStuff = new LogicStuff();