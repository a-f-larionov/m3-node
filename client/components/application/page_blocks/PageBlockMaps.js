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

    var dialogPointInfo = false;

    let dialogChestNeedStars;

    let dialogChestYouWin;

    var elPreloader = false;

    var elArrowPrev = false;

    var elArrowNext = false;

    var elMap = false;

    var elMapWay = false;

    var elOldPaper = false;

    var elMapElements = {};

    /**
     * @type {ElementFriendsPanel}
     */
    var elFriendsPanel = false;

    var mapIdOld = 1;

    let domLoader = null;

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

        elOldPaper = GUI.createElement(ElementImage, {
            x: 0, y: 0, width: 777, height: 500,
            src: '/images/old-paper.png'
        });
        self.elements.push(elOldPaper);

        elMapWay = GUI.createElement(ElementImage, {
            x: 0, y: 0, width: 777, height: 500,
            src: '/images/way-line.png'
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
            srcRest: '/images/map-arrow-left-rest.png',
            srcHover: '/images/map-arrow-left-hover.png',
            srcActive: '/images/map-arrow-left-active.png',
            onClick: LogicMap.onArrowPrevClick
        });
        self.elements.push(elArrowPrev);

        elArrowNext = GUI.createElement(ElementButton, {
            x: 714, y: 160,
            srcRest: '/images/map-arrow-right-rest.png',
            srcHover: '/images/map-arrow-right-hover.png',
            srcActive: '/images/map-arrow-right-active.png',
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
                    dialogPointInfo.showDialog(element);
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
                number: coord.number,
                enabled: true,
                onClick: function (e, d, el) {
                    let chestId, isItOpened, chest, goalStars, mapStars;
                    console.log('click on chest');
                    chestId = el.chestId;
                    isItOpened = DataChests.isItOpened(chestId);
                    chest = DataChests.getById(chestId);
                    goalStars = chest.goalStars;
                    mapStars = DataMap.countStarsByMapId();
                    console.log('map stars: ' + mapStars);
                    if (isItOpened) {
                        console.log('уже открыт!');
                    } else {
                        if (mapStars < goalStars) {
                            dialogChestNeedStars.mapStars = mapStars;
                            dialogChestNeedStars.goalStars = goalStars;
                            dialogChestNeedStars.showDialog();
                            // если закрыт и не хватает звёзд - диалог с надписью: что бы открыть сундук , собери еще
                        } else {
                            SAPIChest.openChest(chestId);
                            DataChests.setOpened(chestId);
                            DataPrizes.giveOutPrizes(chest.prizes);
                            dialogChestYouWin.chestId = chestId;
                            dialogChestYouWin.showDialog();
                            PageController.redraw();
                        }
                    }
                }
            });
            //self.elements.push(el);
            chestsEls[coord.number] = el;
        });

        dialogPointInfo = GUI.createElement(ElementDialogPointInfo, {});
        self.elements.push(dialogPointInfo);

        dialogChestNeedStars = GUI.createElement(ElementDialogChestNeedStars, {});
        self.elements.push(dialogChestNeedStars);

        dialogChestYouWin = GUI.createElement(ElementDialogChestYouWin, {});
        self.elements.push(dialogChestYouWin);

        elFriendsPanel = GUI.createElement(ElementFriendsPanel, {
            x: 100,
            y: 450 - 25
        });
        //@todo show it
        //self.elements.push(elFriendsPanel);

        el = GUI.createElement(ElementButton, {
            x: 50, y: 430 + 25,
            srcRest: '/images/button-friend-add-rest.png',
            srcHover: '/images/button-friend-add-hover.png',
            srcActive: '/images/button-friend-add-active.png',
            onClick: function () {
                SocNet.openInviteFriendDialog();
            }
        });
        self.elements.push(el);

        domLoader = GUI.createDom(undefined, {
            x: 0, y: 0, backgroundImage: '/images/map-preloader.png'
        });
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

        if (isWaiting()) {
            domLoader.show();
            return;
        } else {
            domLoader.hide();
        }

        self.preset();
        elFriendsPanel.setFriends(LogicUser.getList(LogicUser.getFriendIds(5)));
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
        domLoader.hide();
    };

    this.mapElsRedraw = function () {
        let map;
        map = DataMap.getCurent();
        if (!map) return;

        elMap.src = map.src;
        elMap.redraw();

        if (mapIdOld != map.id) {
            this.mapElsShow();
        }

        for (let i in elMapElements[map.id]) {
            elMapElements[map.id][i].redraw();
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

        let uids, users;
        uids = LogicUser.getFriendIdsByMapId(DataMap.getCurent().id);
        if (uids) {
            users = LogicUser.getList(uids);
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

            //@todo and sort by score on this poin!:)
            if (users) {
                pointEl.setFriends(
                    users.filter(function (user) {
                        return user.currentPoint >= pointId;
                    }).map(function (user) {
                        return user.id;
                    })
                );
            }
        }
    };

    /**
     * Обновление данных перед отрисовкой сундуков
     */
    this.presetChests = function () {
        let chestId, chest, chestEl, map;
        map = DataMap.getCurent();
        if (!map) return;
        for (let number = 1; number <= DataMap.CHESTS_PER_MAP; number++) {
            chestId = DataMap.getChestIdFromChestNumber(number);
            chest = DataChests.getById(chestId);
            if (!chest) continue;

            chestEl = chestsEls[number];
            chestEl.chestId = chestId;
            chestEl.goalStars = chest.goalStars;
            chestEl.stars = DataMap.countStarsByMapId();
        }
    };

    let isWaiting = function () {
        let waiting, map, fids, mfids, flist, mflist;
        waiting = false;

        map = DataMap.getCurent();
        fids = LogicUser.getFriendIds(5);
        if (map) mfids = LogicUser.getFriendIdsByMapId(map.id);
        if (fids) flist = LogicUser.getList(fids);
        if (mfids) mflist = LogicUser.getList(mfids);

        if (!map) waiting = true;
        //if (!fids) waiting = true;
        //if (!mfids) waiting = true;
        if (fids && fids.length !== flist.length) waiting = true;
        if (mfids && mfids.length !== mflist.length) waiting = true;
        if (waiting) {
            Logs.log('PageBlockMaps::Waiting data');
        } else {
            Logs.log('PageBlockMaps::No Wating');
        }
        return waiting;
    }
};

PageBlockMaps = new PageBlockMaps;