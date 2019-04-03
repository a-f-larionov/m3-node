/**
 * Основной блок страницы игры.
 * @constructor
 */
PageBlockMaps = function PageBlockMaps() {
    var self = this;

    /**
     * Показывать ли страницу.
     * @type {boolean}
     */
    var showed = false;

    var elementDialogPointInfo = false;

    var elPreloader = false;

    var elArrowPrev = false;

    var elArrowNext = false;

    var elMap = false;

    var elMapWay = false;

    var elMapElements = {};

    var mapIdOld = 1;

    var pointsEls = [];

    var chestsEls = [];

    /**
     * Массив всех элементов страницы.
     * @type {Array}
     */
    this.elements = [];

    /**
     * Создадим тут все элементы страницы.
     */
    this.init = function () {
        var element;

        elMap = GUI.createElement(ElementImage, {
            x: 0,
            y: 0,
            width: 777,
            height: 500,
            src: '/images/ratingInfo.png'
        });
        self.elements.push(elMap);

        elMapWay = GUI.createElement(ElementImage, {
            x: 0,
            y: 0,
            width: 777,
            height: 500,
            src: '/images/maps/way-line.png'
        });
        self.elements.push(elMapWay);

        elPreloader = GUI.createElement(ElementImage, {
            x: 0,
            y: 0,
            width: 777,
            height: 500,
            src: '/images/map-preloader.png'
        });

        /*
         - 1 on load map - create elements and hide it
         - 2 on showMap(1) -> set Map picture, show elements on current map
         */

        elArrowPrev = GUI.createElement(ElementButton, {
            x: 10,
            y: 160,
            srcRest: '/images/map-arrow-left.png',
            srcHover: '/images/map-arrow-left.png',
            srcActive: '/images/map-arrow-left.png',
            onClick: LogicMap.onArrowPrevClick
        });
        self.elements.push(elArrowPrev);

        elArrowNext = GUI.createElement(ElementButton, {
            x: 714,
            y: 160,
            srcRest: '/images/map-arrow-right.png',
            srcHover: '/images/map-arrow-right.png',
            srcActive: '/images/map-arrow-right.png',
            onClick: LogicMap.onArrowNextClick
        });
        self.elements.push(elArrowNext);

        /* Points */
        DataPoints.getPointsCoords().forEach(function (coord) {
            element = GUI.createElement(ElementPoint, {
                x: coord.x,
                y: coord.y,
                friends: [],
                stateId: ElementPoint.STATE_CLOSE,
                number: coord.number,
                pointId: coord.number,
                width: 50,
                height: 50,
                onClick: function (event, dom, element) {
                    elementDialogPointInfo.showDialog(element);
                }
            });
            self.elements.push(element);
            pointsEls[coord.number] = element;
        });

        // сундуки
        DataChests.getCoords().forEach(function (coord) {
            element = GUI.createElement(ElementChest, {
                x: coord.x,
                y: coord.y,
                width: 71,
                height: 62,
                chestId: coord.number,
                number: coord.number,
                enabled: true
            });
            self.elements.push(element);
            chestsEls[coord.number] = element;
        });

        elementDialogPointInfo = GUI.createElement(ElementDialogPointInfo, {
            src: '/images/window.png',
            width: 342,
            height: 200
        });
        self.elements.push(elementDialogPointInfo);
    };

    /**
     * Покажем все элементы на странице.
     */
    this.show = function () {
        if (showed === true) return;
        showed = true;
        self.elements.forEach(function (element) {
            element.show();
        });

        this.mapElsCreateIfNotExits();
        this.mapElsShow();
        self.redraw();
    };

    /**
     * Спрачем все элементы на странице.
     */
    this.hide = function () {
        if (showed === false) return;
        showed = false;
        for (var i in self.elements) {
            self.elements[i].hide();
        }
        this.mapElsHide();
    };

    /**
     * Настройка перед отрисовкой.
     */
    this.preset = function () {
        this.presetPoints();
        this.presetChests();
    };

    /**
     *
     */
    this.redraw = function () {
        if (!showed) return;
        self.preset();
        self.elements.forEach(function (element) {
            element.redraw();
        });
        this.mapElsRedraw();
    };

    this.mapElsCreateIfNotExits = function () {
        let data, element;
        data = DataMap.getCurent();
        if (!data) return;
        if (!elMapElements[data.id]) {
            elMapElements[data.id] = [];
            for (let i in data.elements) {
                element = GUI.createElement(
                    window[data.elements[i].name],
                    data.elements[i].params
                );
                if (data.elements[i].animPlay) {
                    element.animPlay();
                }
                elMapElements[data.id].push(element);
            }
        }
    };

    this.mapElsShow = function () {
        let data;
        data = DataMap.getCurent();
        if (!data) return;

        for (let i in elMapElements[data.id]) {
            elMapElements[data.id][i].show();
        }
        if (mapIdOld != data.id) {

            for (let i in elMapElements[mapIdOld]) {
                elMapElements[mapIdOld][i].hide();
            }
            mapIdOld = data.id;
        }
    };

    this.mapElsHide = function () {
        for (let id in elMapElements) {
            for (let i in elMapElements[id]) {
                elMapElements[id][i].hide();
            }
        }
    };

    this.mapElsRedraw = function () {
        let data;
        data = DataMap.getCurent();
        if (!data) return;

        elMap.src = data.src;
        elMap.redraw();

        if (mapIdOld != data.id) {
            this.mapElsShow();
        }

        for (let i in elMapElements[data.id]) {
            elMapElements[data.id][i].redraw();
        }
    };

    /**
     * Обновление данных перед отрисовкой точек
     */
    this.presetPoints = function () {
        let user, pointId, point, pointEl, pointInfo, map;
        user = LogicUser.getCurrentUser();
        map = DataMap.getCurent();
        if (!map) return;
        pointInfo = DataPoints.getPointUserScore(map.id, [user.id]);
        for (let number = 1; number <= DataMap.POINTS_PER_MAP; number++) {

            pointId = DataMap.getPointIdFromPointNumber(number);
            pointsEls[number].pointId = pointId;
            point = DataPoints.getById(pointId);
            if (!point) continue;

            pointEl = pointsEls[number];

            if (point.id == user.currentPoint) pointEl.stateId = 2;
            if (point.id < user.currentPoint) pointEl.stateId = 3;
            if (point.id > user.currentPoint) pointEl.stateId = 1;

            pointEl.score1 = point.score1;
            pointEl.score2 = point.score2;
            pointEl.score3 = point.score3;

            if (pointInfo[pointId])
                pointEl.userScore = pointInfo[pointId][user.id] ? pointInfo[pointId][user.id].score : 0;
            else
                pointEl.userScore = 0;
        }
    };

    /**
     * Обновление данных перед отрисовкой сундуков
     */
    this.presetChests = function () {
        let user, chestId, chest, chestEl, info, map;
        user = LogicUser.getCurrentUser();
        map = DataMap.getCurent();
        if (!map) return;
        //info = DataChests.getUsersInfo(map.id, [user.id]);
        for (let number = 1; number <= DataMap.CHESTS_PER_MAP; number++) {
            chestId = DataMap.getChestIdFromChestNumber(number);
            chest = DataChests.getById(chestId);
            if (!chest) continue;

            chestsEls[number].pointId = chestId;
            chestEl = chestsEls[number];
            chestEl.goalStars = chest.goalStars;
            chestEl.stars = DataMap.getStarsByMapId();
        }
    };
};

PageBlockMaps = new PageBlockMaps;