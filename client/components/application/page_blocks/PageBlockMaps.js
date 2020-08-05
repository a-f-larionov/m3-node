/**
 * Основной блок страницы игры.
 * @type {PageBlockMaps}
 * @constructor
 */
let PageBlockMaps = function PageBlockMaps() {
    let self = this;

    /**
     * Показывать ли страницу.
     * @type {boolean}
     */
    let showed = false;

    let pArrowNext = {x: 714, y: 500 / 2 - 50 / 2};

    let elArrowPrev = false;

    let elArrowNext = false;

    let elMap = false;

    let elMapWay = false;

    let elOldPaper = false;

    /**
     * @type {ElementFriendsPanel}
     */
    let elFriendsPanel;

    let domLoader = null;

    /**
     * @type ElementPoint[]
     */
    let pointsEls = [];

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

        elMapWay = GUI.createElement(ElementImage, {x: 0, y: 0, width: 778, height: 500, src: 'way-line.png'});
        self.elements.push(elMapWay);

        elMap = GUI.createElement(ElementImage, {x: 0, y: 0, width: 778, height: 500, src: 'map-001.png'});
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
            el = GUI.createElement(ElementPoint, {
                x: coords.x, y: coords.y,
                friends: [],
                stateId: ElementPoint.STATE_CLOSE,
                number: null,
                pointId: null,
                onClick: function (event, dom, element) {
                    PBZDialogs.dialogPointInfo.showDialog(element.pointId, null, false);
                }
            });
            self.elements.push(el);
            pointsEls[coords.number] = el;
        });


        el = GUI.createElement(ElementChest, {x: 162, y: 304, number: 1});
        self.elements.push(el);
        el = GUI.createElement(ElementChest, {x: 309, y: 78, number: 2});
        self.elements.push(el);
        el = GUI.createElement(ElementChest, {x: 495, y: 304, number: 3});
        self.elements.push(el);

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
        elArrowPrev.hide();
    };

    /**
     * Настройка перед отрисовкой.
     */
    this.preset = function (data) {
        let nextPointId, firstPointId, lastPointId;
        this.presetPoints(data);
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
        let data;
        if (!showed) return;
        data = fetchData();
        if (!data) return;


        elMap.src = data.map.src;
        self.preset(data);
        //@todo got friends top + users top for panel
        /**
         * взять
         * SAPIUser.sendMeTopUsers(fids);
         * CAPIUser.updateTopUsers(info);
         * LogicUser.getTopUsers();
         *  select * FROM users
         */
        elFriendsPanel.setFriends(data.tUsers);
        elFriendsPanel.redraw();

        self.elements.forEach(function (element) {
            element.redraw();
        });

        elArrowPrev.redraw();
    };

    /**
     * Обновление данных перед отрисовкой точек
     */
    this.presetPoints = function (data) {
        let user, pointId, point, elPoint, userPUS, map;
        user = LogicUser.getCurrent();
        map = DataMap.getCurrent();
        if (!map) return;
        //???@todo
        // for current all scores on this map
        userPUS = DataPoints.getPointUserScore(map.id, [user.id]);

        let ids = LogicUser.getMapFriendIds(map.id);
        let mapFriends = ids ? LogicUser.getList(ids) : [];

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

            if (userPUS[pointId])
                elPoint.userScore = userPUS[pointId][user.id] ? userPUS[pointId][user.id] : 0;
            else
                elPoint.userScore = 0;

            elPoint.setGamers(
                mapFriends.filter(function (user) {
                    return user.photo50 && user.nextPointId === pointId
                })
            );
        }
    };

    let fetchData = function () {
        let out;
        out = {};
        out.map = DataMap.getCurrent();
        out.tUsers = LogicUser.getTopUsers();

        if (!out.tUsers) out.tUsers = [];
        if (!(out.map)) out = null;

        return out;
    }
};

/**
 *
 * @type {PageBlockMaps}
 */
PageBlockMaps = new PageBlockMaps;