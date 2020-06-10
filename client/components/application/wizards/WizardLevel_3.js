let WizardLevel3_1 = {

    init: function () {
        PBWizard.begin();
        PBWizard.updateText('Собрав ряд из 5-ти кристаллов, получаешь звезду.');
    },
    onHideDialog: function () {
        if (WizardLevel3_1.dialogCounter++ < 2) return;
        PBWizard.showHint([{x: 4, y: 2}, {x: 4, y: 3}]);
        PBWizard.showDialog(210, 380, 2, 20, 508);
        PBWizard.highlightCells([
            {x: 2, y: 2, unlock: false},
            {x: 3, y: 2, unlock: false},
            {x: 4, y: 2, unlock: true},
            {x: 5, y: 2, unlock: false},
            {x: 6, y: 2, unlock: false},

            {x: 4, y: 3, unlock: true},
        ]);
    },
    onDestroyLine: function () {
        LogicWizard.start(WizardLevel3_2);
    }
};

let WizardLevel3_2 = {

    init: function () {
        PBWizard.begin();
    },
    onFieldSilent: function () {
        PBWizard.updateText('Выбери цвет, чтобы убрать все кристаллы этого цвета.');
        PBWizard.showDialog(230, 50, 2, 20, 458, 160);
        PBWizard.showHint([{x: 4, y: 2}, {x: 5, y: 2}]);
        PBWizard.highlightCells([
            {x: 4, y: 2, unlock: true},
            {x: 5, y: 2, unlock: true}
        ]);
    },
    onDestroyThing: function (cell) {
        if (cell.object.objectId === DataObjects.OBJECT_POLY_COLOR) {
            LogicWizard.finish();
        }
    },
};
