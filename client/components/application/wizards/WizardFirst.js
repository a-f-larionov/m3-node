WizardFirstStart_1 = {
    init: function () {
        PBWizard.begin();
        PBWizard.updateText('НАЖМИ НА КРАСНЫЙ КРУЖОК ЧТО БЫ НАЧАТЬ ИГРАТЬ');
        PBWizard.showDialog(400, 360, 4);
        PBWizard.draw(function (unlockByImage) {
            let pnt = DataPoints.getPointsCoords()[0];
            unlockByImage('/images/wizard-point-circle.png',
                pnt.x - Images.getWidth('/images/wizard-point-circle.png') / 2
                + Images.getWidth('/images/map-way-point-red.png') / 2,
                pnt.y - Images.getHeight('/images/wizard-point-circle.png') / 2
                + Images.getHeight('/images/map-way-point-red.png') / 2,
            );
        });
    },

    onClick: function (el) {
        if (el.tagId === LogicWizard.TAG_FIRST_NUMBER_POINT && el.innerText === '1') {
            LogicWizard.start(WizardFirstStart_2);
        }
    }
};

WizardFirstStart_2 = {
    init: function () {
        PBWizard.begin();

        setTimeout(function () {
            PBWizard.updateText('НАЖМИ КНОПКУ ИГРАТЬ');
            PBWizard.showDialog(400, 380, 30);
            PBWizard.draw(function (drawImage) {
                drawImage('/images/wizard-button.png',
                    390 - Images.getWidth('/images/wizard-button.png') / 2, 280 + 42
                );
            });
        }, Config.OnIdle.second * 1.35);
    },
    onClick: function (el) {
        if (el.tagId === LogicWizard.TAG_PLAY_BUTTON) {
            LogicWizard.start(WizardFirstStart_3);
        }
    }
};

WizardFirstStart_3 = {
    init: function () {
        PBWizard.begin();
        PBWizard.updateText(
            'ПОМЕНЯЙ СОСЕДНИЕ КАМНИ МЕСТАМИ, ЧТОБЫ СОБРАТЬ КАМНИ КРАСНОГО ЦВЕТА');
        PBWizard.draw(function (unlockByImage, showByImage) {
            //@todo show goals dialog
        });
        setTimeout(function () {
            PBWizard.showHint([{x: 1, y: 3}, {x: 2, y: 3}]);
            PBWizard.showDialog(210, 380, 5, 20);
            PBWizard.draw(function (unlockByImg, showByImg) {
                let coords = PageBlockField.getElementField().getCoords();
                unlockByImg('/images/wizard-diamond-cell.png',
                    coords.x + DataPoints.BLOCK_WIDTH,
                    coords.y + DataPoints.BLOCK_HEIGHT);
                unlockByImg('/images/wizard-diamond-cell.png',
                    coords.x + DataPoints.BLOCK_WIDTH * 2,
                    coords.y + DataPoints.BLOCK_HEIGHT);
                showByImg('/images/wizard-diamond-cell.png',
                    coords.x + DataPoints.BLOCK_WIDTH * 3,
                    coords.y + DataPoints.BLOCK_HEIGHT);
                showByImg('/images/wizard-diamond-cell.png',
                    coords.x + DataPoints.BLOCK_WIDTH * 4,
                    coords.y + DataPoints.BLOCK_HEIGHT);
            });
        }, Config.OnIdle.second * 5.1);
    },
    onDestroyLine: function (line) {
        LogicWizard.start(WizardFirstStart_4);
    }
};

WizardFirstStart_4 = {
    init: function () {
        PBWizard.begin();
        PBWizard.updateText(
            'У ТЕБЯ ПОЛУЧИЛОСЬ. ДАВАЙ ЕЩЁ!'
        );
        setTimeout(function () {
            PBWizard.showHint([{x: 3, y: 5}, {x: 3, y: 6}]);
            PBWizard.showDialog(210, 380, 15, 21);
            PBWizard.draw(function (unlockByImg, showByImg) {
                let coords = PageBlockField.getElementField().getCoords();
                showByImg('/images/wizard-diamond-cell.png',
                    coords.x + DataPoints.BLOCK_WIDTH * 2,
                    coords.y + DataPoints.BLOCK_HEIGHT * 3);
                unlockByImg('/images/wizard-diamond-cell.png',
                    coords.x + DataPoints.BLOCK_WIDTH * 3,
                    coords.y + DataPoints.BLOCK_HEIGHT * 3);
                showByImg('/images/wizard-diamond-cell.png',
                    coords.x + DataPoints.BLOCK_WIDTH * 4,
                    coords.y + DataPoints.BLOCK_HEIGHT * 3);
                unlockByImg('/images/wizard-diamond-cell.png',
                    coords.x + DataPoints.BLOCK_WIDTH * 3,
                    coords.y + DataPoints.BLOCK_HEIGHT * 4);
            });
        }, Config.OnIdle.second * 1.500);
    },
    onDestroyLine: function (line) {
        PBWizard.finish();
    }
};