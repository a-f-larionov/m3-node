let DialogJustQuit = function () {
    let self = this;
    this.__proto__ = new Dialog();

    this.init = function () {
        this.__proto__.init.call(this);
        let element;

        this.setTitle("ВЫЙТИ?");

        /** Надпись в центре */
        element = GUI.createElement(ElementText, {
            x: 127, y: 114, width: 250,
            bold: true, alignCenter: true,
        }, this.dom);
        element.setText("Потеряешь одну жизнь.");
        self.elements.push(element);

        /** Кнопка выйти */
        element = GUI.createElement(ElementButton, {
                x: 75, y: 220,
                srcRest: 'button-red-rest.png',
                srcHover: 'button-red-hover.png',
                srcActive: 'button-red-active.png',
                onClick: function () {
                    self.closeDialog();
                    PageBlockPanel.oneHealthHide = false;
                    PageController.showPage(PageMain);
                    PageBlockField.setStuffMode(null);
                },
                title: 'СДАТЬСЯ'
            }, this.dom,
        );
        self.elements.push(element);

        /** Кнопка вернуться в игру */
        element = GUI.createElement(ElementButton, {
                x: 275, y: 220,
                srcRest: 'button-green-rest.png',
                srcHover: 'button-green-hover.png',
                srcActive: 'button-green-active.png',
                onClick: function () {
                    self.closeDialog();
                },
                title: 'ИГРАТЬ'
            }, this.dom
        );
        self.elements.push(element);
    };
};