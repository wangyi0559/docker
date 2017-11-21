
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

/**
*人民币与欧冶币互相兑换申请

 */
// _id 就是兑换申请单编号。
var ChangeApplicationModel = new Schema({
    userId: String,//兑换申请者
    amount: Number,//兑换的数量
    type: String,//兑换欧冶币 or 兑换人民币
    changedate: String,//兑换申请日期
    changeAgree: String,//是否同意兑换 1同意 2 拒绝 3 未决定
    txid: String,
    admin: {
        type: Boolean,
        default: false
    }
});

module.exports = mongoose.model('changeapplication',ChangeApplicationModel);