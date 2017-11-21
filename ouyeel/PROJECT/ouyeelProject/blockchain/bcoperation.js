/**
 * Created by wangyi on 17/8/27.
 */
var Poster = require("../model/sender").Poster;
var contract = require("../contract");
var BCMessageOY = require('../model/message').BCMessageOY;

// 资金账户：
// [用户名username，用户角色role，账户欧冶币余额balance]

// 充值（兑换）记录：
// [兑换申请者userId，兑换数量amount，兑换欧冶币/人民币type，申请时间changedate, 是否同意兑换changeAgree]

// 转账记录
// [付款人userId，收款人payee，数量amount,付款人余额userIdBalance，收款人余额payeeBalance]

// 数字资产：
// [数字资产编号bianhao，拥有者名称userId，金额money，类型type，状态state，购买者buyer（未售出时购买者为0），

//  品名pinming，规格guige，材质caizhi，产地chandi，数量shuliang，重量zhongliang，件数jianshu，交割仓库cangku]


// 功能，调用合约/函数，参数，后端执行函数，合约功能
// 创建资金账户	MoneyAndCoin	CreateCustomerAccount	资金账户[]	users/register			
// 用户充值欧冶币	MoneyAndCoin	B2CPayCoin		充值记录[]	check/change/verify 		
// 用户间转账欧冶币MoneyAndCoin	C2CPayCoin		转账记录[]	check/transfer/Money
// 创建数字资产	DigitalAsset	CreateDigitalAssets	数字资产[]	check/zichanApply/verify
// 购买数字资产	DigitalAsset	ChangeOwner		[数字资产编号，购买者]	check/buy/application
 


function createCustomerAccount(data, callback) {
    var body = data;
    var msg = new BCMessageOY("CreateCustomerAccount",[String(body.username), String(body.role), String(body.balance)]);

    Poster(contract.moneyAndCoin, msg, function(err, resdata){
        if(err != null){
            callback(err, null);
        }
        callback(null, resdata);
    });
}

function B2CPayCoin(data, callback) {
    var body = data;
    var msg = new BCMessageOY("B2CPayCoin",[String(body.userId), String(body.amount), String(body.type), String(body.changedate), String(body.changeAgree)]);

    Poster(contract.moneyAndCoin, msg, function(err, resdata){
        if(err != null){
            callback(err, null);
        }
        callback(null, resdata);
    });
}
function C2CPayCoin(data, callback) {
    var body = data;
    var msg = new BCMessageOY("C2CPayCoin",[String(body.userId), String(body.payee), String(body.amount),String( body.userIdBalance), String(body.payeeBalance),String(body.payDate)]);
   
    Poster(contract.moneyAndCoin, msg, function(err, resdata){
        if(err != null){
            callback(err, null);
        }
        callback(null, resdata);
    });
}
function createDigitalAssets(data, callback) {
    var body = data; 
    var msg = new BCMessageOY("CreateDigitalAssets",[String(body.bianhao), String(body.userId), String(body.money), String(body.type), String(body.state), String(body.buyer), String(body.pinming),String(body.guige),String(body.caizhi),String(body.chandi),String(body.shuliang),String(body.zhongliang),String(body.jianshu),String(body.cangku)]);

    Poster(contract.digitalAsset, msg, function(err, resdata){
        if(err != null){
            callback(err, null);
        }
        callback(null, resdata);
    });
}
function changeOwner(data, callback) {
    var body = data; 
    var msg = new BCMessageOY("ChangeOwner",[String(body.bianhao), String(body.userId)]);

    Poster(contract.digitalAsset, msg, function(err, resdata){
        if(err != null){
            callback(err, null);
        }
        callback(null, resdata);
    });
}


module.exports = {
    createCustomerAccount: createCustomerAccount,
    B2CPayCoin: B2CPayCoin,
    C2CPayCoin: C2CPayCoin,
    createDigitalAssets: createDigitalAssets,
    changeOwner: changeOwner
};
