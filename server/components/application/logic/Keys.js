Keys = function () {

    this.health = function (userId) {
        return 'stuff-' + userId + '-health';
    };

    this.stuff = function (userId, fieldName) {
        return 'stuff-' + userId + "-" + fieldName;
    };
};

/** @type {Keys} */
Keys = new Keys();