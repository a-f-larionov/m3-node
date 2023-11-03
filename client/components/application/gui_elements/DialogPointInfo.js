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

    let panel = [];
    let elUserPhotoScore = null;

    let elGeneralButton = null;

    /**
     * Точка с которой нажали.
     * @type {null}
     */
    let pointId = null;
    let friends;

    let isGoalsReached = false;

    let elShare = null;
    let elButtonShare = null;

    let share = true;
    let score = null;

    this.init = function () {
        this.__proto__.init.call(this);
        GUI.pushParent(self.dom);

        /** Кол-во звёзд */
        elStarOne = GUI.createElement(ElementImage, {x: 100, y: 40, src: 'star-off-big.png'});
        elStarOne.show();
        elStarTwo = GUI.createElement(ElementImage, {x: 200, y: 40, src: 'star-off-big.png'});
        elStarTwo.show();
        elStarThree = GUI.createElement(ElementImage, {x: 300, y: 40, src: 'star-off-big.png'});
        elStarThree.show();

        [0, 1, 2].forEach(function (i) {
            panel[i] = {
                elPhotoScore: GUI.createElement(ElementUserScorePhoto, {x: 75 + 75 * i + 15, y: 155})
            }
        });

        elUserPhotoScore = GUI.createElement(ElementUserScorePhoto, {x: 75 + 75 * 3 + 55, y: 155});
        elUserPhotoScore.show();

        /** Кнопка играть */
        elGeneralButton = GUI.createElement(ElementButton, {
            x: 178, y: 240,
            srcRest: 'button-red-rest.png',
            srcHover: 'button-red-hover.png',
            srcActive: 'button-red-active.png',
            title: true,
            onClick: function () {
                self.closeDialog();

                if (isGoalsReached) {
                    PageController.showPage(PageMain);
                } else {
                    /** Предложить купить жизни */
                    if (LogicHealth.getHealths(LogicUser.getCurrent()) === 0) {
                        PBZDialogs.dialogHealthShop.showDialog();
                        self.showDialog(pointId);
                    } else {
                        /** Начать игру */
                        //@todo ищи код ljklkjlkjkljkjlkjljlkjlk
                        SAPIUser.healthDown(pointId);
                        PageBlockPanel.oneHealthHide = true;
                        DataPoints.setPlayedId(pointId);

                        PageController.showPage(PageField);
                    }
                }
            }
        });
        elGeneralButton.show();

        /** Кнопка закрыть */
        GUI.createElement(ElementButton, {
            x: 452, y: 3,
            srcRest: 'button-close-rest.png',
            onClick: function () {
                self.closeDialog();
                if (isGoalsReached) {
                    PageController.showPage(PageMain);
                }
            }
        }).show();


        elButtonShare = GUI.createElement(ElementText, {x: 335, y: 254, text: 'ПОДЕЛИТЬСЯ', fontSize: 11});

        elShare = GUI.createElement(ElementButton, {
            x: 418, y: 242,
            srcRest: 'check-set.png',
            srcHover: 'check-clear.png',
            srcActive: 'check-clear.png',
        });
        elShare.onClick = function () {
            share = !share;
            PageController.redraw();
        };
        elShare.show();

        GUI.popParent();
    };

    this.redraw = function () {
        let point, friend, score;
        this.__proto__.redraw.call(this);

        if (!this.dialogShowed) return;

        let topScore = LogicUser.getPointTopScore(pointId);
        let user1, user2, user3;
        friends = [];
        if (topScore) {
            if (topScore.place1Uid) user1 = (LU.getById(topScore.place1Uid));
            if (topScore.place2Uid) user2 = (LU.getById(topScore.place2Uid));
            if (topScore.place3Uid) user3 = (LU.getById(topScore.place3Uid));

            if (user1) friends.push(user1);
            if (user2) friends.push(user2);
            if (user3) friends.push(user3);
        }

        point = DataPoints.getById(pointId);
        if (isGoalsReached) {
            this.setTitle('ПРОЙДЕН  ' + pointId);
        } else {
            this.setTitle('УРОВЕНЬ  ' + pointId);
        }

        /** @todo copy to DialogGoalds Reacehed*/
        for (let i = 0; i < 3; i++) {
            if ((friend = friends[i]) && friend.id) {
                score = DataPoints.getScore(point.id, friend.id);
                panel[i].elPhotoScore.user = friend;
                panel[i].elPhotoScore.score = score;
            } else {
                panel[i].elPhotoScore.score = 0;
                panel[i].elPhotoScore.user = null;
            }
            panel[i].elPhotoScore.show();
            panel[i].elPhotoScore.redraw();
        }

        elUserPhotoScore.user = LogicUser.getCurrent();
        elUserPhotoScore.score = 0 + DataPoints.getScore(point.id);

        elStarOne.src = 'star-off-big.png';
        elStarTwo.src = 'star-off-big.png';
        elStarThree.src = 'star-off-big.png';

        switch (DataPoints.countStars(point.id)) {
            case 3:
                elStarThree.src = 'star-on-big.png';
                break;
            case 2:
                elStarTwo.src = 'star-on-big.png';
                break;
            case 1:
                elStarOne.src = 'star-on-big.png';
                break;
        }
        elStarOne.redraw();
        elStarTwo.redraw();
        elStarThree.redraw();
        elUserPhotoScore.redraw();
        elGeneralButton.redraw();

        if (isGoalsReached) {
            let user;
            user = LogicUser.getCurrent();
            if (LogicHealth.getHealths(user) === 0) {
                elGeneralButton.hide();
            } else {
                elGeneralButton.show();
            }

            elShare.srcRest = share ? 'check-set.png' : 'check-clear.png';
            elShare.srcHover = share ? 'check-clear.png' : 'check-set.png';
            elShare.srcActive = elShare.srcHover;
            elShare.redraw();
        }
    };

    this.showDialog = function (pId, scoreNew, isGoalsReachedValue) {
        window.jkl = this;
        console.log(this, this.x);
        pointId = pId;
        isGoalsReached = isGoalsReachedValue;
        LogicWizard.finish(false);
        this.__proto__.showDialog.call(this);

        if (isGoalsReachedValue) {
            share = true;
            score = scoreNew;
            elButtonShare.show();
            elShare.show();
            elGeneralButton.title = 'НА КАРТУ';
        } else {
            share = false;
            elButtonShare.hide();
            elShare.hide();
            elGeneralButton.title = 'ИГРАТЬ';
        }
        self.redraw();
    };

    this.closeDialog = function () {
        if (share) {
            SocNet.post({
                //@todo url app move to config
                userId: LogicUser.getCurrent().socNetUserId,
                message: 'Я набрал ' + score + " " +
                    declination(score, ['очко', 'очка', 'очков'])
                    + '! Ты сможешь обогнать меня? ' +
                    'https://vk.com/app' + Config.SocNet.VK.appId
            });
        }
        this.__proto__.closeDialog();
    };
};