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
        this.dom.y = startPosition + velocity * counter;
        this.dom.redraw();
        return this.dom.y < endPosition;
    };

    this.finish = function () {
        this.dom.y = endPosition;
        this.dom.redraw();
    };
};

let animHideDialog = function () {
    let
        velocity = -20,
        startPosition = 70,
        endPosition = -500
    ;

    this.init = function (bottomPosition) {
        startPosition = bottomPosition;
        this.skipAnimLock = true;
        startPosition = this.dom.y;
    };

    this.iterate = function (counter) {
        this.dom.y = startPosition + velocity * counter;
        this.dom.redraw();
        return this.dom.y > endPosition;
    };

    this.finish = function () {
        this.dom.y = endPosition;
        this.dom.redraw();
    };
};