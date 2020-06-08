let WizardLevel51_1 = {

    init: function () {
        PBWizard.begin();
        PBWizard.updateText('Собери ряд кристаллов, чтобы собрать монетки.');
    },

    onHideDialog: function () {
        if (WizardLevel51_1.dialogCounter++ < 2) return;
        PBWizard.showHint([{x: 5, y: 2}, {x: 5, y: 2}]);
        PBWizard.showDialog(340, 390, 2);
        PBWizard.highlightCells([
            {x: 2, y: 2, unlock: false},
            {x: 3, y: 2, unlock: false},
            {x: 4, y: 2, unlock: true},
            {x: 5, y: 2, unlock: true},
        ]);
    },

    onDestroyLine: function () {
        LogicWizard.finish();
    }
};