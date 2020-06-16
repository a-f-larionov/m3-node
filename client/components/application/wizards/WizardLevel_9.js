let WizardLevel9_1 = {

    init: function () {
        PBWizard.begin();
        PBWizard.updateText('Собери кристаллы рядом с ящиками.');
    },

    onHideDialog: function () {
        if (WizardLevel9_1.dialogCounter++ < 2) return;
        PBWizard.showHint([{x: 2, y: 1}, {x: 3, y: 1}]);
        PBWizard.showDialog(210, 380, 2, 20);
        PBWizard.highlightCells([
            {x: 0, y: 1, unlock: false},
            {x: 1, y: 1, unlock: false},
            {x: 2, y: 1, unlock: true},
            {x: 3, y: 1, unlock: true},
        ]);
    },
    onDestroyLine: function () {
        LogicWizard.finish(true);
    }
};