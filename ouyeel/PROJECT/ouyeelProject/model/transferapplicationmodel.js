
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// 转账交易数据库
// _id 就是申请单编号。
var TransferApplicationModel = new Schema({
    userId: String,//付款人
   // cangdanId: String, //仓单编号
    payee: String,//收款人
    transferdate: String,//转账时间
  //  payer: String,//付款人 +++
//   userIdBalance:Number,//付款人支付后余额
//   payeeBalance: Number,//收款人支付后余额
    type: Number, //0--欧冶币，1--人民币 +++
    amount: Number,
    txid: String,
    admin: {
        type: Boolean,
        default: false
    }
});

module.exports = mongoose.model('transferapplication',TransferApplicationModel);