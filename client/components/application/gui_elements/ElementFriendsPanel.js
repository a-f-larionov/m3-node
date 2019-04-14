/**
 * Элемент панель друзей.
 * @constructor
 */
ElementFriendsPanel = function () {
    var self = this;

    /**
     * Показывать ли элемент.
     * @type {boolean}
     */
    var showed = false;

    /**
     * Координата X панели.
     * @type {number}
     */
    this.x = 0;

    /**
     * Координата Y панели.
     * @type {number}
     */
    this.y = 0;

    this.cardWidth = 100;

    this.cardHeight = 100;

    this.cardsCount = 5;

    let friends = [];

    /**
     * Дом картинки.
     * @type {GUIDom}
     */
    let panelDom = null;

    /**
     *
     * @type GUIDom[]
     */
    let cardsDom = [];

    /**
     * Создадим дом и настроем его.
     */
    this.init = function () {
        panelDom = GUI.createDom();
        for (let i = 0; i < self.cardsCount; i++) {
            cardsDom.push(GUI.createDom());
        }
    };

    /**
     * Покажем картинку.
     */
    this.show = function () {
        if (showed) return;
        showed = true;
        panelDom.show();
        cardsDom.forEach(function (card) {
            card.show();
        });
        self.redraw();
    };

    /**
     * Спрячем картинку.
     */
    this.hide = function () {
        if (!showed) return;
        showed = false;
        panelDom.hide();
        cardsDom.forEach(function (card) {
            card.hide();
        });
    };

    /**
     * @param newData {Object}[]
     */
    this.setFriends = function (newData) {
        friends = newData;
    };

    /**
     * Перерисуем картинку.
     */
    this.redraw = function () {
        if (!showed) return;

        panelDom.x = self.x;
        panelDom.y = self.y;
        panelDom.height = self.cardHeight;
        panelDom.width = self.cardWidth * self.cardsCount;
        panelDom.redraw();

        cardsDom.forEach(function (card, i) {
            card.x = self.x + i * self.cardWidth;
            card.y = self.y;
            card.height = self.cardHeight;
            card.width = self.cardWidth;
            if (friends[i] && friends[i].photo100) {
                card.backgroundImage = friends[i].photo100;
            } else {
                card.width = 50;
                card.backgroundImage = '/images/man-01.png';
            }
            card.redraw();
        });
    };
};