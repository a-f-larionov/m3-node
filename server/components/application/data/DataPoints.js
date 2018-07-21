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

    let tableName = 'users_points';

    let pointsData = {};

    let fromDBToData = function (data) {
        if (!data) return data;
        if (data.userId) data.userId = parseInt(data.userId);
        if (data.pointId) data.pointId = parseInt(data.pointId);
        if (data.score) data.score = parseInt(data.score);
        return data;
    };

    pointsData[1] = {
        id: 1,
        score1: 100,
        score2: 200,
        score3: 300,
        field: [
            "nnnnn",
            "nnnnn",
            "nnnnn",
            "nnnnn",
            "nnnnn"
        ],
        targets: [
            {
                id: this.OBJECT_GREEN,
                count: 1
            }
        ]
    };

    pointsData[2] = {
        id: 2,
        score1: 100,
        score2: 200,
        score3: 300,
        field: [
            "nnnnn",
            "nnnnn",
            "nnnnn"
        ],
        targets: [
            {
                id: this.OBJECT_GREEN,
                count: 1
            },
            {
                id: this.OBJECT_RED,
                count: 2
            }
        ]
    };

    pointsData[3] = {
        id: 3,
        score1: 100,
        score2: 200,
        score3: 300,
        field: [
            "Rnnnnnnnnn",
            "GGnnnnnnnn",
            "BBBnnnnnnn",
            "RRRRnnnnnn",
            "GGGGGnnnnn",
            "BBBBBBnnnn",
            "RRRRRRRnnn",
            "GGGGGGGGnn",
        ],
        targets: [
            {
                id: this.OBJECT_GREEN,
                count: 1
            }
        ]
    };

    pointsData[4] = {
        id: 4,
        score1: 100,
        score2: 200,
        score3: 300,
        field: [
            "nnnnnnnnnn",
            "nnnnnnnnnn",
            "nnnnnnnnnn",
            "nnnnnnnnnn",
            "nnnnnnnnnn",
            "nnnnnnnnnn",
            "nnnnnnnnnn",
            "nnnnnnnnnn",
            "nnnnnnnnnn",
            "nnnnnnnnnn",
        ],
        targets: [
            {
                id: this.OBJECT_GREEN,
                count: 1
            }
        ]
    };

    pointsData[5] = {
        id: 5,
        score1: 100,
        score2: 200,
        score3: 300,
        field: [
            "nnnnnnnnnn",
            "nnnnnnnnnn",
            "nnnnnnnnnn",
            "nnnnnnnnnn",
            "nnnnnnnnnn",
            "nnnnnnnnnn",
            "nnnnnnnnnn",
            "nnnnnnnnnn",
            "nnnnnnnnnn",
            "nnnnnnnnnn",
        ],
        targets: [
            {
                id: this.OBJECT_GREEN,
                count: 1
            }
        ]
    };

    pointsData[6] = {
        id: 6,
        score1: 100,
        score2: 200,
        score3: 300,
        field: [
            "bbbbb",
            "bnnnb",
            "bRGBb",
            "bnnnb",
            "Bnnnb"
        ],
        targets: [
            {
                id: this.OBJECT_GREEN,
                count: 1
            }
        ]
    };

    pointsData[7] = {
        id: 7,
        score1: 100,
        score2: 200,
        score3: 300,
        field: [
            "bbbbb",
            "bnnnb",
            "bRGBb",
            "bnnnb",
            "Rbbbb"
        ],
        targets: [
            {
                id: this.OBJECT_GREEN,
                count: 1
            }
        ]
    };

    pointsData[8] = {
        id: 8,
        score1: 100,
        score2: 200,
        score3: 300,
        field: [
            "bnnnb",
            "bnnnb",
            "bRGBb",
            "bnnnb",
            "Gbbbb"
        ],
        targets: [
            {
                id: this.OBJECT_GREEN,
                count: 1
            }
        ]
    };

    pointsData[9] = {
        id: 9,
        score1: 100,
        score2: 200,
        score3: 300,
        field: [
            "bbbbb",
            "bnnnb",
            "bRGBb",
            "bnnnb",
            "Bnnnb"
        ],
        targets: [
            {
                id: this.OBJECT_GREEN,
                count: 1
            }
        ]
    };

    this.getById = function (id) {
        return pointsData[id];
    };

    this.getPointsByMapId = function (mapId) {
        let firstPointId, lastPointId, points;
        firstPointId = DataMap.getFirstPointId(mapId);
        lastPointId = DataMap.getLastPointId(mapId);

        points = [];
        for (let id = firstPointId; id <= lastPointId; id++) {
            points.push(this.getById(id));
        }
        return points;
    };

    this.getUsersInfo = function (mapId, userIds, callback) {
        /**
         * @TODO  only some points from mapId
         */
        DB.queryWhere(tableName, {
            pointId: [[1, 2, 3, 4, 5, 6], DB.WHERE_IN],
            userId: [userIds, DB.WHERE_EQUAL],
        }, function (rows, query) {
            for (let i in rows) {
                rows[i] = fromDBToData(rows[i]);
            }
            callback(rows || null, query);
        });

    }
};

DataPoints = new DataPoints;
