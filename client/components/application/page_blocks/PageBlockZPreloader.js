/**
 * Основной блок страницы игры.
 * @type {PageBlockZPreloader}
 * @constructor
 */
let PageBlockZPreloader = function PageBlockZPreloader() {
    let self = this;

    let elPreloader = false;

    let showed = true;

    this.init = function () {

    };

    this.show = function () {
        if (showed === true) return;
        showed = true;
        self.redraw();
    };

    /**
     * Спрачем все элементы на странице.
     */
    this.hide = function () {
        if (showed === false) return;
        showed = false;
    };

    this.isLoaded = function () {
        let isLoaded;

        isLoaded = true;
        isLoaded &= !!LogicUser.getCurrent();
        isLoaded &= !!DataMap.getCurrent();
        isLoaded &= !!LogicUser.getTopUsers();
        isLoaded &= !!(DataMap.getCurrent() &&
            LogicUser.getMapFriendIds(DataMap.getCurrent().id)
        );
        return isLoaded;
    };

    this.redraw = function () {
    };

    this.onLoaded = function () {
        let el = document.getElementById('img');
        if (el) el.remove();
    };
};

PageBlockZPreloader = new PageBlockZPreloader();