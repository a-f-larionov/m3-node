/**
 * @type {DataPoints}
 * @constructor
 */
let DataPoints = function () {

    this.FIELD_MAX_WIDTH = 10;
    this.FIELD_MAX_HEIGHT = 11;

    this.BLOCK_WIDTH = 50;
    this.BLOCK_HEIGHT = 50;

    this.objectImages = {};
    /** Cell images */
    this.objectImages[DataObjects.CELL_INVISIBLE] = 'field-none.png';
    this.objectImages[DataObjects.CELL_VISIBLE] = 'field-cell.png';

    /** Gem images */
    this.objectImages[DataObjects.OBJECT_HOLE] = 'field-none.png';
    this.objectImages[DataObjects.OBJECT_RANDOM] = 'field-none.png';

    this.objectImages[DataObjects.OBJECT_RED] = 'field-red.png';
    this.objectImages[DataObjects.OBJECT_GREEN] = 'field-green.png';
    this.objectImages[DataObjects.OBJECT_BLUE] = 'field-blue.png';
    this.objectImages[DataObjects.OBJECT_YELLOW] = 'field-yellow.png';
    this.objectImages[DataObjects.OBJECT_PURPLE] = 'field-purple.png';
    this.objectImages[DataObjects.OBJECT_SAND] = 'field-sand.png';

    this.objectImages[DataObjects.OBJECT_BARREL] = 'field-barrel.png';
    this.objectImages[DataObjects.OBJECT_BLOCK] = 'field-block.png';
    this.objectImages[DataObjects.OBJECT_POLY_COLOR] = 'field-poly-color.png';
    this.objectImages[DataObjects.OBJECT_GOLD] = 'field-gold.png';
    this.objectImages[DataObjects.OBJECT_TILE] = 'field-tile.png';

    this.objectImages[DataObjects.OBJECT_ALPHA] = 'field-alpha.png';
    this.objectImages[DataObjects.OBJECT_SPIDER_BETA] = 'field-beta.png';
    this.objectImages[DataObjects.OBJECT_GAMMA] = 'field-gamma.png';

    this.objectImages[DataObjects.OBJECT_BOX] = 'field-box.png';
    this.objectImages[DataObjects.OBJECT_CHAIN_A] = 'field-chain-a.png';
    this.objectImages[DataObjects.OBJECT_CHAIN_B] = 'field-chain-b.png';

    /** Gem-lightning images */
    this.objectImages[DataObjects.WITH_LIGHTNING_VERTICAL] = 'spec-light-ver-1.png';
    this.objectImages[DataObjects.WITH_LIGHTNING_HORIZONTAL] = 'spec-light-hor-1.png';
    this.objectImages[DataObjects.WITH_LIGHTNING_CROSS] = 'spec-light-cross-1.png';

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
        if (!userId) userId = LogicUser.getCurrent().id;
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

        this.objectAnims[DataObjects.WITH_LIGHTNING_HORIZONTAL] = [[{
            type: GUI.ANIM_TYPE_MOVIE,
            images: [
                'spec-light-hor-1.png',
                'spec-light-hor-2.png',
                'spec-light-hor-3.png',
                'spec-light-hor-4.png',
                'spec-light-hor-5.png',
            ],
            duration: 5,
        }, {
            type: GUI.ANIM_TYPE_GOTO,
            pos: 0
        }]];
        this.objectAnims[DataObjects.WITH_LIGHTNING_VERTICAL] = [[{
            type: GUI.ANIM_TYPE_MOVIE,
            images: [
                'spec-light-ver-1.png',
                'spec-light-ver-2.png',
                'spec-light-ver-3.png',
                'spec-light-ver-4.png',
                'spec-light-ver-5.png',
            ],
            duration: 5,
        }, {
            type: GUI.ANIM_TYPE_GOTO,
            pos: 0
        }]];
        this.objectAnims[DataObjects.WITH_LIGHTNING_CROSS] = [[{
            type: GUI.ANIM_TYPE_MOVIE,
            images: [
                'spec-light-cross-1.png',
                'spec-light-cross-2.png',
                'spec-light-cross-3.png',
                'spec-light-cross-4.png',
                'spec-light-cross-5.png',
            ],
            duration: 5,
        }, {
            type: GUI.ANIM_TYPE_GOTO,
            pos: 0
        }]];
    }
    ;
};

DataPoints = new DataPoints;
