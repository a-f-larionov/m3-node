/**
 * @type {DialogMessage}
 * @constructor
 */
let DialogMessage = function () {
    let self = this;
    this.__proto__ = new Dialog();

    let elMessage = null;

    this.init = function () {
        this.__proto__.init.call(this);

        GUI.pushParent(self.dom);

        elMessage = GUI.createElement(ElementText,
            {x: 45, y: 50, width: 410, height: 200}
        );

        self.elements.push(elMessage);

        GUI.popParent();
    };

    let linesY = {
        undefined: 150,
        1: 150,
        2: 140,
        3: 130,
        4: 120,
        5: 110,
    };
    this.showDialog = function (header, message, lines) {
        this.__proto__.showDialog.call(this);

        this.elHeader.setText(header);
        elMessage.y = linesY[lines];
        elMessage.setText(message);
        console.log(self.elements);
        console.log(self.redraw);
        self.redraw();
    };
};




