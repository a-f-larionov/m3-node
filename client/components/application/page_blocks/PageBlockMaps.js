/**
 * Основной блок страницы игры.
 * @constructor
 */
let PageBlockMaps = function PageBlockMaps() {
    let self = this;

    /**
     * Показывать ли страницу.
     * @type {boolean}
     */
    let showed = false;

    let elPreloader = false;

    let pArrowNext = {x: 714, y: 500 / 2 - 50 / 2};

    let elArrowPrev = false;

    let elArrowNext = false;

    let elMap = false;

    let elMapWay = false;

    let elOldPaper = false;

    let elMapElements = {};

    /**
     * @type {ElementFriendsPanel}
     */
    let elFriendsPanel;

    let mapIdOld = 1;

    let domLoader = null;

    /**
     * @type ElementPoint[]
     */
    let pointsEls = [];

    let chestsEls = [];

    /** @type {ElementImage} */
    let elArrowHint = null;

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

        //@todo preloader
        elPreloader = GUI.createElement(ElementImage, {x: 0, y: 0, width: 777, height: 500, src: 'not-found.png'});

        elOldPaper = GUI.createElement(ElementImage, {x: 0, y: 0, width: 777, height: 500, src: 'old-paper.png'});
        self.elements.push(elOldPaper);

        elMapWay = GUI.createElement(ElementImage, {x: 0, y: 0, width: 777, height: 500, src: 'way-line.png'});
        self.elements.push(elMapWay);

        elMap = GUI.createElement(ElementImage, {x: 0, y: 0, width: 777, height: 500, src: 'map-001.png'});
        self.elements.push(elMap);

        /**
         - 1 on load map - create elements and hide it
         - 2 on showMap(1) -> set Map picture, show elements on current map
         */

        elArrowHint = GUI.createElement(ElementImage, {x: 0, y: 0, width: 50, height: 50, p: {}, src: 'hint-arrow.png'});
        self.elements.push(elArrowHint);
        Animate.anim(animHintArrow, {}, elArrowHint);

        elArrowPrev = GUI.createElement(ElementButton, {
            x: 0, y: pArrowNext.y,
            srcRest: 'map-arrow-left-rest.png',
            onClick: LogicMap.onArrowPrevClick
        });
        self.elements.push(elArrowPrev);

        elArrowNext = GUI.createElement(ElementButton, {
            x: pArrowNext.x, y: pArrowNext.y,
            srcRest: 'map-arrow-right-rest.png',
            onClick: LogicMap.onArrowNextClick
        });
        self.elements.push(elArrowNext);

        /** Points */
        DataPoints.getPointsCoords().forEach(function (coords) {
            if (coords.number === 1) GUI.setTagId(LogicWizard.TAG_FIRST_NUMBER_POINT);
            el = GUI.createElement(ElementPoint, {
                x: coords.x, y: coords.y,
                friends: [],
                stateId: ElementPoint.STATE_CLOSE,
                number: null,
                pointId: null,
                onClick: function (event, dom, element) {
                    PBZDialogs.dialogPointInfo.showDialog(element.pointId);
                }
            });
            self.elements.push(el);
            pointsEls[coords.number] = el;
            if (coords.number === 1) GUI.setTagId(null);
        });

        /** Сундуки */
        DataChests.getCoords().forEach(function (coord) {
            el = GUI.createElement(ElementChest, {
                x: coord.x, y: coord.y,
                width: 71, height: 62,
                number: coord.number,
                enabled: true,
                onClick: function (e, d, el) {
                    let chestId, isItOpened, chest, goalStars, mapStars;
                    chestId = el.chestId;
                    isItOpened = DataChests.isItOpened(chestId);
                    chest = DataChests.getById(chestId);
                    goalStars = chest.goalStars;
                    mapStars = DataMap.countStarsByMapId();
                    if (isItOpened) {
                        //console.log('уже открыт!');
                    } else {
                        if (mapStars < goalStars) {
                            PBZDialogs.dialogChestNeedStars.mapStars = mapStars;
                            PBZDialogs.dialogChestNeedStars.goalStars = goalStars;
                            PBZDialogs.dialogChestNeedStars.showDialog();
                            // если закрыт и не хватает звёзд - диалог с надписью: что бы открыть сундук , собери еще
                        } else {
                            SAPIChest.openChest(chestId);
                            DataChests.setOpened(chestId);
                            DataPrizes.giveOutPrizes(chest.prizes);
                            PBZDialogs.dialogChestYouWin.chestId = chestId;
                            PBZDialogs.dialogChestYouWin.showDialog();
                            PageController.redraw();
                        }
                    }
                }
            });
            chestsEls[coord.number] = el;
        });

        elFriendsPanel = GUI.createElement(ElementFriendsPanel, {x: 213, y: 450 - 15});
        self.elements.push(elFriendsPanel);

        el = GUI.createElement(ElementButton, {
            x: 165, y: 438, srcRest: 'button-add-rest.png',
            onClick: function () {
                SocNet.openInviteFriendDialog();
            }
        });
        self.elements.push(el);

        el = GUI.createElement(ElementImage, {x: 650, y: 370, opacity: 0.7, src: 'wind-rose.png'});
        self.elements.push(el);

        //@todo preloader
        domLoader = GUI.createDom(undefined, {x: 0, y: 0, backgroundImage: 'not-found.png'});
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
        self.preset();
        self.redraw();
    };

    /**
     * Спрачем все элементы на странице.
     */
    this.hide = function () {
        if (showed === false) return;
        showed = false;
        for (let i in self.elements) {
            self.elements[i].hide();
        }
        this.mapElsHide();
        elArrowPrev.hide();
    };

    /**
     * Настройка перед отрисовкой.
     */
    this.preset = function () {
        let nextPointId, firstPointId, lastPointId;
        this.presetPoints();
        this.presetChests();
        /** Set hint arrow */
        nextPointId = LogicUser.getCurrent().nextPointId;
        firstPointId = DataMap.getFirstPointId();
        lastPointId = DataMap.getLastPointId();
        if (nextPointId >= firstPointId && nextPointId <= lastPointId) {
            let p = DataPoints.getPointsCoords()[DataMap.getNumberFromPointId(nextPointId) - 1];
            elArrowHint.src = 'hint-arrow.png';
            elArrowHint.p = p;
            elArrowHint.show();
        } else {
            if (nextPointId > lastPointId) {
                elArrowHint.show();
                elArrowHint.p = pArrowNext;
                elArrowHint.src = 'map-arrow-right-rest.png';
            } else {
                elArrowHint.hide();
            }
        }
    };

    this.redraw = function () {
        if (!showed) return;
        if (isWaiting()) return;

        self.preset();
        elFriendsPanel.setFriends(LogicUser.getList(LogicUser.getFriendIds(6)));
        elFriendsPanel.redraw();
        this.mapElsRedraw();

        self.elements.forEach(function (element) {
            element.redraw();
        });

        elArrowPrev.redraw();
    };

    this.mapElsCreateIfNotExits = function () {
        let data, element;
        data = DataMap.getCurrent();
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
        data = DataMap.getCurrent();
        if (!data) return;

        for (let i in elMapElements[data.id]) {
            elMapElements[data.id][i].show();
        }
        if (mapIdOld !== data.id) {

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
        map = DataMap.getCurrent();
        if (!map) return;

        elMap.src = map.src;
        //   elMap.redraw();

        if (mapIdOld !== map.id) {
            this.mapElsShow();
        }

        for (let i in elMapElements[map.id]) {
            //        elMapElements[map.id][i].redraw();
        }
    };

    /**
     * Обновление данных перед отрисовкой точек
     */
    this.presetPoints = function () {
        let user, pointId, point, elPoint, userPoint, map;
        user = LogicUser.getCurrent();
        map = DataMap.getCurrent();
        if (!map) return;
        userPoint = DataPoints.getPointUserScore(map.id, [user.id]);

        // DataPoints
        for (let number = 1; number <= DataMap.POINTS_PER_MAP; number++) {
            pointId = DataMap.getPointIdFromPointNumber(number);
            elPoint = pointsEls[number];
            elPoint.pointId = pointId;
            point = DataPoints.getById(pointId);

            if (!point) continue;

            elPoint = pointsEls[number];

            if (point.id === user.nextPointId) elPoint.stateId = ElementPoint.STATE_CURRENT;
            if (point.id < user.nextPointId) elPoint.stateId = ElementPoint.STATE_FINISHED;
            if (point.id > user.nextPointId) elPoint.stateId = ElementPoint.STATE_CLOSE;

            if (userPoint[pointId])
                elPoint.userScore = userPoint[pointId][user.id] ? userPoint[pointId][user.id].score : 0;
            else
                elPoint.userScore = 0;

            //console.log(elPoint);

            elPoint.setGamers(
                LogicUser.getFriendIdsByMapIdAndPointIdWithScore(
                    DataMap.getCurrent().id,
                    pointId,
                    true)
            );
        }
    };

    /**
     * Обновление данных перед отрисовкой сундуков
     */
    this.presetChests = function () {
        let chestId, chest, chestEl, map;
        map = DataMap.getCurrent();
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

        map = DataMap.getCurrent();
        fids = LogicUser.getFriendIds(6);
        if (map) mfids = LogicUser.getFriendIdsByMapId(map.id);
        if (fids) flist = LogicUser.getList(fids);
        if (mfids) mflist = LogicUser.getList(mfids);

        if (!map) waiting = true;
        //if (!fids) waiting = true;
        //if (!mfids) waiting = true;
        if (fids && fids.length !== flist.length) waiting = true;
        if (mfids && mfids.length !== mflist.length) waiting = true;
        // if (waiting) {
        //     Logs.log('PageBlockMaps::Waiting data');
        // } else {
        //     Logs.log('PageBlockMaps::No Wating');
        // }
        if (waiting) {
            domLoader.show();
        } else {
            domLoader.hide();
        }
        return waiting;
    }
};

/**
 *
 * @type {PageBlockMaps}
 */
PageBlockMaps = new PageBlockMaps;