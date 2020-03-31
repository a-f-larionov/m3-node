CAPILog = function () {

    this.log = function (ctnx, message, data) {
        console.log(message, data);
    };
};

/** @type {CAPILog} */
CAPILog = new CAPILog();