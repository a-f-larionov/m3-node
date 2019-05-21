CAPIStuff = function () {

    this.gotStuff = function (cntx, stuff) {
        LogicStuff.updateStuff(stuff);
    };

    this.incrementGold = function (cntx, gold) {
        LogicStuff.giveAGold(gold);
        PageController.redraw();
    }
};

CAPIStuff = new CAPIStuff();