let WizardLevel14_1 = {

    init: function () {
        PBWizard.begin();
        PBWizard.updateText('Взорви камни, что бы снять цепь.');
    },

    onHideDialog: function () {
        if (WizardLevel14_1.dialogCounter++ < 2) return;
        PBWizard.showHint([{x: 2, y: 1}, {x: 2, y: 0}]);
        PBWizard.showDialog(210, 400, 2, 20);
        PBWizard.highlightCells([
            {x: 2, y: 0, unlock: true},
            {x: 1, y: 1, unlock: false},
            {x: 2, y: 1, unlock: true},
            {x: 3, y: 1, unlock: false},
        ]);
    },
    onDestroyLine: function () {
        LogicWizard.finish();
    }
};