WizardLevel3_1 = {

    init: function () {
        PBWizard.begin();
        PBWizard.updateText('Собрав ряд из 5-ти камней, получаешь звезду.');
    },
    dialogCounter: 0,
    onHideDialog: function () {
        console.log(WizardLevel3_1.dialogCounter);
        if (WizardLevel3_1.dialogCounter++ < 2) return;
        PBWizard.showHint([{x: 4, y: 2}, {x: 4, y: 3}]);
        PBWizard.showDialog(210, 400, 2, 20);
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

WizardLevel3_2 = {

    init: function () {
        console.log(1);
        PBWizard.begin();
    },
    dialogCounter: 0,
    onFieldSilent: function () {
        PBWizard.updateText('Выбери цвет, что бы убрать все камни этого цвета.');
        PBWizard.showDialog(230, 50, 2, 20);
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
