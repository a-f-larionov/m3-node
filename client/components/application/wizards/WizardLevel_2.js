WizardLevel2_1 = {

    init: function () {
        PBWizard.begin();
        PBWizard.updateText(
            'Собрав ряд из 4ёх камней, получишь камень с молнией'
        );
        setTimeout(function () {
            PBWizard.showHint([{x: 1, y: 3}, {x: 2, y: 3}]);
            PBWizard.showDialog(210, 400, 5, 20);
            PBWizard.draw(function (unlockByImg, showByImg) {
                let coords = PageBlockField.getElementField().getCoords();
                showByImg('/images/wizard-diamond-cell.png',
                    coords.x + DataPoints.BLOCK_WIDTH * 2,
                    coords.y + DataPoints.BLOCK_HEIGHT * 2);
                showByImg('/images/wizard-diamond-cell.png',
                    coords.x + DataPoints.BLOCK_WIDTH * 2,
                    coords.y + DataPoints.BLOCK_HEIGHT * 3);
                unlockByImg('/images/wizard-diamond-cell.png',
                    coords.x + DataPoints.BLOCK_WIDTH * 1,
                    coords.y + DataPoints.BLOCK_HEIGHT * 4);
                unlockByImg('/images/wizard-diamond-cell.png',
                    coords.x + DataPoints.BLOCK_WIDTH * 2,
                    coords.y + DataPoints.BLOCK_HEIGHT * 4);
                showByImg('/images/wizard-diamond-cell.png',
                    coords.x + DataPoints.BLOCK_WIDTH * 2,
                    coords.y + DataPoints.BLOCK_HEIGHT * 5);
            });
        }, Config.OnIdle.second * 5.1);
    },
    onDestroyLine: function () {
        LogicWizard.start(WizardLevel2_2);
    }
};

WizardLevel2_2 = {

    init: function () {
        PBWizard.begin();
        PBWizard.updateText(
            'Взорви камень с молнией, что бы использовать её.'
        );
        setTimeout(function () {
            PBWizard.showHint([{x: 1, y: 3}, {x: 2, y: 3}]);
            PBWizard.showDialog(230, 150, 12, 20);
            PBWizard.draw(function (unlockByImg, showByImg) {
                let coords = PageBlockField.getElementField().getCoords();
                unlockByImg('/images/wizard-diamond-cell.png',
                    coords.x + DataPoints.BLOCK_WIDTH * 2,
                    coords.y + DataPoints.BLOCK_HEIGHT * 5);
                unlockByImg('/images/wizard-diamond-cell.png',
                    coords.x + DataPoints.BLOCK_WIDTH * 3,
                    coords.y + DataPoints.BLOCK_HEIGHT * 5);
                showByImg('/images/wizard-diamond-cell.png',
                    coords.x + DataPoints.BLOCK_WIDTH * 4,
                    coords.y + DataPoints.BLOCK_HEIGHT * 5);
                showByImg('/images/wizard-diamond-cell.png',
                    coords.x + DataPoints.BLOCK_WIDTH * 5,
                    coords.y + DataPoints.BLOCK_HEIGHT * 5);
            });
        }, Config.OnIdle.second * 1.1);
    },
    onDestroyLine: function () {
        PageBlockWizard.finish();
    }
};
//2 level
// Собрав ряд из 4ёх камней, полушь камень с молнией.

// Взорви камень с молнией, что бы использовать её.

