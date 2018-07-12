LogicMap = function () {
    var self = this;

    this.onArrowPrevClick = function () {
        DataMap.setPrevMap();
        PageController.redraw();
    };

    this.onArrowNextClick = function () {
        DataMap.setNextMap();
        PageController.redraw();
    };

    this.onPointClick = function (event, dom, element) {
        if (element.stateId == ElementPoint.STATE_CLOSE) return;
        DataPoints.setCurrentPointId(element.pointId);
        PageController.showPage(PageField);
    };
};

/**
 * Статичный класс.
 * @type {LogicMap}
 */
LogicMap = new LogicMap();
