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

    let wayPoints = {};

    let fromDBToData = function (data) {
        if (!data) return data;
        if (data.userId) data.userId = parseInt(data.userId);
        if (data.pointId) data.pointId = parseInt(data.pointId);
        if (data.score) data.score = parseInt(data.score);
        return data;
    };

    wayPoints[1] = {
        id: 1,
        turns:35,
        score1: 100,
        score2: 200,
        score3: 300,
        field: [
            "nnnnnnnnnn",
            "nnnnnnnnnn",
            "bbbbbnnnnn",
            "nnnnnnnnnn",
            "BBBBBGGGnG"
        ],
        goals: [
            {
                id: this.OBJECT_GREEN,
                count: 10
            }
        ],
    };

    wayPoints[2] = {
        id: 2,
        turns:36,
        score1: 100,
        score2: 200,
        score3: 300,
        field: [
            "nnnnn",
            "nnnnn",
            "nnnnn"
        ],
        goals: [
            {
                id: this.OBJECT_GREEN,
                count: 3
            },
            {
                id: this.OBJECT_RED,
                count: 4
            }
        ]
    };

    wayPoints[3] = {
        id: 3,
        turns:307,
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
        goals: [
            {
                id: this.OBJECT_GREEN,
                count: 10
            }
        ]
    };

    wayPoints[4] = {
        id: 4,
        turns:30,
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
        goals: [
            {
                id: this.OBJECT_GREEN,
                count: 1
            }
        ]
    };

    wayPoints[5] = {
        id: 5,
        turns:30,
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
        goals: [
            {
                id: this.OBJECT_GREEN,
                count: 1
            }
        ]
    };

    wayPoints[6] = {
        id: 6,
        turns:30,
        score1: 30,
        score2: 200,
        score3: 300,
        field: [
            "bbbbb",
            "bnnGb",
            "bRGBb",
            "bnBGb",
            "Bnnnb"
        ],
        goals: [
            {
                id: this.OBJECT_GREEN,
                count: 1
            }
        ]
    };

    wayPoints[7] = {
        id: 7,
        turns:30,
        score1: 100,
        score2: 200,
        score3: 300,
        field: [
            "bbbbb",
            "bnnnb",
            "bRGBb",
            "bnGnb",
            "RbbGb"
        ],
        goals: [
            {
                id: this.OBJECT_GREEN,
                count: 1
            }
        ]
    };

    wayPoints[8] = {
        id: 8,
        turns:30,
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
        goals: [
            {
                id: this.OBJECT_GREEN,
                count: 1
            }
        ]
    };

    wayPoints[9] = {
        id: 9,
        turns:30,
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
        goals: [
            {
                id: this.OBJECT_GREEN,
                count: 1
            }
        ]
    };

    this.getById = function (id) {
        return wayPoints[id];
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
            userId: [userIds, DB.WHERE_IN],
        }, function (rows, query) {
            for (let i in rows) {
                rows[i] = fromDBToData(rows[i]);
            }
            callback(rows || null, query);
        });
    };

    this.updateUsersPoints = function (userId, pointId, score, callback) {
        let query;
        query = "INSERT INTO users_points(userId, pointId, score) " +
            "VALUES (" + userId + "," + pointId + "," + score + ") " +
            "ON DUPLICATE KEY " +
            "UPDATE score = " + score;
        DB.query(query, callback);
    };
};

DataPoints = new DataPoints;
