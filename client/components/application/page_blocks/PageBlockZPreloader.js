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
        elPreloader = GUI.createElement(ElementImage, {x: 0, y: 0, width: 778, height: 500, src: 'oblojka.png'});
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

    this.redraw = function () {
        let hidePreloader;

        hidePreloader = true;
        hidePreloader &= !!LogicUser.getCurrent();
        hidePreloader &= !!DataMap.getCurrent();
        hidePreloader &= !!LogicUser.getTopUsers();
        hidePreloader &= !!(DataMap.getCurrent() && LogicUser.getMapFriendIds(DataMap.getCurrent().id));

        if (hidePreloader) {
            console.log('hide');
            elPreloader.hide();
        } else {
            console.log('show');
            elPreloader.show();
            elPreloader.redraw();
        }
    }
};

PageBlockZPreloader = new PageBlockZPreloader();