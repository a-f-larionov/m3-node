/**
 * @type {DialogPointInfo}
 * @constructor
 */
let DialogPointInfo = function () {
    let self = this;
    this.__proto__ = new Dialog();

    let elStarOne = null;
    let elStarTwo = null;
    let elStarThree = null;

    let friendsPanel = [];
    let elUserPhotoScore = null;

    let elButtonPlay = null;

    /**
     * Точка с которой нажали.
     * @type {null}
     */
    let pointId = null;
    let friends;

    this.init = function () {
        this.__proto__.init.call(this);
        GUI.pushParent(self.dom);

        /** Кол-во звёзд */
        elStarOne = GUI.createElement(ElementImage, {
            x: 100, y: 40, src: 'star-off-big.png'
        });
        elStarOne.show();
        elStarTwo = GUI.createElement(ElementImage, {
            x: 200, y: 40, src: 'star-off-big.png'
        });
        elStarTwo.show();
        elStarThree = GUI.createElement(ElementImage, {x: 300, y: 40, src: 'star-off-big.png'});
        elStarThree.show();

        [0, 1, 2].forEach(function (i) {
            friendsPanel[i] = {
                elPhotoScore: GUI.createElement(ElementUserScorePhoto, {x: 75 + 75 * i + 15, y: 155})
            }
        });

        elUserPhotoScore = GUI.createElement(ElementUserScorePhoto, {x: 75 + 75 * 3 + 55, y: 155});
        elUserPhotoScore.show();

        /** Кнопка играть */
        elButtonPlay = GUI.createElement(ElementButton, {
            x: 178, y: 240,
            srcRest: 'button-red-rest.png',
            srcHover: 'button-red-hover.png',
            srcActive: 'button-red-active.png',
            onClick: function () {
                self.closeDialog();
                /** Предложить купить жизни */
                if (LogicHealth.getHealths(LogicUser.getCurrent()) === 0) {
                    PBZDialogs.dialogHealthShop.showDialog();
                    self.showDialog(pointId);
                } else {
                    /** Начать игру */
                    SAPIUser.onStart();
                    PageBlockPanel.oneHealthHide = true;
                    DataPoints.setPlayedId(pointId);
                    PageController.showPage(PageField);
                }
            },
            title: 'ИГРАТЬ'
        });
        elButtonPlay.show();

        /** Кнопка закрыть */
        GUI.createElement(ElementButton, {
            x: 452, y: 3,
            srcRest: 'button-close-rest.png',
            onClick: function () {
                self.closeDialog();
            }
        }).show();

        GUI.popParent();
    };

    this.show = function () {
        this.__proto__.show.call(this);
    };

    this.hide = function () {
        this.__proto__.hide.call(this);
    };

    this.redraw = function () {
        let point, friend, score;
        this.__proto__.redraw.call(this);

        if (!this.dialogShowed) return;

        point = DataPoints.getById(pointId);
        this.setTitle('УРОВЕНЬ  ' + pointId);
//console.log('friends',friends);
        /**
         *
         */


        for (let i = 0; i < 3; i++) {
            if ((friend = friends[i]) && friend.id) {
                score = DataPoints.getScore(point.id, friend.id);
                friendsPanel[i].elPhotoScore.user = friend;
                friendsPanel[i].elPhotoScore.score = score;
                if (score) {
                    friendsPanel[i].elPhotoScore.show();
                    friendsPanel[i].elPhotoScore.redraw();
                } else {
                    friendsPanel[i].elPhotoScore.hide();
                }
            } else {
                friendsPanel[i].elPhotoScore.hide();
            }
        }
        elUserPhotoScore.user = LogicUser.getCurrent();
        elUserPhotoScore.score = DataPoints.getScore(point.id);

        elStarOne.src = 'star-off-big.png';
        elStarTwo.src = 'star-off-big.png';
        elStarThree.src = 'star-off-big.png';

        switch (DataPoints.countStars(point.id)) {
            case 3:
                elStarThree.src = 'star-on-big.png';
            case 2:
                elStarTwo.src = 'star-on-big.png';
            case 1:
                elStarOne.src = 'star-on-big.png';
        }
        elStarOne.redraw();
        elStarTwo.redraw();
        elStarThree.redraw();
        elUserPhotoScore.redraw();
    };

    this.showDialog = function (pId) {
        let mapId;
        pointId = pId;
        //@todo mapId from pointId
        mapId = DataMap.getCurrent().id;
        friends = LogicUser.getFriendIdsByMapIdAndPointIdWithScore(mapId, pId, false);
        this.__proto__.showDialog.call(this);
        self.redraw();
    }
};