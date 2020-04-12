/**
 * Элемент панель целей.
 * @constructor
 */
ElementPanelItems = function () {
    let self = this;

    /**
     * Показывать ли элемент.
     * @type {boolean}
     */
    let showed = false;

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


    this.items = [];

    let elPanel1;
    let elPanel2;
    let elPanel3;

    let imagesEls = {};

    let countersEls = {};

    let elTitle;

    this.title = '';

    /**
     * Создадим дом и настроем его.
     */
    this.init = function () {
        let el;
        elPanel1 = GUI.createElement(ElementImage, {x: self.x, y: self.y, src: '/images/panel-goals-1.png'});
        elPanel2 = GUI.createElement(ElementImage, {x: self.x, y: self.y, src: '/images/panel-goals-2.png'});
        elPanel3 = GUI.createElement(ElementImage, {x: self.x, y: self.y, src: '/images/panel-goals-3.png'});
        /** Текст : заголовок */
        elTitle = GUI.createElement(ElementText, {x: self.x + 15, y: self.y + 10, width: 80, text: self.title, fontSize: self.fontSize});

        for (let id in DataPoints.objectImages) {
            el = GUI.createElement(ElementImage, {width: 50, height: 50, src: DataPoints.objectImages[id]});
            imagesEls[id] = el;
            el = GUI.createElement(ElementText, {width: DataPoints.BLOCK_WIDTH, alignRight: true});
            countersEls[id] = el;
        }
    };

    /**
     * Покажем картинку.
     */
    this.show = function () {
        if (showed) return;
        showed = true;
        for (let i in imagesEls) {
            imagesEls[i].show();
        }
        for (let i in countersEls) {
            countersEls[i].show();
        }
        elTitle.show();
    };

    /**
     * Спрячем картинку.
     */
    this.hide = function () {
        if (!showed) return;
        showed = false;
        for (let i in imagesEls) {
            imagesEls[i].hide();
        }
        for (let i in countersEls) {
            countersEls[i].hide();
        }
        elTitle.hide();

        elPanel1.hide();
        elPanel2.hide();
        elPanel3.hide();
    };

    /**
     * Перерисуем картинку.
     */
    this.redraw = function () {
        if (!showed) return;
        /** Items indication */
        for (let i in imagesEls) {
            imagesEls[i].hide();
        }
        for (let i in countersEls) {
            countersEls[i].hide();
        }

        elPanel1.hide();
        elPanel2.hide();
        elPanel3.hide();

        switch (self.items.length) {
            case 3:
                elPanel3.show();
                break;
            case 2:
                elPanel2.show();
                break;
            case 1:
                elPanel1.show();
                break;
        }

        elPanel1.redraw();
        elPanel2.redraw();
        elPanel3.redraw();
        let offsetY;
        offsetY = 0;

        self.items.forEach(function (item) {
            imagesEls[item.id].x = self.x + 20;
            imagesEls[item.id].y = self.y + 50 + offsetY;
            imagesEls[item.id].show();

            countersEls[item.id].x = self.x + 2 + DataPoints.BLOCK_WIDTH;
            countersEls[item.id].y = self.y + 50 + DataPoints.BLOCK_HEIGHT / 2 - 10 + offsetY;
            countersEls[item.id].setText(item.count);
            countersEls[item.id].show();

            offsetY += DataPoints.BLOCK_HEIGHT + 5;
        });
    };
};