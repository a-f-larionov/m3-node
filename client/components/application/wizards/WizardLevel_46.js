WizardLevel46_1 = {

    init: function () {
        PBWizard.begin();
        PBWizard.updateText('Соедини песочные камни в ряд.');
    },

    onHideDialog: function () {
        if (WizardLevel46_1.dialogCounter++ < 2) return;
        PBWizard.showHint([{x: 2, y: 1}, {x: 3, y: 1}]);
        PBWizard.showDialog(340, 390, 2);
        PBWizard.highlightCells([
            {x: 3, y: 0, unlock: false},
            {x: 3, y: 1, unlock: true},
            {x: 3, y: 2, unlock: false},
            {x: 2, y: 1, unlock: true},
        ]);
    },
    onDestroyLine: function () {
        LogicWizard.finish();
    }
};