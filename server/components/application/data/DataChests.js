DataChests = function () {

    let tableName = 'users_chests';

    let wayChests = [];

    this.init = function(afterInitCallback){

        wayChests[1] = {
            id: 1,
            goalStars: 5,
            prizes: [
                {
                    id: DataPrizes.PRIZE_STUFF_HUMMER,
                    count: 5
                },
                {
                    id: DataPrizes.PRIZE_STUFF_GOLD,
                    count: 5
                }
            ]
        };

        wayChests[2] = {
            id: 2,
            goalStars: 9,
            prizes: [
                {
                    id: DataPrizes.PRIZE_STUFF_HUMMER,
                    count: 5
                },
                {
                    id: DataPrizes.PRIZE_STUFF_GOLD,
                    count: 5
                }
            ]
        };

        wayChests[3] = {
            id: 3,
            goalStars: 3,
            prizes: [
                {
                    id: DataPrizes.PRIZE_STUFF_SHUFFLE,
                    count: 5
                },
                {
                    id: DataPrizes.PRIZE_STUFF_LIGHTNING,
                    count: 5
                }
            ]
        };

        wayChests[4] = {
            id: 4,
            goalStars: 6,
            prizes: [
                {
                    id: DataPrizes.PRIZE_STUFF_HUMMER,
                    count: 5
                }
            ]
        };

        wayChests[5] = {
            id: 5,
            goalStars: 2,
            prizes: [
                {
                    id: DataPrizes.PRIZE_STUFF_HUMMER,
                    count: 5
                }
            ]
        };

        wayChests[6] = {
            id: 6,
            goalStars: 7,
            prizes: [
                {
                    id: DataPrizes.PRIZE_STUFF_HUMMER,
                    count: 5
                }
            ]
        };

        afterInitCallback();
    };

    let fromDBToData = function (data) {
        if (!data) return data;
        if (data.userId) data.userId = parseInt(data.userId);
        if (data.chestId) data.chestId = parseInt(data.chestId);
        return data;
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

    this.getUsersInfo = function (mapId, userIds, callback) {
        let firstChestId, lastChestId, chestIds;
        firstChestId = DataMap.getFirstChestId(mapId);
        lastChestId = DataMap.getLastChestId(mapId);
        chestIds = [];
        for (let i = firstChestId; i <= lastChestId; i++) chestIds.push(i);
        DB.queryWhere(tableName, {
            chestId: [chestIds, DB.WHERE_IN],
            userId: [userIds, DB.WHERE_IN],
        }, function (rows, query) {
            for (let i in rows) {
                rows[i] = fromDBToData(rows[i]);
            }
            callback(rows || null, query);
        });
    };

    this.updateUsersChests = function (userId, chestId, callback) {
        let query;
        query = "INSERT IGNORE INTO users_chests (userId, chestId) " +
            " VALUES (" + userId + "," + chestId + ") ";
            //"ON DUPLICATE KEY " +
            //"UPDATE chestId = chestId ";
        DB.query(query, callback);
    };
};

DataChests = new DataChests;

DataChests.depends = ['Logs', 'DB', 'DataPrizes'];