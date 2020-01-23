ElementDialogPointInfo = function () {
    let self = this;
    this.__proto__ = new ElementDialog();

    /**
     * Номер точки
     * @type {null}
     */
    let elTextPointNumber = null;

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

        // номер точки\заголовок
        elTextPointNumber = GUI.createElement(ElementText, {
            x: 135, y: 12, width: 230, height: 40,
            text: ''
        });
        elTextPointNumber.show();

        // кол-во звёзд
        elStarOne = GUI.createElement(ElementImage, {
            x: 100, y: 40, src: '/images/star-off-big.png'
        });
        elStarOne.show();
        elStarTwo = GUI.createElement(ElementImage, {
            x: 200, y: 40, src: '/images/star-off-big.png'
        });
        elStarTwo.show();
        elStarThree = GUI.createElement(ElementImage, {
            x: 300, y: 40, src: '/images/star-off-big.png'
        });
        elStarThree.show();

        for (let i = 0; i < 3; i++) {
            friendsPanel[i] = {
                elPhotoScore: GUI.createElement(ElementUserScorePhoto, {
                    x: 75 + 75 * i, y: 155
                }),
            }
        }

        elUserPhotoScore = GUI.createElement(ElementUserScorePhoto, {
            x: 75 + 75 * 3 + 35, y: 155
        });
        elUserPhotoScore.show();

        // кнопка играть
        elButtonPlay = GUI.createElement(ElementButton, {
            x: 178, y: 240,
            srcRest: '/images/button-red-rest.png',
            srcHover: '/images/button-red-hover.png',
            srcActive: '/images/button-red-active.png',
            onClick: function () {
                self.reset();
                DataPoints.setPlayedId(pointId);
                PageController.showPage(PageField);
            },
            title: 'ИГРАТЬ'
        });
        elButtonPlay.show();

        // кнопка закрыть
        GUI.createElement(ElementButton, {
            x: 452, y: 3,
            srcRest: '/images/button-close-rest.png',
            srcHover: '/images/button-close-hover.png',
            srcActive: '/images/button-close-active.png',
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
        let user, point, friend;
        this.__proto__.redraw.call(this);

        if (!this.dialogShowed) return;

        user = LogicUser.getCurrentUser();
        point = DataPoints.getById(pointId);
        elTextPointNumber.text = 'УРОВЕНЬ  ' + pointId;

        for (let i = 0; i < 3; i++) {
            if (friends[0] && (friend = LogicUser.getById(friends[0])) && friend.id) {
                friendsPanel[i].elPhotoScore.user = friend;
                friendsPanel[i].elPhotoScore.score = DataPoints.getScore(point.id, friend.id);
                friendsPanel[i].elPhotoScore.show();
                friendsPanel[i].elPhotoScore.redraw();
            } else {
                friendsPanel[i].elPhotoScore.hide();
            }
        }
        elUserPhotoScore.user = LogicUser.getCurrentUser();
        elUserPhotoScore.score = DataPoints.getScore(point.id);

        elTextPointNumber.redraw();
        elStarOne.src = '/images/star-off-big.png';
        elStarTwo.src = '/images/star-off-big.png';
        elStarThree.src = '/images/star-off-big.png';

        switch (DataPoints.countStars(point.id)) {
            case 3:
                elStarThree.src = '/images/star-on-big.png';
            case 2:
                elStarTwo.src = '/images/star-on-big.png';
            case 1:
                elStarOne.src = '/images/star-on-big.png';
        }
        elStarOne.redraw();
        elStarTwo.redraw();
        elStarThree.redraw();
        elUserPhotoScore.redraw();

        if (user.health === 0) {
            elButtonPlay.hide();
        } else {
            elButtonPlay.show();
        }
    };

    this.showDialog = function (element) {
        pointId = element.pointId;
        friends = element.friends;
        this.__proto__.showDialog.call(this);
        self.redraw();
    }
};




