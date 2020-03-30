LogicWizard = function LogicWizard() {
    let self = this;

    this.WIZARD_FIRST_START = 1;

    this.TAG_FIRST_NUMBER_POINT = 1;

    this.onClick = function () {
    };

    this.onAuthorizeSuccess = function () {
        if (LogicUser.getCurrentUser().nextPointId === 1) {
            self.start(self.WIZARD_FIRST_START);

        }
    };

    this.start = function (wizardId) {
        switch (wizardId) {
            case self.WIZARD_FIRST_START:
                self.onClick = self.wizardFirstStartOnClick;
                self.wizardFirstStartInit();
                break;
        }
    };

    this.wizardFirstStartInit = function () {
        PageBlockWizard.begin();
        PageBlockWizard.updateText('НАЖМИ НА КРАСНЫЙ КРУЖОК ЧТО БЫ НАЧАТЬ ИГРАТЬ!');
        PageBlockWizard.showDialog();
        PageBlockWizard.draw(function (cntx) {
            drawImage(cntx, '/images/wizard-02.png', -5, 140);
        });
    };

    this.wizardFirstStartOnClick = function (el) {
        if (el.tagId === self.TAG_FIRST_NUMBER_POINT) {
            PageBlockWizard.finish();
        }
    };

    let drawImage = function (cntx, url, x, y) {
        let image;
        image = new Image();
        image.onload = function () {
            cntx.drawImage(image, x, y);
        };
        image.src = url;
    }
};

/** @type {LogicWizard} */
LogicWizard = new LogicWizard();

