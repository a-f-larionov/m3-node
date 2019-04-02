DataChests = function () {

    let tableName = 'chests';

    let wayChests = [];

    let fromDBToData = function (data) {
        if (!data) return data;
        if (data.userId) data.userId = parseInt(data.userId);
        if (data.chestId) data.chestId = parseInt(data.chestId);
        return data;
    };

    wayChests[1] = {
        id: 1,
        goalStars: 5
    };

    wayChests[2] = {
        id: 2,
        goalStars: 9
    };

    wayChests[3] = {
        id: 3,
        goalStars: 3
    };

    wayChests[4] = {
        id: 4,
        goalStars: 6
    };

    wayChests[5] = {
        id: 5,
        goalStars: 3
    };

    wayChests[6] = {
        id: 6,
        goalStars: 6
    };


    this.getById = function (id) {
        return wayChests[id];
    };

    this.getChestsByMapId = function (mapId) {
        let firstId, lastId, chests;
        firstId = DataMap.getFirstChestId(mapId);
        lastId = DataMap.getLastChestId(mapId);

        chests = [];
        for (let id = firstId; id <= lastId; id++) {
            chests.push(this.getById(id));
        }
        return chests;
    };

    this.updateUsersChests = function (userId, chestId, callback) {
        let query;
        query = "INSERT INTO users_chests(userId, chestId) " +
            "VALUES (" + userId + "," + chestId + ") " +
            "ON DUPLICATE KEY " +
            "IGNORE ";
        DB.query(query, callback);
    };
};

DataChests = new DataChests;
