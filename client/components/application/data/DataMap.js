/**
 * @type {DataMap}
 * @constructor
 */
let DataMap = function () {

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
            DataPoints.loadScores(DataMap.getMapPointIds(mapId));
            SAPIMap.sendMeMapInfo(mapId);
        }
    };

    this.setMapById = function (mapId, mapData) {
        maps[mapId] = mapData;
        PageController.redraw();
    };

    this.getCurrent = function () {
        if (!maps[currentMapId]) {
            loadMap();
        }
        return maps[currentMapId];
    };

    this.setCurrentMapId = function (id) {
        if (!id) id = Math.min(DataMap.MAP_ID_MAX, LogicUser.getUserLastMapId());
        if (!id) return;

        if (id > DataMap.MAP_ID_MAX) {
            return;
        }
        if (id <= DataMap.MAP_ID_MIN) {
            return;
        }
        currentMapId = id;
    };

    this.setNextMap = function () {
        /**
         * 1 - При более чем текущая юзера +2 - писать Пройди уровни
         * 2 - Прим максимум - писать
         */
        if (currentMapId >= LogicUser.getUserLastMapId() + 1) {
            PBZDialogs.dialogMessage.showDialog(
                'НЕ ДОСТУПНО',
                ' ДОСТУП ПОЯВИТСЯ ПОСЛЕ \r\n \r\n ПРОХОЖДЕНИЯ УРОВНЕЙ \r\n\r\n ПРЕДЫДУЩЕЙ КАРТЫ. ',
                5
            );
            return;
        }
        if (currentMapId === DataMap.MAP_ID_MAX) {
            PBZDialogs.dialogMessage.showDialog(
                'СТРОИМ',
                ' УРОВНИ СОЗДАЮТСЯ \r\n\r\n СЛЕДИ ЗА НОВОСТЯМИ В ГРУППЕ! \r\n\r\n И ВОЗВРАЩАЙСЯ В ИГРУ! ',
                5
            );
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

    this.getMapIdFromPointId = function () {
        return Math.ceil(LogicUser.getCurrent().nextPointId / DataMap.POINTS_PER_MAP);
    };

    this.getFirstPointId = function () {
        return DataMap.POINTS_PER_MAP * (currentMapId - 1) + 1;
    };

    this.getLastPointId = function () {
        return this.getFirstPointId() + DataMap.POINTS_PER_MAP - 1;
    };

    this.getMapPointIds = function (mapId) {
        let firstPointId, lastPointId, pointIds;
        firstPointId = DataMap.getFirstPointId(mapId);
        lastPointId = DataMap.getLastPointId(mapId);
        pointIds = [];
        for (let i = firstPointId; i <= lastPointId; i++) pointIds.push(i);
        return pointIds;
    };

    this.getPointIdFromPointNumber = function (number) {
        return this.getFirstPointId() + (number - 1);
    };

    this.getNumberFromPointId = function (pointId) {
        return pointId - this.getFirstPointId() + 1;
    };

    this.countStarsByMapId = function (mapId) {
        let mapStars, user, pointUsersInfo, pointId, point, stars;
        if (!mapId) mapId = currentMapId;

        mapStars = 0;
        user = LogicUser.getCurrent();
        if (!user) return 0;
        //for currentUser all scores here
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

/** @Todo super mega crunch */
//@Todonow
/** @type {DataMap} */
DataMap = new DataMap();

/** Server see */
DataMap.MAP_ID_MIN = 1;
DataMap.MAP_ID_MAX = 3;
DataMap.POINTS_PER_MAP = 18;