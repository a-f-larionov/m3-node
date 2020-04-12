let animShowDialog = function () {
    let
        velocity = 20,
        startPosition = -500,
        endPosition = 70
    ;

    this.init = function (bottomPosition) {
        endPosition = bottomPosition;
        this.skipAnimLock = true;
    };

    this.iterate = function (counter) {
        this.dom.y += velocity;
        this.dom.redraw();
        return counter + 2 <= (endPosition - (startPosition)) / velocity;
    };

    this.finish = function () {
        this.dom.y = endPosition;
        this.dom.redraw();
    };
};

let animHideDialog = function () {
    let
        velocity = 20,
        startPosition = 70,
        endPosition = -500
    ;

    this.init = function (bottomPosition) {
        startPosition = bottomPosition;
        this.skipAnimLock = true;
        startPosition = this.dom.y;
    };

    this.iterate = function (counter) {
        this.dom.y -= velocity;
        this.dom.redraw();
        return counter + 2 <= Math.abs((endPosition - (startPosition))) / velocity;
    };

    this.finish = function () {
        this.dom.y = endPosition;
        this.dom.redraw();
    };
};