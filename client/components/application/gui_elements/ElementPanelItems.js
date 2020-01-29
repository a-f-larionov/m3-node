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

    let itemsImagesEls = {};

    let itemsCountersEls = {};

    let elTitle;

    this.title = '';

    /**
     * Создадим дом и настроем его.
     */
    this.init = function () {
        let el;
        elPanel1 = GUI.createElement(ElementImage, {
            x: self.x, y: self.y, src: '/images/panel-goals-1.png'
        });
        elPanel2 = GUI.createElement(ElementImage, {
            x: self.x, y: self.y, src: '/images/panel-goals-2.png'
        });
        elPanel3 = GUI.createElement(ElementImage, {
            x: self.x, y: self.y, src: '/images/panel-goals-3.png'
        });
        // текст : заголовок
        elTitle = GUI.createElement(ElementText, {
            x: self.x + 15, y: self.y + 10, width: 80, text: self.title
        });

        for (let id in DataPoints.objectImages) {
            el = GUI.createElement(ElementImage, {
                width: 50, height: 50,
                src: DataPoints.objectImages[id]
            });
            itemsImagesEls[id] = el;
            el = GUI.createElement(ElementText, {
                width: DataPoints.BLOCK_WIDTH,
                alignCenter: true
            });
            itemsCountersEls[id] = el;
        }
    };

    /**
     * Покажем картинку.
     */
    this.show = function () {
        if (showed) return;
        showed = true;
        for (let i in itemsImagesEls) {
            itemsImagesEls[i].show();
        }
        for (let i in itemsCountersEls) {
            itemsCountersEls[i].show();
        }
        elTitle.show();
    };

    /**
     * Спрячем картинку.
     */
    this.hide = function () {
        if (!showed) return;
        showed = false;
        for (let i in itemsImagesEls) {
            itemsImagesEls[i].hide();
        }
        for (let i in itemsCountersEls) {
            itemsCountersEls[i].hide();
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
        // items indication
        for (let i in itemsImagesEls) {
            itemsImagesEls[i].hide();
        }
        for (let i in itemsCountersEls) {
            itemsCountersEls[i].hide();
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

        for (let i in self.items) {

            itemsImagesEls[self.items[i].id].x = self.x + 20;
            itemsImagesEls[self.items[i].id].y = self.y + 50 + offsetY;
            itemsImagesEls[self.items[i].id].show();

            itemsCountersEls[self.items[i].id].x = self.x + 2 + DataPoints.BLOCK_WIDTH;
            itemsCountersEls[self.items[i].id].y = self.y + 50 + DataPoints.BLOCK_HEIGHT / 2 - 10 + offsetY;
            itemsCountersEls[self.items[i].id].setText(self.items[i].count);
            itemsCountersEls[self.items[i].id].show();

            offsetY += DataPoints.BLOCK_HEIGHT + 5;
        }
    };
};