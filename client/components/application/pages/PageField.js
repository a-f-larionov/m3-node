PageField = function () {
    var self = this;
    this.blocks = [];

    this.init = function () {
        self.blocks.push(PageBlockBackground);
        self.blocks.push(PageBlockField);
    };
};

PageField = new PageField;