WizardLevel4_1 = {

    init: function () {
        PBWizard.begin();
        PBWizard.updateText('Взорви камень, под которым есть золото.');
    },

    dialogCounter: 0,
    onHideDialog: function () {
        if (WizardLevel3_1.dialogCounter++ < 2) return;
        PBWizard.showHint([{x: 2, y: 1}, {x: 3, y: 1}]);
        PBWizard.showDialog(210, 400, 2, 20);
        PBWizard.highlightCells([
            {x: 0, y: 1, unlock: false},
            {x: 1, y: 1, unlock: false},
            {x: 2, y: 1, unlock: true},
            {x: 3, y: 1, unlock: true},
        ]);
    },
    onDestroyLine: function () {
        LogicWizard.start(WizardLevel4_2);
    }
};

WizardLevel4_2 = {

    init: function () {
        PBWizard.begin();
    },

    dialogCounter: 0,
    onFieldSilent: function () {
        PBWizard.updateText('Собери еще золота!');
        PBWizard.showDialog(450, 250, 1, 20);
        PBWizard.showHint([{x: 0, y: 2}, {x: 1, y: 2}]);
        PBWizard.highlightCells([
            {x: 1, y: 0, unlock: false},
            {x: 1, y: 1, unlock: false},
            {x: 1, y: 2, unlock: true},
            {x: 1, y: 3, unlock: false},

            {x: 0, y: 2, unlock: true}
        ]);
    },
    onDestroyLine: function (cell) {
        LogicWizard.finish();
    },
};
