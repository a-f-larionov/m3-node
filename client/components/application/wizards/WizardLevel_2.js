let WizardLevel2_1 = {

    init: function () {
        PBWizard.begin();
        PBWizard.updateText('Собрав ряд из 4-ех камней, получишь камень с молнией.');
    },

    onHideDialog: function () {
        if (WizardLevel2_1.dialogCounter++ < 2) return;
        PBWizard.showDialog(210, 400, 2, 20);
        PBWizard.showHint([{x: 1, y: 3}, {x: 2, y: 3}]);
        PBWizard.draw(function (cntx) {
            cntx.highlightCells([
                {x: 2, y: 1, unlock: false},
                {x: 2, y: 2, unlock: false},
                {x: 1, y: 3, unlock: true},
                {x: 2, y: 3, unlock: true},
                {x: 2, y: 4, unlock: false},

            ]);
        });
    },
    onDestroyLine: function () {
        LogicWizard.start(WizardLevel2_2);
    }
};

let WizardLevel2_2 = {

    init: function () {
        PBWizard.begin();
        PBWizard.updateText('Взорви камень с молнией, чтобы использовать её.');
        setTimeout(function () {
            PBWizard.showHint([{x: 2, y: 4}, {x: 3, y: 4}]);
            PBWizard.showDialog(230, 150, 2, 20);
            PBWizard.draw(function (cntx) {
                cntx.highlightCells([
                    {x: 2, y: 4, unlock: true},
                    {x: 3, y: 4, unlock: true},
                    {x: 4, y: 4, unlock: false},
                    {x: 5, y: 4, unlock: false},
                ]);
            });
        }, Config.OnIdle.second * 1.1);
    },

    onDestroyLine: function () {
        LogicWizard.finish();
    }
};
