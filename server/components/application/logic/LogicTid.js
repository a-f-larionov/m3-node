LogicTid = function () {
    let lastUniqTid = 1;

    this.getOne = function () {
        return lastUniqTid++;
    }
};


LogicTid = new LogicTid;