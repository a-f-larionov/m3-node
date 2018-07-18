DataPoints = function () {

    this.OBJECT_NONE = 1;
    this.OBJECT_RANDOM = 2;
    this.OBJECT_RED = 3;
    this.OBJECT_GREEN = 4;
    this.OBJECT_BLUE = 5;
    this.OBJECT_BLOCK = 6;

    this.FIELD_MAX_WIDTH = 10;
    this.FIELD_MAX_HEIGHT = 10;

    this.BLOCK_WIDTH = 50;
    this.BLOCK_HEIGHT = 50;

    var pointsCoords = [
        {
            number: 1,
            x: 8,
            y: 402
        },
        {
            number: 2,
            x: 86,
            y: 309
        },
        {
            number: 3,
            x: 76,
            y: 207
        }
    ];

    let usersInfo = {};

    let pointsData = [];

    this.getPointsCoords = function () {
        return pointsCoords;
    };

    this.getById = function (id) {
        return pointsData[id];
    };

    this.loadById = function (id) {
        SAPIMap.sendMePointData(id);
    };

    this.setPointData = function (id, data) {
        pointsData[id] = data;
        PageController.redraw();
    };

    let currentPointId = null;

    this.setCurrentPointId = function (id) {
        currentPointId = id;
    };

    this.getCurrentPointId = function () {
        return currentPointId;
    };

    this.getUsersInfo = function (mapId, userIds) {
        let pIdFirst, pIdLast, out;
        pIdFirst = DataMap.getFirstPointId(mapId);
        pIdLast = DataMap.getLastPointId(mapId);
        out = {};
        for (let pId = pIdFirst; pId <= pIdLast; pId++) {
            for (let userId in usersInfo[pId]) {
                if (userIds.indexOf(parseInt(userId)) == -1)continue;
                if (!out[pId]) out[pId] = {};
                out[pId][userId] = usersInfo[pId][userId];
            }
        }
        return out;
    };

    this.setUserInfo = function (userId, pointId, score) {
        if (!usersInfo[pointId]) {
            usersInfo[pointId] = {};
        }
        usersInfo[pointId][userId] = {
            userId: userId,
            pointId: pointId,
            score: score
        }
    };
};

DataPoints = new DataPoints;
