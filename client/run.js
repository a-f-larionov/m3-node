let global = {};
window.onload = function () {
    /** Передаем управление входной точке. */
    var waitToReadyDom = function () {

        if (document.getElementById("appArea").clientWidth === 0) {
            setTimeout(waitToReadyDom, 10);
        } else {
            LogicMain.main();
        }
    }
    waitToReadyDom();
};
