/**
 * @type{Images}
 * @constructor
 */
let Images = function () {
    /**
     * Заранее загруженные картинки, но с timestamp-ом.
     * timestamp вставлять везде сложно, проще сделать это в одном месте.
     * @param url
     * @returns {*}
     */
    this.getPath = function (url) {
        return this.getMeta(url).path;
    };

    this.getRealPath = function (url) {
        return '/images/' + url;
    };

    this.getHeight = function (url) {
        return this.getMeta(url).h;
    };

    this.getWidth = function (url) {
        return this.getMeta(url).w;
    };

    this.getX = function (url) {
        return this.getMeta(url).x;
    };

    this.getY = function (url) {
        return this.getMeta(url).y;
    };

    let notFoundImg = {
        path: '',
        w: undefined,
        h: undefined,
        x: 0,
        y: 0
    };

    let notfounds = [];

    /**
     * Return image meta data
     * @param url
     * @returns {{path: string, w: number, h: number}}
     */
    this.getMeta = function (url) {
        /** Абсолютный url, используем без изменений, т.к. это внешний url */
        if (url && url.indexOf('https://') === 0 || url.indexOf('http://') === 0) {
            notFoundImg.path = url;
            notFoundImg.absolute = true;
            return notFoundImg;
        }
        if (!url || !window.i_d[url]) {
            if (notfounds.indexOf(url) !== -1) return notFoundImg;
            notfounds.push(url);
            Logs.log("Image url not found for: " + url, Logs.LEVEL_WARNING);
            notFoundImg.path = '';
            return notFoundImg;
        }
        return window.i_d[url];
    };

    let images = {};

    this.getImage = function (url, callback) {

        let path = Images.getPath(url);
        if (!images[path]) {
            images[path] = new Image();
            images[path].onload = function () {
                callback(images[path], Images.getMeta(url));
            };
            images[path].src = path;
            return;
        }
        callback(images[path], Images.getMeta(url));
    };
};

/** @type {Images} */
Images = new Images();