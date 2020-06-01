/**
 * @type {DataPoints}
 * @constructor
 */
let DataPoints = function () {

    this.FIELD_MAX_WIDTH = 10;
    this.FIELD_MAX_HEIGHT = 11;

    this.BLOCK_WIDTH = 50;
    this.BLOCK_HEIGHT = 50;

    /** Spider healths */
    this.healthImages = {};
    this.healthImages[0] = 'creature-health-0.png';
    this.healthImages[1] = 'creature-health-1.png';
    this.healthImages[2] = 'creature-health-2.png';
    this.healthImages[3] = 'creature-health-3.png';

    this.objectAnims = {};

    let pointsCoords = [
        {
            number: 1,
            x: 61,
            y: 209
        },
        {
            number: 2,
            x: 61,
            y: 290,
        },
        {
            number: 3,
            x: 105,
            y: 371
        },
        {
            number: 4,
            x: 197,
            y: 390,
        },
        {
            number: 5,
            x: 283,
            y: 360
        },
        {
            number: 6,
            x: 279,
            y: 274,
        },
        {
            number: 7,
            x: 214,
            y: 205,
        },
        {
            number: 8,
            x: 205,
            y: 111,
        },
        {
            number: 9,
            x: 276,
            y: 55
        },
        {
            number: 10,
            x: 371,
            y: 51,
        },
        {
            number: 11,
            x: 452,
            y: 93
        },
        {
            number: 12,
            x: 448,
            y: 185,
        },
        {
            number: 13,
            x: 404,
            y: 269
        },
        {
            number: 14,
            x: 425,
            y: 356,
        },
        {
            number: 15,
            x: 516,
            y: 386,
        },
        {
            number: 16,
            x: 608,
            y: 367,
        },
        {
            number: 17,
            x: 614,
            y: 280,
        },
        {
            number: 18,
            x: 661,
            y: 211,
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
                out[pId][uid] = this.getScore(pId, uid);
            }
        }
        return out;
    };

    this.setPointUserScore = function (pid, uid, score) {
        if (!pointUserScore[pid]) pointUserScore[pid] = {};
        pointUserScore[pid][uid].score = score;
        LogicUser.flushPointTopScore(pid, uid);
    };

    this.loadScores = function (pids, uids) {
        if (!uids && !(uids = LogicUser.getCurrent().id)) return null;
        if (!(uids instanceof Array)) uids = [uids];

        let toLoadPids = [], toLoadUids = [];
        pids.forEach(function (pid) {
            uids.forEach(function (uid) {
                if (!pointUserScore[pid]) pointUserScore[pid] = {};
                if (!pointUserScore[pid][uid]) pointUserScore[pid][uid] = {};
                if (!pointUserScore[pid][uid].loading && (pointUserScore[pid][uid].loading = true)) {
                    toLoadPids.push(pid);
                    toLoadUids.push(uids);
                }
            });
        });
        toLoadPids = toLoadPids.filter(onlyUnique);
        toLoadUids = toLoadUids.filter(onlyUnique);
        if (toLoadUids.length && toLoadPids.length)
            SAPIUser.sendMeScores(toLoadPids, toLoadUids);
    };

    this.getScore = function (pid, uid) {
        if (!uid && !(uid = LogicUser.getCurrent().id)) return null;

        if (!pointUserScore[pid]) pointUserScore[pid] = {};
        if (!pointUserScore[pid][uid]) pointUserScore[pid][uid] = {};

        if (!pointUserScore[pid][uid].loading && (pointUserScore[pid][uid].loading = true)) {
            SAPIUser.sendMeScores(pid, uid);
        }

        return pointUserScore[pid][uid].score;
    };

    this.countStars = function (pointId, userId, userScore) {
        let point;
        if (!pointId) pointId = DataPoints.getPlayedId();
        if (!userId) userId = LogicUser.getCurrent().id;
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

    this.init = function () {

        this.objectAnims[DataObjects.WITH_LIGHTNING_VERTICAL] = animGemLightning;
        this.objectAnims[DataObjects.WITH_LIGHTNING_HORIZONTAL] = animGemLightning;
        this.objectAnims[DataObjects.WITH_LIGHTNING_CROSS] = animGemLightning;
    };
};

DataPoints = new DataPoints;
