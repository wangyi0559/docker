/**
 * Created by jimin on 17/5/2.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

/**
 * 
 * 
 * 
 * 存储在市场上售出的数字资产信息
 * 
 * 
 */
// _id 就是申请单编号。
var LocalApplicationModel = new Schema({
    //     coreDataId: String,
    //     buyer: String,
    //     cangdanId: String, //仓单编号
    //     state: String,
    //     patientAgree: String,
    //     userId: String,
    //     hospitalAgree: String,
    //     type: String,
    // //    patientVerifyCode: String,
    // //    hospitalVerifyCode: String,
    //     admin: {
    //         type: Boolean,
    //         default: false
    //     }
    state: String, //状态
    bianhao: String,
    userId: String,//资产拥有者id
    buyer:String,//想要购买者id
    pinming: String,//品名
    guige: String,//
    caizhi: String,//
    chandi: String,//
    shuliang: String,//
    zhongliang: String,//
    jianshu: String,//
    //jiazhi:String,
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

module.exports = mongoose.model('application', LocalApplicationModel);