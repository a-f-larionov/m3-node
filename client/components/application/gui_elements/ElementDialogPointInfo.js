ElementDialogPointInfo = function () {
    let self = this;
    this.__proto__ = new ElementDialog();

    this.width = 500;
    this.height = 292;

    this.src = '/images/window.png';

    /**
     * Точка с которой нажали
     * @type {null}
     */
    //this.elementPoint = null;

    /**
     * Кол-во очков на точке
     * @type {null}
     */
    let elTextScore = null;

    /**
     * Номер точки
     * @type {null}
     */
    let elTextPointNumber = null;

    let elStarOne = null;
    let elStarTwo = null;
    let elStarThree = null;

    let elFriendsText = null;

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
        // кол-во очков на точке
        elTextScore = GUI.createElement(ElementText, {
            x: 250, y: 180, width: 250, height: 40,
            text: ''
        });
        elTextScore.show();

        // номер точки
        elTextPointNumber = GUI.createElement(ElementText, {
            x: 135, y: 11, width: 230, height: 40,
            text: ''
        });
        elTextPointNumber.show();
        // кол-во звёзд
        elStarOne = GUI.createElement(ElementImage, {
            x: 100, y: 80, src: '/images/star-off-big.png'
        });
        elStarOne.show();
        elStarTwo = GUI.createElement(ElementImage, {
            x: 200, y: 80, src: '/images/star-off-big.png'
        });
        elStarTwo.show();
        elStarThree = GUI.createElement(ElementImage, {
            x: 300, y: 80, src: '/images/star-off-big.png'
        });
        elStarThree.show();

        elFriendsText = GUI.createElement(ElementText, {
            x: 50, y: 180, width: 250, height: 40,
            fontSize: 12, text: ''
        });
        elFriendsText.show();

        // кнопка играть
        elButtonPlay = GUI.createElement(ElementButton, {
            x: 50, y: 130,
            srcRest: '/images/button-play-rest.png',
            srcHover: '/images/button-play-hover.png',
            srcActive: '/images/button-play-active.png',
            onClick: function () {
                self.reset();
                DataPoints.setPlayedId(pointId);
                PageController.showPage(PageField);
            }
        });
        elButtonPlay.show();

        // кнопка закрыть
        GUI.createElement(ElementButton, {
            x: 447, y: 4,
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
        let user, point;
        this.__proto__.redraw.call(this);

        if (!this.dialogShowed) return;

        user = LogicUser.getCurrentUser();
        point = DataPoints.getById(pointId);
        elTextPointNumber.text = 'УРОВЕНЬ  ' + pointId;
        //elTextStarsCount.text = 'ЗВЕЗД: ' + DataPoints.countStars(point.id);
        elTextScore.text = 'ОЧКОВ: ' + DataPoints.getScore(point.id);

        let text = '';
        friends.forEach(function (uid) {
            let user;
            user = LogicUser.getById(uid);
            text += user.firstName + ' ' + user.lastName + ' ';
            text += DataPoints.getScore(pointId, user.id);
            text += '<br>';
        });
        elFriendsText.text = text;

        elTextPointNumber.redraw();
        //elTextStarsCount.redraw();
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
        elTextScore.redraw();
        elFriendsText.redraw();
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




