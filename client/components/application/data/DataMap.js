// @Todo super mega crunch
GUI = {};

GUI.ANIM_TYPE_ROTATE = 10;
GUI.ANIM_TYPE_MOVE = 20;
GUI.ANIM_TYPE_GOTO = 30;
GUI.ANIM_TYPE_MOVIE = 40;
GUI.ANIM_TYPE_PAUSE = 50;
GUI.ANIM_TYPE_STOP = 60;

DataMap = function () {

    let currentMapId = 1;

    /**
     * DataMapjs
     * @type {[*]}
     */
    let maps = {};

    let mapsLoadings = [];

    let loadMap = function (mapId) {
        if (!mapId) mapId = currentMapId;
        if (!mapsLoadings[mapId]) {
            mapsLoadings[mapId] = true;
            SAPIMap.sendMeMapInfo(mapId);
        }
    };

    this.setMapById = function (mapId, mapData) {
        maps[mapId] = mapData;
        PageController.redraw();
    };

    this.getCurent = function () {
        if (!maps[currentMapId]) {
            loadMap();
        }
        return maps[currentMapId];
    };

    this.setNextMap = function () {
        if (currentMapId === DataMap.MAP_ID_MAX) {
            return;
        }
        currentMapId++;
    };

    this.setPrevMap = function () {
        if (currentMapId === DataMap.MAP_ID_MIN) {
            return;
        }
        currentMapId--;
    };

    this.getFirstPointId = function () {
        return DataMap.POINTS_PER_MAP * (currentMapId - 1) + 1;
    };

    this.getLastPointId = function () {
        return this.getFirstPointId() + DataMap.POINTS_PER_MAP - 1;
    };

    this.getPointIdFromPointNumber = function (number) {
        return this.getFirstPointId() + (number - 1);
    };

    this.getFirstChestId = function () {
        return DataMap.CHESTS_PER_MAP * (currentMapId - 1) + 1;
    };

    this.getLastChestId = function () {
        return this.getFirstChestId() + DataMap.CHESTS_PER_MAP - 1;
    };

    this.getChestIdFromChestNumber = function (number) {
        return this.getFirstChestId() + (number - 1);
    };

    this.countStarsByMapId = function (mapId) {
        let mapStars, user, pointUsersInfo, pointId, point, stars;
        if (!mapId) mapId = currentMapId;

        mapStars = 0;
        user = LogicUser.getCurrentUser();
        if (!user) return 0;
        pointUsersInfo = DataPoints.getPointUserScore(mapId, [user.id]);

        if (!pointUsersInfo) return 0;
        for (let number = 1; number <= DataMap.POINTS_PER_MAP; number++) {

            pointId = DataMap.getPointIdFromPointNumber(number);
            point = DataPoints.getById(pointId);
            if (!point) return 0;

            stars = 0;
            if (!pointUsersInfo[pointId]) continue;
            if (!pointUsersInfo[pointId][user.id]) continue;

            if (pointUsersInfo[pointId][user.id].score >= point.score1) stars = 1;
            if (pointUsersInfo[pointId][user.id].score >= point.score2) stars = 2;
            if (pointUsersInfo[pointId][user.id].score >= point.score3) stars = 3;
            mapStars += stars;
        }
        return mapStars;
    }
};

DataMap = new DataMap();

/* server see */
DataMap.MAP_ID_MIN = 1;
DataMap.MAP_ID_MAX = 10;
DataMap.POINTS_PER_MAP = 18;
DataMap.CHESTS_PER_MAP = 2;