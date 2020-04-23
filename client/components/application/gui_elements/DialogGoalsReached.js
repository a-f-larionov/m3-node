let DialogGoalsReached = function () {
    let self = this;
    this.__proto__ = new Dialog();

    /**
     * Номер точки
     * @type {null}
     */
    let elTitle = null;

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

        /** Номер точки\заголовок */
        elTitle = GUI.createElement(ElementText, {x: 135, y: 12, width: 230, height: 40, text: ''});
        elTitle.show();

        /** Кол-во звёзд */
        elStarOne = GUI.createElement(ElementImage, {x: 100, y: 40, src: 'star-off-big.png'});
        elStarOne.show();
        elStarTwo = GUI.createElement(ElementImage, {x: 200, y: 40, src: 'star-off-big.png'});
        elStarTwo.show();
        elStarThree = GUI.createElement(ElementImage, {x: 300, y: 40, src: 'star-off-big.png'});
        elStarThree.show();

        for (let i = 0; i < 3; i++) {
            friendsPanel[i] = {
                elPhotoScore: GUI.createElement(ElementUserScorePhoto, {x: 75 + 75 * i + 15, y: 155}),
            }
        }

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
                //PageBlockPanel.oneHealthHide = false;
                PageController.showPage(PageMain);
            },
            title: 'НА КАРТУ'
        });
        elButtonPlay.show();

        // Кнопка закрыть
        GUI.createElement(ElementButton, {
            x: 452, y: 3,
            srcRest: 'button-close-rest.png',
            srcHover: 'button-close-hover.png',
            srcActive: 'button-close-active.png',
            onClick: function () {
                self.closeDialog();
                PageController.showPage(PageMain);
            }
        }).show();

        GUI.popParent();
    };


    this.redraw = function () {
        let user, point, friend, score;
        this.__proto__.redraw.call(this);

        if (!this.dialogShowed) return;

        user = LogicUser.getCurrentUser();
        point = DataPoints.getById(pointId);
        elTitle.text = 'ПРОЙДЕН ' + pointId;

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
        elUserPhotoScore.user = LogicUser.getCurrentUser();
        elUserPhotoScore.score = DataPoints.getScore(point.id);

        elTitle.redraw();
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

        if (LogicHealth.getHealths(user) === 0) {
            elButtonPlay.hide();
        } else {
            elButtonPlay.show();
        }
    };

    this.showDialog = function (pId) {
        let mapId;
        pointId = pId;
        /** @todo mapId from pointId */
        mapId = DataMap.getCurent().id;
        friends = LogicUser.getFriendIdsByMapIdAndPointIdWithScore(mapId, pId);
        this.__proto__.showDialog.call(this);
        self.redraw();
    }
};