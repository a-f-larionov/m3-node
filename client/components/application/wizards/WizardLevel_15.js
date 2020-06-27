let WizardLevel15_1 = {

    init: function () {
        PBWizard.begin();
    },

    onHideDialog: function () {
        if (WizardLevel15_1.dialogCounter++ < 2) return;
        PBWizard.showHint([{x: 4, y: 5}, {x: 4, y: 4}]);
        PBWizard.updateText('Собирай кристаллы, чтобы снять цепь.');
        PBWizard.showDialog(210, 150, 2, 20);
        PBWizard.highlightCells([
            {x: 4, y: 4, unlock: true},
            {x: 3, y: 5, unlock: false},
            {x: 4, y: 5, unlock: true},
            {x: 5, y: 5, unlock: false},
        ]);
    },
    onDestroyLine: function () {
        LogicWizard.finish(true);
    }
};