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

    /**
     * @type {ElementFriendsPanel}
     */
    var elFriendsPanel = false;

    var mapIdOld = 1;

    /**
     * @type ElementPoint[]
     */
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
        let el;

        elMap = GUI.createElement(ElementImage, {
            x: 0, y: 0, width: 777, height: 500,
            src: '/images/ratingInfo.png'
        });
        self.elements.push(elMap);

        elMapWay = GUI.createElement(ElementImage, {
            x: 0, y: 0, width: 777, height: 500,
            src: '/images/maps/way-line.png'
        });
        self.elements.push(elMapWay);

        elPreloader = GUI.createElement(ElementImage, {
            x: 0, y: 0, width: 777, height: 500,
            src: '/images/map-preloader.png'
        });

        /*
         - 1 on load map - create elements and hide it
         - 2 on showMap(1) -> set Map picture, show elements on current map
         */

        elArrowPrev = GUI.createElement(ElementButton, {
            x: 10, y: 160,
            srcRest: '/images/map-arrow-left.png',
            srcHover: '/images/map-arrow-left.png',
            srcActive: '/images/map-arrow-left.png',
            onClick: LogicMap.onArrowPrevClick
        });
        self.elements.push(elArrowPrev);

        elArrowNext = GUI.createElement(ElementButton, {
            x: 714, y: 160,
            srcRest: '/images/map-arrow-right.png',
            srcHover: '/images/map-arrow-right.png',
            srcActive: '/images/map-arrow-right.png',
            onClick: LogicMap.onArrowNextClick
        });
        self.elements.push(elArrowNext);

        /* Points */
        DataPoints.getPointsCoords().forEach(function (coord) {
            el = GUI.createElement(ElementPoint, {
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
            self.elements.push(el);
            pointsEls[coord.number] = el;
        });

        // сундуки
        DataChests.getCoords().forEach(function (coord) {
            el = GUI.createElement(ElementChest, {
                x: coord.x, y: coord.y,
                width: 71, height: 62,
                chestId: coord.number,
                number: coord.number,
                enabled: true
            });
            self.elements.push(el);
            chestsEls[coord.number] = el;
        });

        elementDialogPointInfo = GUI.createElement(ElementDialogPointInfo, {
            src: '/images/window.png',
            width: 342, height: 200
        });
        self.elements.push(elementDialogPointInfo);

        elFriendsPanel = GUI.createElement(ElementFriendsPanel, {
            x: 100,
            y: 400
        });
        self.elements.push(elFriendsPanel);

        el = GUI.createElement(ElementButton, {
            x: 50, y: 430,
            srcRest: '/images/star-off.png',
            srcHover: '/images/star-on.png',
            srcActive: '/images/star-on.png',
            onClick: function () {
                SocNet.openInviteFriendDialog();
            }
        });
        self.elements.push(el);
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
        elFriendsPanel.setFriends(LogicUser.getFriends());
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
        let user, pointId, point, pointEl, userPoint, map, friendsPoints;
        user = LogicUser.getCurrentUser();
        map = DataMap.getCurent();
        if (!map) return;
        userPoint = DataPoints.getPointUserScore(map.id, [user.id]);
        let friendIds = LogicUser.getFriendIds();
        if (friendIds.length) {
            friendsPoints = DataPoints.getPointUserScore(map.id, friendIds);
        }
        // DataPoints
        for (let number = 1; number <= DataMap.POINTS_PER_MAP; number++) {

            pointId = DataMap.getPointIdFromPointNumber(number);
            pointEl = pointsEls[number];
            pointEl.pointId = pointId;
            point = DataPoints.getById(pointId);
            if (!point) continue;

            pointEl = pointsEls[number];

            if (point.id === user.currentPoint) pointEl.stateId = 2;
            if (point.id < user.currentPoint) pointEl.stateId = 3;
            if (point.id > user.currentPoint) pointEl.stateId = 1;

            if (userPoint[pointId])
                pointEl.userScore = userPoint[pointId][user.id] ? userPoint[pointId][user.id].score : 0;
            else
                pointEl.userScore = 0;

            // тут  нужны друзья именно на этой точке
            if (friendIds.length && friendsPoints[pointId]) {
                let pointUids = [];
                for (let i in friendsPoints[pointId]) pointUids.push(i);
                pointEl.setFriends(friendsPoints[pointId], LogicUser.getList(pointUids));
            }
        }
    };

    /**
     * Обновление данных перед отрисовкой сундуков
     */
    this.presetChests = function () {
        let user, chestId, chest, chestEl, map;
        map = DataMap.getCurent();
        if (!map) return;
        for (let number = 1; number <= DataMap.CHESTS_PER_MAP; number++) {
            chestId = DataMap.getChestIdFromChestNumber(number);
            chest = DataChests.getById(chestId);
            if (!chest) continue;

            chestsEls[number].pointId = chestId;
            chestEl = chestsEls[number];
            chestEl.goalStars = chest.goalStars;
            chestEl.stars = DataMap.countStarsByMapId();
        }
    };
};

PageBlockMaps = new PageBlockMaps;