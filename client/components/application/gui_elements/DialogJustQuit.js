DialogJustQuit = function () {
    let self = this;
    self.__name = "DialogJustQuit";
    this.__proto__ = new Dialog();

    this.init = function () {
        this.__proto__.init.call(this);
        let element;

        // заголовок
        element = GUI.createElement(ElementText, {
            x: 150, y: 12, width: 200,
            //   fontSize: 24,
            bold: true,
            alignCenter: true,
        }, this.dom);
        element.setText("ВЫЙТИ?");
        self.elements.push(element);

        /** надпись в центре */
        element = GUI.createElement(ElementText, {
            x: 127, y: 114, width: 250,
            //  fontSize: 24,
            bold: true,
            alignCenter: true,
        }, this.dom);
        element.setText("Потеряешь одну жизнь.");
        self.elements.push(element);

        /** кнопка выйти */
        element = GUI.createElement(ElementButton, {
                x: 75, y: 220,
                srcRest: '/images/button-red-rest.png',
                srcHover: '/images/button-red-hover.png',
                srcActive: '/images/button-red-active.png',
                onClick: function () {
                    //LogicUser.onTurnsLoose();
                    self.closeDialog();
                    PageController.showPage(PageMain);
                },
                title: 'НА КАРТУ'
            }, this.dom,
        );
        self.elements.push(element);

        /** Кнопка вернуться в игру */
        element = GUI.createElement(ElementButton, {
                x: 275, y: 220,
                srcRest: '/images/button-green-rest.png',
                srcHover: '/images/button-green-hover.png',
                srcActive: '/images/button-green-active.png',
                onClick: function () {
                    self.closeDialog();
                },
                title: 'ИГРАТЬ'
            }, this.dom
        );
        self.elements.push(element);

        /** Кнопка закрыть */
        element = GUI.createElement(ElementButton, {
                x: 452, y: 3,
                srcRest: '/images/button-close-rest.png',
                srcHover: '/images/button-close-hover.png',
                srcActive: '/images/button-close-active.png',
                onClick: function () {
                    self.closeDialog();
                }
            }, this.dom
        );
        self.elements.push(element);
    };
};