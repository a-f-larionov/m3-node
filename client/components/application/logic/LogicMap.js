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
        let data;
        /**
         * -проверить активность?
         * - данные для этой точки:
         * - открыть игру для данной точки
         */
        if (element.stateId == ElementPoint.STATE_CLOSE) return;
        data = DataPoints.getById(element.pointId);
        //*todo**/
        PageController.showPage(PageField);
    };
};

/**
 * Статичный класс.
 * @type {LogicMap}
 */
LogicMap = new LogicMap();
