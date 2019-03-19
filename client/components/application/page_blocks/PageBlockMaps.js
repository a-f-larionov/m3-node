/**
 * Основная страница игры.
 * @constructor
 */
PageBlockMaps = function PageBlockMaps() {
    var self = this;

    /**
     * Показывать ли страницу.
     * @type {boolean}
     */
    var showed = false;

    var elementDialog = false;

    var elPreloader = false;

    var elArrowPrev = false;

    var elArrowNext = false;

    var elMap = false;

    var elMapWay = false;

    var elMapElements = {};

    var mapIdOld = 1;

    var pointsEls = [];

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

        if (false) {
            element = GUI.createDom(undefined, {
                x: 50,
                y: 50,
                backgroundImage: '/images/man-01.png',
                animTracks: [
                    [
                        {
                            type: GUI.ANIM_TYPE_MOVIE,
                            images: [
                                '/images/man_right_1.png',
                                '/images/man_right_2.png',
                                '/images/man_right_3.png',
                                '/images/man_right_4.png',
                                '/images/man_right_5.png',
                                '/images/man_right_6.png',
                                '/images/man_right_7.png',
                                '/images/man_right_8.png'
                            ]
                        }
                    ],
                    [
                        {type: GUI.ANIM_TYPE_MOVE, vX: 3, vY: 0, duration: 30},
                        {type: GUI.ANIM_TYPE_MOVE, vX: -3, vY: 0, duration: 30},
                        {type: GUI.ANIM_TYPE_GOTO, pos: 0}
                    ],
                    /*[
                     {type: GUI.ANIM_TYPE_PAUSE, duration: 100},
                     {type: GUI.ANIM_TYPE_STOP}
                     ]*/
                ]
            });
            element.animPlayed = true;

            self.elements.push(element);

        }
        if (false) {

            element = GUI.createElement(ElementSprite, {
                x: 50,
                y: 50,
                src: '/images/man-01.png',
                domInitParams: {
                    animTracks: [
                        [
                            {
                                type: GUI.ANIM_TYPE_MOVIE,
                                images: [
                                    '/images/man_right_1.png',
                                    '/images/man_right_2.png',
                                    '/images/man_right_3.png',
                                    '/images/man_right_4.png',
                                    '/images/man_right_5.png',
                                    '/images/man_right_6.png',
                                    '/images/man_right_7.png',
                                    '/images/man_right_8.png'
                                ]
                                , duration: 8
                            },
                            {type: GUI.ANIM_TYPE_GOTO, pos: 0}
                        ],
                        [
                            {type: GUI.ANIM_TYPE_MOVE, vX: 3, vY: 0},
                            {type: GUI.ANIM_TYPE_GOTO, pos: 0}
                        ]
                    ]
                }
            });
            element.animPlay();
            self.elements.push(element);

            element = GUI.createElement(ElementButton, {
                x: 100,
                y: 100,
                srcRest: '/images/man_right_1.png',
                srcHover: '/images/man_right_2.png',
                srcActive: '/images/man_right_3.png',
                onClick: function () {
                    self.showDialog();
                }
            });
            self.elements.push(element);

            elementDialog = GUI.createElement(ElementDialog, {
                src: '/images/window.png',
                width: 342,
                height: 200
            });
            self.elements.push(elementDialog);

            elementDialog.createElement(ElementButton, {
                x: 5,
                y: 5,
                srcRest: '/images/man_right_1.png',
                srcHover: '/images/man_right_2.png',
                srcActive: '/images/man_right_3.png',
                onClick: function () {
                    elementDialog.closeDialog();
                }
            }, self.dom);
        }

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

        let pointCoords = DataPoints.getPointsCoords();
        for (let i in pointCoords) {

            element = GUI.createElement(ElementPoint, {
                x: pointCoords[i].x,
                y: pointCoords[i].y,
                friends: [],
                stateId: ElementPoint.STATE_CLOSE,
                number: pointCoords[i].number,
                pointId: pointCoords[i].number,
                width: 50,
                height: 50,
                onClick: LogicMap.onPointClick
            });
            this.elements.push(element);
            pointsEls[pointCoords[i].number] = element;
        }

        element = GUI.createElement(ElementButton, {
            x: 175,
            y: 125,
            width: 71,
            height: 62,
            srcRest: '/images/chest-close.png',
            srcHover: '/images/chest-open.png',
            srcActive: '/images/chest-open.png'
        });
        self.elements.push(element);

    };

    /**
     * Покажем все элементы на странице.
     */
    this.show = function () {
        if (showed === true) return;
        showed = true;
        for (var i in self.elements) {
            self.elements[i].show();
        }

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
    };

    /**
     *
     */
    this.redraw = function () {
        if (!showed)return;
        self.preset();
        for (var i in self.elements) {
            self.elements[i].redraw();
        }
        this.mapElsRedraw();
    };

    this.showDialog = function () {
        Logs.log(Logs.LEVEL_NOTIFY, 'Button clicked!');
        elementDialog.showDialog();
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
        let user, pointId, point, pointEl, pointUsersInfo, map;
        user = LogicUser.getCurrentUser();
        map = DataMap.getCurent();
        if (!map)return;
        pointUsersInfo = DataPoints.getUsersInfo(map.id, [user.id]);
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

            if (pointUsersInfo[pointId])
                pointEl.userScore = pointUsersInfo[pointId][user.id] ? pointUsersInfo[pointId][user.id].score : 0;
            else
                pointEl.userScore = 0;
        }
    };
};

PageBlockMaps = new PageBlockMaps;