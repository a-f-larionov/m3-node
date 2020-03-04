CAPIStuff = function () {

    this.gotStuff = function (cntx, stuff) {
        LogicStuff.updateStuff(stuff);
    };

    this.incrementGold = function (cntx, quantity) {
        LogicStuff.giveAGold(quantity);
        PageController.redraw();
    };

    this.decrementGold = function (cntx, quantity) {
        LogicStuff.usedGold(quantity);
        PageController.redraw();
    };
};

CAPIStuff = new CAPIStuff();