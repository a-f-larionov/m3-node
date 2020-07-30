/**
 * Элемент фото пользователя и очки
 * @constructor
 */
let ElementUserScorePhoto = function () {
    let self = this;

    /**
     * Показывать ли элемент.
     * @type {boolean}
     */
    let showed = false;

    /**
     * Координата X картинки.
     * @type {number}
     */
    this.x = 0;

    /**
     * Координата Y картинки.
     * @type {number}
     */
    this.y = 0;

    this.user = null;
    this.score = null;

    let elPhoto;
    let elTextScore;
    let elTextName;

    /**
     * Создадим дом и настроем его.
     */
    this.init = function () {
        elTextName = GUI.createElement(ElementText, {
            x: self.x - 25, y: self.y - 22, width: 100, height: 15,
            fontSize: 12, alignCenter: true
        });
        elPhoto = GUI.createElement(ElementImage, {
            x: self.x, y: self.y, width: 50, height: 50,
            photoBorder: true
        });
        elPhoto.dom.pointer = GUI.POINTER_HAND;
        GUI.bind(elPhoto.dom, GUI.EVENT_MOUSE_CLICK, self.onClick, self);
        elTextScore = GUI.createElement(ElementText, {
            x: self.x - 25, y: self.y + 61, width: 100, height: 15,
            fontSize: 12, alignCenter: true
        });
    };

    /**
     * Покажем картинку.
     */
    this.show = function () {
        if (showed === true) return;
        showed = true;
        elTextName.show();
        elPhoto.show();
        elTextScore.show();
        self.redraw();
    };

    /**
     * Спрячем картинку.
     */
    this.hide = function () {
        if (showed === false) return;
        showed = false;
        elTextName.hide();
        elPhoto.hide();
        elTextScore.hide();
    };

    /**
     * Перерисуем картинку.
     */
    this.redraw = function () {
        if (!showed) return;

        if (!this.user || !this.user.id) {
            elTextScore.hide();
            elTextName.hide();
            elPhoto.src = 'button-add-rest.png';
        } else {
            elTextName.text = this.user.firstName;
            elPhoto.src = this.user.photo50;
            elTextScore.text = this.score ? this.score.toString() : 0;
            elTextScore.show();
            elTextName.show();
        }

        elTextName.redraw();
        elPhoto.redraw();
        elTextScore.redraw();
    };

    this.onClick = function () {
        if (self.user) {
            window.open(SocNet.getUserProfileUrl(self.user.socNetUserId));
        } else {
            SocNet.openInviteFriendDialog();
        }
    }
};