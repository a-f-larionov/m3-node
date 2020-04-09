Images = function () {
    /**
     * Заранее загруженные картинки, но с timestamp-ом.
     * timestamp вставлять везде сложно, проще сделать это в одном месте.
     * @param url
     * @returns {*}
     */
    this.getImagePath = function (url) {
        return this.getImageMetaData(url).path;
    };

    this.getImageHeight = function (url) {
        return this.getImageMetaData(url).h;
    };

    this.getImageWidth = function (url) {
        return this.getImageMetaData(url).w;
    };

    this.getImageX = function (url) {
        return this.getImageMetaData(url).x;
    };

    this.getImageY = function (url) {
        return this.getImageMetaData(url).y;
    };

    let notFoundImg = {
        path: '',
        w: undefined,
        h: undefined,
        x: 0,
        y: 0
    };

    /**
     * Return image meta data
     * @param url
     * @returns {{path: string, w: number, h: number}}
     */
    this.getImageMetaData = function (url) {
        /** Абсолютный url, используем без изменений, т.к. это внешний url */
        if (!url) {
            Logs.log("Url not found:" + url, Logs.LEVEL_ERROR);
            throw Error("Url not found:" + url, Logs.LEVEL_ERROR);
        }
        if (url.indexOf('https://') === 0 || url.indexOf('http://') === 0) {
            notFoundImg.path = url;
            return notFoundImg;
        }
        if (!window.imagesData[url]) {
            Logs.log("Image url not found for: " + url, Logs.LEVEL_ERROR);
            notFoundImg.path = url;
            return notFoundImg;
        }
        return window.imagesData[url];
    };
};

/** @type {Images} */
Images = new Images();