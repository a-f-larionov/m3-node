PageField = function () {
    let self = this;
    this.blocks = [];

    this.init = function () {
        self.blocks.push(PageBlockBackground);
        self.blocks.push(PageBlockField);
        self.blocks.push(PageBlockPanel);
        self.blocks.push(PageBlockZDialogs);
        self.blocks.push(PageBlockWizard);
    };
};

PageField = new PageField;