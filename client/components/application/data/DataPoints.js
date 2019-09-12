DataPoints = function () {

    this.OBJECT_NONE = 1;
    this.OBJECT_CELL = 2;
    this.OBJECT_EMPTY = 3;
    this.OBJECT_BLOCK = 4;

    this.OBJECT_RANDOM = 101;

    this.OBJECT_RED = 102;
    this.OBJECT_GREEN = 103;
    this.OBJECT_BLUE = 104;
    this.OBJECT_YELLOW = 105;
    this.OBJECT_PURPLE = 106;

    this.OBJECT_EMITTER = 1001;

    this.FIELD_MAX_WIDTH = 10;
    this.FIELD_MAX_HEIGHT = 10;

    this.BLOCK_WIDTH = 50;
    this.BLOCK_HEIGHT = 50;

    this.objectImages = {};
    this.objectImages[this.OBJECT_NONE] = '/images/field-none-2.png';
    this.objectImages[this.OBJECT_CELL] = '/images/field-cell.png';
    this.objectImages[this.OBJECT_EMPTY] = '/images/field-none-2.png';
    this.objectImages[this.OBJECT_RANDOM] = '/images/field-none.png';
    this.objectImages[this.OBJECT_BLOCK] = '/images/field-block.png';

    this.objectImages[this.OBJECT_RED] = '/images/field-red.png';
    this.objectImages[this.OBJECT_GREEN] = '/images/field-green.png';
    this.objectImages[this.OBJECT_BLUE] = '/images/field-blue.png';
    this.objectImages[this.OBJECT_YELLOW] = '/images/field-yellow.png';
    this.objectImages[this.OBJECT_PURPLE] = '/images/field-purple.png';

    let yA = 190;
    let yB = 260;

    var pointsCoords = [
        {
            number: 1,
            x: 24,
            y: yB
        },
        {
            number: 2,
            x: 106,
            y: yA,
        },
        {
            number: 3,
            x: 211,
            y: yB
        },
        {
            number: 4,
            x: 304,
            y: yA,
        },
        {
            number: 5,
            x: 411,
            y: yB
        },
        {
            number: 6,
            x: 504,
            y: yA,
        },
        {
            number: 7,
            x: 611,
            y: yB
        },
        {
            number: 8,
            x: 704,
            y: yA,
        }
    ];

    let pointUserScore = {};

    let pointsData = [];

    this.getPointsCoords = function () {
        return pointsCoords;
    };

    this.getById = function (id) {
        return pointsData[id];
    };

    this.setPointData = function (data) {
        pointsData[data.id] = data;
        PageController.redraw();
    };

    /**
     * В эту игру играют в текущий момент.
     * @type {null}
     */
    let playedId = null;

    this.setPlayedId = function (id) {
        playedId = id;
    };

    this.getPlayedId = function () {
        return playedId;
    };

    this.getPointUserScore = function (mapId, userIds) {
        let pIdFirst, pIdLast, out;
        pIdFirst = DataMap.getFirstPointId(mapId);
        pIdLast = DataMap.getLastPointId(mapId);
        out = {};
        for (let pId = pIdFirst; pId <= pIdLast; pId++) {
            for (let uid in pointUserScore[pId]) {
                if (userIds.indexOf(parseInt(uid)) === -1) continue;
                if (!out[pId]) out[pId] = {};
                out[pId][uid] = pointUserScore[pId][uid];
            }
        }
        return out;
    };

    this.setPointUserScore = function (userId, pointId, score) {
        if (!pointUserScore[pointId]) {
            pointUserScore[pointId] = {};
        }
        pointUserScore[pointId][userId] = {
            userId: userId,
            pointId: pointId,
            score: score
        }
    };

    this.getScore = function (pointId, userId) {
        if (!userId) userId = LogicUser.getCurrentUser().id;
        if (!userId) return null;
        if (!pointUserScore[pointId]) {
            pointUserScore[pointId] = {};
        }
        if (!pointUserScore[pointId][userId]) {
            pointUserScore[pointId][userId] = {
                userId: userId,
                pointId: pointId,
                score: 0
            }
        }
        return pointUserScore[pointId][userId].score;
    };

    this.countStars = function (pointId, userId, userScore) {
        let point;
        if (!pointId) pointId = DataPoints.getPlayedId();
        if (!userId) userId = LogicUser.getCurrentUser().id;
        if (!userId || !pointId) return null;
        if (isNaN(userScore)) userScore = DataPoints.getScore(pointId);
        point = DataPoints.getById(pointId);
        if (!point || userScore === null) return null;

        if (userScore >= point.score3) return 3;
        if (userScore >= point.score2) return 2;
        if (userScore >= point.score1) return 1;
        return 0;
    };

    this.copyGoals = function (goals) {
        let goalsNew;
        goalsNew = [];
        for (let i in goals) {
            goalsNew.push({
                id: goals[i].id,
                count: goals[i].count
            });
        }
        return goalsNew;
    };
};

DataPoints = new DataPoints;
