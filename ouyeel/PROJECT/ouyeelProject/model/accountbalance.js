/**
 * Created by wangjimin on 17/5/14.
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

/*
 * 存储账户余额信息*/
var AccountBalance = new Schema({
    id: String,
    role: String,
    type:String,
    username: String,
    rmbBalance: Number,
    balance: Number,
    sucess: {
        type: Boolean,
        default: false
    }
});

module.exports = mongoose.model('accountbalance', AccountBalance);