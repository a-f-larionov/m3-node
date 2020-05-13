/**
 * @type {DialogGoalsReached}
 * @constructor
 */
let DialogGoalsReached = function () {
    let self = this;
    this.__proto__ = new Dialog();

    /**
     * Номер точки
     * @type {ElementText}
     */
    let elTitle = null;

    let elStarOne = null;
    let elStarTwo = null;
    let elStarThree = null;

    let friendsPanel = [];
    let elUserPhotoScore = null;

    let elButtonPlay = null;

    let elShare = null;

    let share = true;
    let score = null;

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
        elTitle = GUI.createElement(ElementText, {x: 135, y: 16, width: 230, height: 40, text: ''});
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
                PageController.showPage(PageMain);
            },
            title: 'НА КАРТУ'
        });
        elButtonPlay.show();

        /** Кнопка закрыть */
        GUI.createElement(ElementButton, {
            x: 452, y: 3,
            srcRest: 'button-close-rest.png',
            onClick: function () {
                self.closeDialog();
                PageController.showPage(PageMain);
            }
        }).show();

        GUI.createElement(ElementText, {x: 335, y: 254, text: 'ПОДЕЛИТЬСЯ', fontSize: 11}).show();

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
        let user, point, friend, score;
        this.__proto__.redraw.call(this);

        if (!this.dialogShowed) return;

        user = LogicUser.getCurrent();
        point = DataPoints.getById(pointId);
        elTitle.text = 'ПРОЙДЕН';// + pointId;

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

        elShare.srcRest = share ? 'check-set.png' : 'check-clear.png';
        elShare.srcHover = share ? 'check-clear.png' : 'check-set.png';
        elShare.srcActive = elShare.srcHover;
        elShare.redraw();
    };

    this.showDialog = function (pId, fieldScore) {
        let mapId;
        share = true;
        pointId = pId;
        /** @todo mapId from pointId */
        mapId = DataMap.getCurrent().id;
        friends = LogicUser.getFriendIdsByMapIdAndPointIdWithScore(mapId, pId);
        this.__proto__.showDialog.call(this);
        score = fieldScore;
        self.redraw();
    };

    /**
     * @todo
     * - Пост: Я набрал 82100 очков на 11 уровне. А сколько сможешь набрать ты?
     - Пост: Мой результат - 30500 очков на 13 уровне. Сможешь побить мой рекорд?
     * @type {string[]}
     */
    /*let phrases = [
        'Ты сможешь обогнать меня?',
        'Заходи в игру!',
        'Ты сможешь обогнать меня?',
    ];*/

    this.closeDialog = function () {
        if (share) {
            SocNet.post({
                //@todo url app move to config
                userId: LogicUser.getCurrent().socNetUserId,
                message: 'Я набрал ' + score + " " +
                    declination(score, ['очко', 'очка', 'очков'])
                    + '! Ты сможешь обогнать меня? ' +
                    'https://vk.com/app7389878'
            });
        }
        this.__proto__.closeDialog();
    };
};