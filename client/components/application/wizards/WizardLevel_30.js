let WizardLevel_30_1 = {

    init: function () {
        PBWizard.begin();
        PBWizard.updateText('Собирай камни, пока камень не упадёт на дно.');
    },

    onHideDialog: function () {
        if (WizardLevel_30_1.dialogCounter++ < 2) return;
        PBWizard.showHint([{x: 1, y: 2}, {x: 2, y: 2}]);
        PBWizard.showDialog(340, 390, 2);
        PBWizard.highlightCells([
            {x: 1, y: 2, unlock: true},
            {x: 2, y: 2, unlock: true},
            {x: 2, y: 3, unlock: false},
            {x: 2, y: 4, unlock: false},
            //{x: 2, y: 5, unlock: false},
            //{x: 2, y: 6, unlock: false},
        ]);
    },
    onDestroyLine: function () {
        LogicWizard.finish();
    }
};
