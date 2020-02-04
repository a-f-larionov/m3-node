DataPayments = function () {

    let tableName = 'payments';

    let fromDBToData = function (data) {
        if (!data) return data;
        if (data.id) data.id = parseInt(data.id);
        if (data.time) data.time = parseInt(data.time);
        if (data.userId) data.userId = parseInt(data.userId);
        if (data.orderId) data.orderId = parseInt(data.orderId);
        if (data.itemPrice) data.itemPrice = parseInt(data.itemPrice);
        return data;
    };

    this.getByOrderId = function (orderId, callback) {
        DB.queryWhere(tableName, {
            orderId: [orderId]
        }, function (rows) {
            callback(fromDBToData(rows[0]));
        });
    };

    this.createOrder = function (userId, time, orderId, itemPrice, callback) {
        let data = {
            userId: userId,
            time: time,
            orderId: orderId,
            itemPrice: itemPrice
        };
        DB.insert(tableName, data, function (result) {
            // result = {"fieldCount":0,"affectedRows":1,"insertId":0,"serverStatus":2,"warningCount":0,"message":"","protocol41":true,"changedRows":0}
            data.id = result.insertId;
            fromDBToData(data);
            callback(data);
        });
    }
};

/**
 * Статичный класс.
 * @type {DataStuff}
 */
DataPayments = new DataPayments();

DataPayments.depends = ['Logs', 'Profiler', 'DB'];