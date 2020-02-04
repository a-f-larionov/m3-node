ElementDialogTurnLoose = function () {
    let self = this;
    this.__proto__ = new ElementDialog();

    /**
     * Номер точки
     * @type {null}
     */
    let elTitle;

    this.init = function () {
        this.__proto__.init.call(this);
        GUI.pushParent(self.dom);
        let el;

        el = GUI.createElement(ElementButton, {
                x: 452, y: 3,
                srcRest: '/images/button-close-rest.png',
                srcHover: '/images/button-close-hover.png',
                srcActive: '/images/button-close-active.png',
                onClick: function () {
                    self.closeDialog();
                    PageController.showPage(PageMain);
                }
            }
        );

        self.elements.push(el);

        el = GUI.createElement(ElementText, {
            x: 50, y: 100, fontSize: 24, bold: true, alignCenter: true,
            width: 400
        });
        el.setText("БОЛЬШЕ ХОДОВ НЕТ!");

        self.elements.push(el);

        // номер точки\заголовок
        elTitle = GUI.createElement(ElementText, {
            x: 135, y: 12, width: 230, height: 40, text: 'ПРОИГРЫШ'
        });
        elTitle.show();

        GUI.popParent();
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