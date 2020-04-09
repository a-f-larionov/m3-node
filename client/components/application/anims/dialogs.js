let animShowDialog = function () {
    let
        velocity = 15,
        startPosition = -500,
        endPosition = 80
    ;

    this.init = function () {
        this.noAnimLock = true;
    };

    this.iterate = function (counter) {
        this.dom.y += velocity;
        this.dom.redraw();
        return counter + 2 <= (endPosition - (startPosition)) / velocity;
    };

    this.finish = function () {

    };
};

let animHideDialog = function () {
    let
        velocity = 15,
        startPosition = 80,
        endPosition = -500
    ;

    this.init = function () {
        this.noAnimLock = true;
        startPosition = this.dom.y;
    };

    this.iterate = function (counter) {
        this.dom.y -= velocity;
        this.dom.redraw();
        return counter + 2 <= Math.abs((endPosition - (startPosition))) / velocity;
    };

    this.finish = function () {

    };
};