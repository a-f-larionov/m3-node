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

    this.objectImages = {};
    this.objectImages[this.OBJECT_NONE] = '/images/field-none-2.png';
    this.objectImages[this.OBJECT_RANDOM] = '/images/field-none.png';
    this.objectImages[this.OBJECT_RED] = '/images/field-red.png';
    this.objectImages[this.OBJECT_GREEN] = '/images/field-green.png';
    this.objectImages[this.OBJECT_BLUE] = '/images/field-blue.png';
    this.objectImages[this.OBJECT_BLOCK] = '/images/field-block.png';

    var pointsCoords = [
        {
            number: 1,
            x: 0,
            y: 240
        },
        {
            number: 2,
            x: 89,
            y: 85
        },
        {
            number: 3,
            x: 277,
            y: 28
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
