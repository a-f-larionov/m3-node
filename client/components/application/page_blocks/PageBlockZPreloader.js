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
        /**
         * 1- Загрузка текст
         */
        elPreloader = GUI.createElement(ElementImage,
            {x: 0, y: 0, width: 778, height: 500, src: 'oblojka.png'}
        );
        elPreloader.show();
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
        elPreloader.redraw();
    };

    this.onLoaded = function () {
        elPreloader.hide();
    };
};

PageBlockZPreloader = new PageBlockZPreloader();