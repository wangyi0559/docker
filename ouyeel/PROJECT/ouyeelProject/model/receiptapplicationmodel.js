var mongoose = require('mongoose');
var Schema = mongoose.Schema;

/**
 * Agree: 1 代表同意，
 * 购买资产的交易申请数据库
 */
// _id 就是申请单编号。
var ReceiptApplicationModel = new Schema({
    // state: String, //状态                state
    // buyer: String,//用户ID              userId
    // cangdanId: String, //仓单编号
    // type: String,// 类型（实物资产，产能） type
    // quantity: String,//数量，重量             content
    // money: String,// 金额                     money
	// adminAgree:String,
    // admin: {
    //     type: Boolean,
    //     default: false
    // }
    state: String, //状态
    userId: String,//用户ID
    pinming: String,//品名
    guige:String,//
    caizhi:String,//
    chandi:String,//
    shuliang:String,//
    zhongliang:String,//
    jianshu:String,//
    adminAgree:String,
    cangdanId: String, //仓单编号
    cangku:String, //交割仓库
    type: String,// 类型（实物资产，产能）
    //content: String,//数量，重量
    money: Number,// 金额
    admin: {
        type: Boolean,
        default: false
    }
});

module.exports = mongoose.model('receiptapplicationmodel',ReceiptApplicationModel);