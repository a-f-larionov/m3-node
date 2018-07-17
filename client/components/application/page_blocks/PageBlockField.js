/**
 * Страница с игровым полем
 * @constructor
 */
PageBlockField = function PageBlockField() {
    var self = this;

    /**
     * Показывать ли страницу.
     * @type {boolean}
     */
    var showed = false;

    var elementField = null;
    /**
     * Массив всех элементов страницы.
     * @type {Array}
     */
    this.elements = [];

    /**
     * Создадим тут все элементы страницы.
     */
    this.init = function () {
        let element;

        element = GUI.createElement(ElementField, {
            x: 250,
            y: 100,
        });
        elementField = element;
        this.elements.push(element);

        // close
        element = GUI.createElement(ElementButton, {
            x: 10,
            y: 10,
            srcRest: '/images/field-red.png',
            srcHover: '/images/field-green.png',
            srcActive: '/images/field-blue.png',
            onClick: function () {
                PageController.showPage(PageMain);
            }
        });
        this.elements.push(element);

        // fall
        element = GUI.createElement(ElementButton, {
            x: 100,
            y: 10,
            srcRest: '/images/field-red.png',
            srcHover: '/images/field-green.png',
            srcActive: '/images/field-blue.png',
            onClick: function () {
                elementField.fallDown();
            }
        });
        this.elements.push(element);
    };

    /**
     * Покажем все элементы на странице.
     */
    this.show = function () {
        if (showed === true) return;
        showed = true;
        for (var i in self.elements) {
            self.elements[i].show();
        }
        this.loadField();
        this.firstShow();
    };

    /**
     * Спрачем все элементы на странице.
     */
    this.hide = function () {
        if (showed === false) return;
        showed = false;
        for (var i in self.elements) {
            self.elements[i].hide();
        }
    };

    /**
     * Настройка перед отрисовкой.
     */
    this.preset = function () {

    };

    this.loadField = function () {
        let data;
        data = DataPoints.getById(DataPoints.getCurrentPointId());
        elementField.setField(data.field);
    };

    this.firstShow = function () {

        // run fall down
        elementField.fallDown();
    };

    /**
     *
     */
    this.redraw = function () {
        if (!showed)return;
        self.preset();
        for (var i in self.elements) {
            self.elements[i].redraw();
        }
    };
};

PageBlockField = new PageBlockField;