ElementDialogTurnLoose = function () {
    let self = this;
    this.__proto__ = new ElementDialog();

    this.init = function () {
        this.__proto__.init.call(this);
        let element;

        element = GUI.createElement(ElementButton, {
                x: 270,
                y: 10,
                srcRest: '/images/button-close-rest.png',
                srcHover: '/images/button-close-hover.png',
                srcActive: '/images/button-close-active.png',
                onClick: function () {
                    self.closeDialog();
                    PageController.showPage(PageMain);
                }
            }, this.dom
        );

        self.elements.push(element);

        element = GUI.createElement(ElementText, {
            x: 50,
            y: 100,
            fontSize: 36,
            bold: true,
            alignCenter: true,
            width: 250
        }, this.dom);
        element.setText("Хода закончились, вы проиграли!");
        self.elements.push(element);
    };

    this.show = function () {
        this.__proto__.show.call(this);
    };

    this.hide = function () {
        this.__proto__.hide.call(this);
    };

    this.redraw = function () {
        this.__proto__.redraw.call(this);
    };
};