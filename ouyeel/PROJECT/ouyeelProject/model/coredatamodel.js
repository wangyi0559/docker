/**
 * Created by jimin on 17/5/2.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

/*
* 存储市场在售数字资产信息
* _id 就是资产编号*/ //资产ID
var CoreDataModel = new Schema({
    bianhao:String,
    state: String, //状态
    userId: String,//用户ID
    pinming: String,//品名
    guige:String,//
    caizhi:String,//
    chandi:String,//
    shuliang:String,//
    zhongliang:String,//
    jianshu:String,//
    cangdanId: String, //仓单编号
    cangku:String, //交割仓库
    type: String,// 类型（实物资产，产能）
    //content: String,//数量，重量
    money: Number,// 金额
    buyer: String,
    txid: String,
    changeTxid: String,
    admin: {
        type: Boolean,
        default: false
    }
});

module.exports = mongoose.model('coredata',CoreDataModel);