Keys = function () {

    this.health = function (userId) {
        return 'stuff-' + userId + '-health';
    }
};

/** @type {Keys} */
Keys = new Keys();