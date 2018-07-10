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
            src: DataMap.getCurent()['src']
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
            x: 50,
            y: 200,
            srcRest: '/images/map-arrow-left.png',
            srcHover: '/images/map-arrow-left.png',
            srcActive: '/images/map-arrow-left.png',
            onClick: LogicMap.onArrowPrevClick
        });
        self.elements.push(elArrowPrev);

        elArrowNext = GUI.createElement(ElementButton, {
            x: 777 - 50 - 53,
            y: 200,
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
                stars: 0,
                friends: [],
                colorId: 1
            });
            this.elements.push(element);
        }
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
        if (!data) {
            this.loadCurrentMap();
            return;
        }
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
        if (!data) {
            this.loadCurrentMap();
            return;
        }

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
        if (!data) {
            this.loadCurrentMap();
            return;
        }
        data = DataMap.getCurent();
        elMap.src = data.src;
        elMap.redraw();

        if (mapIdOld != data.id) {
            this.mapElsShow();
        }

        for (let i in elMapElements[data.id]) {
            elMapElements[data.id][i].redraw();
        }

    };

    this.loadCurrentMap = function () {
        DataMap.loadMap();
    };

    this.presetPoints = function () {

    };
};

PageBlockMaps = new PageBlockMaps;